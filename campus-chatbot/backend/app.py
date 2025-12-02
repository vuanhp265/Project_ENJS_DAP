import os
from collections import Counter
from datetime import datetime

from bson import ObjectId
from dotenv import load_dotenv
from flask import Flask, request, jsonify, g
from flask_cors import CORS

# DB helpers
from db import (
    faqs_col,
    logs_col,
    pending_col,
    kb_chunks_col,
    kb_docs_col,
    users_col,
)

# NLP + RAG
from nlp import (
    match_intent,
    build_tfidf_corpus,
    semantic_search,
    embed_texts,
    embedding_search,
)

# Auth helpers
from auth import (
    hash_password,
    verify_password,
    generate_token,
    require_auth,
)

# ============================================================
# Config
# ============================================================

load_dotenv()
PORT = int(os.getenv("PORT", 5000))

app = Flask(__name__)
CORS(app)


# ============================================================
# Helpers
# ============================================================

def oid_str(x):
    return str(x) if isinstance(x, ObjectId) else x


def chunk_text(text: str, max_chars: int = 700):
    """
    Chia văn bản dài thành nhiều đoạn nhỏ để lưu vào KB.
    """
    text = (text or "").strip()
    if not text:
        return []

    lines = [l.strip() for l in text.splitlines() if l.strip()]
    chunks = []
    current = ""

    for line in lines:
        if len(current) + len(line) + 1 <= max_chars:
            current = (current + " " + line).strip()
        else:
            if current:
                chunks.append(current)
            current = line

    if current:
        chunks.append(current)

    return chunks


def smalltalk_reply(intent: str) -> str:
    """
    Câu trả lời cho small-talk (chào hỏi / cảm ơn / tạm biệt).
    """
    if intent == "greeting":
        return (
            "Xin chào! 👋 Mình là trợ lý ảo của Student Portal. "
            "Bạn muốn hỏi về học phí, đăng ký môn, lịch học hay lịch thi không?"
        )
    if intent == "thanks":
        return (
            "Rất vui vì đã giúp được bạn 😊 "
            "Nếu còn câu hỏi nào khác, bạn cứ hỏi mình nhé."
        )
    if intent == "goodbye":
        return (
            "Chào tạm biệt bạn nhé 👋 Chúc bạn học tốt và hẹn gặp lại trên Student Portal!"
        )
    return ""


# ============================================================
# Build RAG Index (cache)
# ============================================================

faqs_cache = []
tfidf_pack = None
kb_chunks_cache = []
kb_emb_matrix = None


def reload_index():
    """
    Xây lại TF-IDF + Embedding mỗi khi cập nhật dữ liệu.
    """
    global faqs_cache, tfidf_pack, kb_chunks_cache, kb_emb_matrix

    # FAQs cache
    faqs_cache = list(faqs_col().find({}))
    tfidf_pack = build_tfidf_corpus(faqs_cache)

    # KB chunks + embedding
    kb_chunks_cache = list(kb_chunks_col().find({}))
    if kb_chunks_cache:
        texts = [
            (c.get("title", "") + " " + c.get("text", "")).strip()
            for c in kb_chunks_cache
        ]
        kb_emb_matrix = embed_texts(texts)
    else:
        kb_emb_matrix = None


# Khởi tạo index một lần khi start server
reload_index()


# ============================================================
# AUTH API
# ============================================================

@app.route("/api/auth/register-student", methods=["POST"])
def register_student():
    data = request.get_json() or {}
    full_name = (data.get("full_name") or "").strip()
    email = (data.get("email") or "").lower().strip()
    password = (data.get("password") or "").strip()

    if not full_name or not email or not password:
        return jsonify({"message": "Missing fields"}), 400

    if users_col().find_one({"email": email}):
        return jsonify({"message": "Email already in use"}), 400

    user = {
        "full_name": full_name,
        "email": email,
        "password": hash_password(password),
        "role": "student",
        "created_at": datetime.utcnow(),
    }
    users_col().insert_one(user)

    return jsonify({"message": "Student registered successfully"}), 201


@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").lower().strip()
    password = (data.get("password") or "").strip()

    user = users_col().find_one({"email": email})
    if not user or not verify_password(password, user.get("password", "")):
        return jsonify({"message": "Invalid email or password"}), 400

    token = generate_token(user)

    return jsonify({
        "token": token,
        "role": user.get("role", "student"),
        "full_name": user.get("full_name", ""),
        "email": user.get("email", ""),
    }), 200


@app.route("/api/auth/profile", methods=["GET"])
@require_auth()
def get_profile():
    user = g.current_user
    return jsonify({
        "full_name": user.get("full_name", ""),
        "email": user.get("email", ""),
        "role": user.get("role", "student"),
    }), 200


@app.route("/api/auth/profile", methods=["PUT"])
@require_auth()
def update_profile():
    user = g.current_user
    data = request.get_json() or {}

    full_name = (data.get("full_name") or "").strip()
    email = (data.get("email") or "").strip().lower()

    if not full_name or not email:
        return jsonify({"message": "Full name and email are required."}), 400

    # Kiểm tra email trùng cho user khác
    existing = users_col().find_one({"email": email, "_id": {"$ne": user["_id"]}})
    if existing:
        return jsonify({"message": "Email is already used by another account."}), 400

    update_doc = {"full_name": full_name, "email": email}
    users_col().update_one({"_id": user["_id"]}, {"$set": update_doc})

    user.update(update_doc)

    return jsonify({
        "message": "Profile updated.",
        "user": {
            "full_name": user.get("full_name", ""),
            "email": user.get("email", ""),
            "role": user.get("role", "student"),
        },
    }), 200


@app.route("/api/auth/change-password", methods=["POST"])
@require_auth()
def change_password():
    user = g.current_user
    data = request.get_json() or {}

    old_password = data.get("old_password") or ""
    new_password = data.get("new_password") or ""

    if not verify_password(old_password, user.get("password", "")):
        return jsonify({"message": "Current password is incorrect."}), 400

    if len(new_password) < 6:
        return jsonify({"message": "New password must be at least 6 characters."}), 400

    new_hash = hash_password(new_password)
    users_col().update_one({"_id": user["_id"]}, {"$set": {"password": new_hash}})

    return jsonify({"message": "Password changed successfully."}), 200


# ============================================================
# FAQ (Admin only)
# ============================================================

@app.route("/api/faqs", methods=["GET", "POST"])
@require_auth(role="admin")
def faqs():
    if request.method == "POST":
        data = request.get_json() or {}
        doc = {
            "intent": data.get("intent", "unknown"),
            "question": data.get("question", ""),
            "answer": data.get("answer", ""),
            "tags": data.get("tags", []),
            "updated_at": datetime.utcnow(),
        }
        faqs_col().insert_one(doc)
        reload_index()
        doc["_id"] = oid_str(doc.get("_id"))
        return jsonify(doc), 201

    items = []
    for f in faqs_col().find({}).sort("updated_at", -1):
        f["_id"] = oid_str(f["_id"])
        items.append(f)
    return jsonify(items), 200


# ============================================================
# CHAT API
# ============================================================

@app.route("/api/chat/query", methods=["POST"])
def chat_query():
    data = request.get_json() or {}

    # ====== Input ======
    query = (data.get("query") or "").strip()
    history = data.get("history") or []       # danh sách message gần đây từ frontend
    user_email = (data.get("user_email") or "").strip() or None

    if not query:
        return jsonify({"error": "query required"}), 400

    # ====== 1) Intent detection ======
    intent, intent_score = match_intent(query)

    # ====== 1a) Small-talk xử lý riêng ======
    if intent in ("greeting", "thanks", "goodbye") and intent_score >= 0.3:
        answer = smalltalk_reply(intent)

        logs_col().insert_one({
            "query": query,
            "answer": answer,
            "matched_intent": intent,
            "score": float(intent_score),
            "created_at": datetime.utcnow(),
            "user_email": user_email,
            "history": history[-5:],  # log short history
            "used_rag": False,
            "source": "smalltalk",
        })

        return jsonify({
            "answer": answer,
            "matched_intent": intent,
            "score": float(intent_score),
            "alternatives": [],
            "low_confidence": False,
        }), 200

    # ====== 2) FAQ semantic search (TF-IDF) ======
    sem_results = semantic_search(query, tfidf_pack, top_k=3) if tfidf_pack else []
    best_doc = None
    best_doc_score = 0.0
    alternatives = []

    if sem_results:
        for idx0, r in enumerate(sem_results):
            i = int(r["idx"])
            if 0 <= i < len(faqs_cache):
                faq_doc = faqs_cache[i]
                if idx0 == 0:
                    best_doc = faq_doc
                    best_doc_score = float(r["score"])
                else:
                    alternatives.append(faq_doc)

    answer = None
    matched_intent = intent
    score = float(intent_score)

    # Lấy answer tốt nhất từ FAQ
    if best_doc:
        answer = best_doc.get("answer") or ""
        matched_intent = best_doc.get("intent") or intent
        score = max(score, best_doc_score)

    # ====== 3) Fallback theo intent nếu chưa có answer ======
    if not answer and intent != "unknown":
        fallback = faqs_col().find_one({"intent": intent})
        if fallback:
            answer = fallback.get("answer") or ""
            matched_intent = intent
            score = max(score, 0.6)

    low_conf = score < 0.35
    used_rag = False
    create_pending = False  # có cần ghi vào pending không

    # ====== 4) RAG fallback nếu độ tin cậy thấp ======
    if low_conf:
        rag_results = embedding_search(query, kb_chunks_cache, kb_emb_matrix, top_k=3)
        if rag_results:
            used_rag = True
            snippets = []

            for r in rag_results:
                i = int(r["idx"])
                if 0 <= i < len(kb_chunks_cache):
                    c = kb_chunks_cache[i]
                    text = c.get("text", "")
                    if len(text) > 600:
                        text = text[:600] + "..."
                    title = c.get("title", "Document")
                    source = c.get("source") or "KB"
                    snippets.append(f"- {title} ({source}):\n{text}")

            answer = (
                "Mình chưa chắc câu trả lời từ FAQ.\n"
                "Dưới đây là thông tin tham khảo từ tài liệu trường (RAG):\n\n"
                + "\n\n".join(snippets)
            )
            low_conf = False
        else:
            # Không tìm được trong KB luôn -> gửi pending cho admin
            answer = (
                "Hiện mình chưa có thông tin cho câu hỏi này trong hệ thống.\n"
                "Bạn có thể liên hệ phòng đào tạo hoặc chờ admin cập nhật thêm FAQ nhé."
            )
            create_pending = True

    # Nếu vẫn là intent unknown & score thấp -> cũng gửi pending
    if matched_intent == "unknown" and score < 0.5:
        create_pending = True

    # ====== 5) Log lại cho Dashboard ======
    log_doc = {
        "query": query,
        "answer": answer,
        "matched_intent": matched_intent,
        "score": float(score),
        "created_at": datetime.utcnow(),
        "user_email": user_email,
        "history": history[-5:],   # chỉ log vài câu gần nhất
        "used_rag": used_rag,
        "source": "faq_rag" if used_rag else "faq_only",
    }
    logs_col().insert_one(log_doc)

    # ====== 6) Ghi vào pending nếu cần admin xem xét ======
    if create_pending:
        pending_col().insert_one({
            "query": query,
            "matched_intent": matched_intent,
            "score": float(score),
            "user_email": user_email,
            "history": history[-5:],
            "status": "new",
            "created_at": datetime.utcnow(),
        })

    # ====== 7) Trả kết quả cho frontend ======
    return jsonify({
        "answer": answer,
        "matched_intent": matched_intent,
        "score": float(score),
        "alternatives": [
            {"question": a.get("question"), "answer": a.get("answer")}
            for a in alternatives[:2]
        ],
        "low_confidence": low_conf,
    }), 200


@app.route("/api/chat/history", methods=["GET"])
@require_auth()
def chat_history():
    """
    Trả về lịch sử chat theo user (dựa trên email).
    Dùng để render lại khi mở Chatbox (AI).
    """
    user = g.current_user
    email = user.get("email")
    if not email:
        return jsonify({"messages": []}), 200

    logs = list(
        logs_col()
        .find({"user_email": email})
        .sort("created_at", -1)
        .limit(30)
    )

    messages = []
    # Đảo ngược để tin cũ lên trước
    for log in reversed(logs):
        ts = log.get("created_at", datetime.utcnow())
        if isinstance(ts, datetime):
            ts_str = ts.isoformat()
        else:
            ts_str = str(ts)

        q = log.get("query", "")
        a = log.get("answer", "")

        if q:
            messages.append({
                "sender": "user",
                "text": q,
                "ts": ts_str,
            })
        if a:
            messages.append({
                "sender": "bot",
                "text": a,
                "ts": ts_str,
            })

    return jsonify({"messages": messages}), 200


# ============================================================
# Pending Questions (Admin)
# ============================================================

@app.route("/api/questions/pending", methods=["GET"])
@require_auth(role="admin")
def pending_questions():
    items = list(pending_col().find({"status": "new"}).sort("created_at", -1))
    for q in items:
        q["_id"] = oid_str(q["_id"])
    return jsonify(items), 200


@app.route("/api/questions/<qid>", methods=["PATCH"])
@require_auth(role="admin")
def update_question_status(qid):
    data = request.get_json() or {}
    status = data.get("status")
    if status not in ("new", "in_progress", "done"):
        return jsonify({"error": "invalid status"}), 400

    pending_col().update_one(
        {"_id": ObjectId(qid)},
        {"$set": {"status": status}},
    )

    return jsonify({"message": "updated"}), 200


# ============================================================
# Knowledge Base (RAG Admin)
# ============================================================

@app.route("/api/kb/docs", methods=["GET", "POST"])
@require_auth(role="admin")
def kb_docs():
    if request.method == "POST":
        data = request.get_json() or {}
        title = (data.get("title") or "").strip()
        source = (data.get("source") or "").strip()
        content = (data.get("content") or "").strip()

        if not title or not content:
            return jsonify({"error": "title & content required"}), 400

        doc = {
            "title": title,
            "source": source or "Custom KB",
            "content": content,
            "created_at": datetime.utcnow(),
        }
        res = kb_docs_col().insert_one(doc)
        doc_id = res.inserted_id

        # Tạo chunks
        chunks = chunk_text(content, max_chars=700)
        cdocs = []
        for t in chunks:
            cdocs.append({
                "doc_id": doc_id,
                "title": title,
                "source": source,
                "text": t,
                "created_at": datetime.utcnow(),
            })

        if cdocs:
            kb_chunks_col().insert_many(cdocs)

        reload_index()

        doc["_id"] = oid_str(doc_id)
        doc["chunk_count"] = len(chunks)
        return jsonify(doc), 201

    # GET
    docs = []
    for d in kb_docs_col().find({}).sort("created_at", -1):
        docs.append({
            "_id": oid_str(d["_id"]),
            "title": d.get("title"),
            "source": d.get("source"),
            "created_at": d.get("created_at"),
            "chunk_count": kb_chunks_col().count_documents({"doc_id": d["_id"]}),
        })
    return jsonify(docs), 200


@app.route("/api/kb/search", methods=["POST"])
@require_auth(role="admin")
def kb_search():
    data = request.get_json() or {}
    q = (data.get("query") or "").strip()
    if not q:
        return jsonify({"error": "query required"}), 400

    res = embedding_search(q, kb_chunks_cache, kb_emb_matrix, top_k=3)
    output = []

    for r in res:
        idx = r["idx"]
        c = kb_chunks_cache[idx]
        text = c.get("text", "")
        if len(text) > 700:
            text = text[:700] + "..."

        output.append({
            "title": c.get("title"),
            "source": c.get("source"),
            "text": text,
            "score": r["score"],
        })

    return jsonify({"query": q, "results": output}), 200


# ============================================================
# Logs (Admin)
# ============================================================

@app.route("/api/logs", methods=["GET"])
@require_auth(role="admin")
def get_logs():
    limit = int(request.args.get("limit", 50))
    logs = list(
        logs_col().find({}).sort("created_at", -1).limit(limit)
    )
    for l in logs:
        l["_id"] = oid_str(l["_id"])
    return jsonify(logs), 200


@app.route("/api/logs/stats", methods=["GET"])
@require_auth(role="admin")
def logs_stats():
    """Thống kê tổng logs, FAQ count, pending, top intent, daily chart."""
    all_logs = list(logs_col().find({}))

    total_logs = len(all_logs)

    # Intent count
    intent_counter = Counter(
        (log.get("matched_intent") or "unknown")
        for log in all_logs
    )

    intent_stats = [
        {"intent": k, "count": v}
        for k, v in intent_counter.most_common()
    ]

    # Daily stats
    daily_counter = Counter()
    for log in all_logs:
        dt = log.get("created_at")
        if isinstance(dt, datetime):
            day = dt.strftime("%Y-%m-%d")
            daily_counter[day] += 1

    daily_stats = [
        {"date": day, "count": daily_counter[day]}
        for day in sorted(daily_counter.keys())
    ]

    return jsonify({
        "faq": faqs_col().count_documents({}),
        "logs": total_logs,
        "pending": pending_col().count_documents({"status": "new"}),
        "intents": intent_stats,
        "daily": daily_stats,
    }), 200


# ============================================================
# Run server
# ============================================================

if __name__ == "__main__":
    app.run(port=PORT, debug=True)
