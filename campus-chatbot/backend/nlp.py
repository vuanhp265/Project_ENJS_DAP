"""
NLP helpers for Campus Chatbot

- Rule-based intent detection with many campus-related intents
- FAQ TF-IDF semantic search
- Simple "embedding" search for RAG using TF-IDF as vector representation
"""

from __future__ import annotations

from typing import List, Dict, Any

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ============================================================
# Text utils
# ============================================================


def normalize_text(text: str) -> str:
    return (text or "").lower().strip()


# ============================================================
# Intent dictionary (mở rộng rất nhiều mẫu câu)
# ============================================================

INTENT_PATTERNS: Dict[str, List[str]] = {
    # ----- Small talk -----
    "greeting": [
        "xin chào",
        "chào bạn",
        "chào ad",
        "chào bot",
        "hello",
        "hi",
        "hey",
        "alo",
        "chào buổi sáng",
        "chào buổi tối",
    ],
    "thanks": [
        "cảm ơn",
        "cám ơn",
        "cảm ơn bạn",
        "thank",
        "thanks",
        "thank you",
        "thx",
        "tks",
    ],
    "goodbye": [
        "tạm biệt",
        "bye",
        "goodbye",
        "see you",
        "hẹn gặp lại",
    ],

    # ----- Tuition / Finance -----
    "hoc_phi": [
        "học phí",
        "hoc phi",
        "học phí mỗi tín chỉ",
        "hoc phi moi tin chi",
        "đóng học phí",
        "dong hoc phi",
        "nộp học phí",
        "nop hoc phi",
        "hạn đóng học phí",
        "han dong hoc phi",
        "tuition fee",
        "tuition",
        "payment deadline",
    ],
    "hoc_bong": [
        "học bổng",
        "hoc bong",
        "scholarship",
        "điều kiện học bổng",
        "điều kiện nhận học bổng",
        "criteria for scholarship",
    ],

    # ----- Registration / course -----
    "dang_ky_mon": [
        "đăng ký môn",
        "dang ky mon",
        "đăng ký học phần",
        "dang ky hoc phan",
        "dk môn",
        "dk hoc phan",
        "add môn",
        "add mon",
        "course registration",
        "register course",
        "how to register course",
    ],
    "rut_mon": [
        "rút môn",
        "rut mon",
        "withdraw course",
        "drop course",
        "hủy môn",
        "huy mon",
    ],
    "hoc_lai": [
        "học lại",
        "hoc lai",
        "retake",
        "đăng ký học lại",
        "dang ky hoc lai",
        "học cải thiện",
        "hoc cai thien",
    ],

    # ----- Schedule / timetable / exam -----
    "lich_hoc": [
        "lịch học",
        "lich hoc",
        "thời khóa biểu",
        "tkb",
        "class schedule",
        "timetable",
        "thay đổi lịch học",
        "thay doi lich hoc",
    ],
    "lich_thi": [
        "lịch thi",
        "lich thi",
        "exam schedule",
        "exam timetable",
        "thi cuối kỳ",
        "thi cuoi ky",
        "midterm exam",
        "final exam",
        "phòng thi",
        "phong thi",
    ],
    "diem_danh": [
        "điểm danh",
        "diem danh",
        "attendance",
        "vắng mặt",
        "vang mat",
        "nghỉ học",
        "nghi hoc",
    ],

    # ----- Academic rules / grading / graduation -----
    "quy_che": [
        "quy chế",
        "quy che",
        "quy định học vụ",
        "hoc vu",
        "academic regulation",
    ],
    "diem_so": [
        "tính điểm",
        "tinh diem",
        "cách tính gpa",
        "cach tinh gpa",
        "grading",
        "điểm trung bình",
        "diem trung binh",
    ],
    "tot_nghiep": [
        "tốt nghiệp",
        "tot nghiep",
        "điều kiện tốt nghiệp",
        "dieu kien tot nghiep",
        "graduation",
        "graduation requirements",
    ],

    # ----- Facilities: library, dorm, parking, cafeteria -----
    "thu_vien": [
        "thư viện",
        "thu vien",
        "library",
        "mở cửa thư viện",
        "gio mo cua thu vien",
        "mượn sách",
        "muon sach",
        "trả sách",
        "tra sach",
    ],
    "ky_tuc_xa": [
        "ký túc xá",
        "ky tuc xa",
        "kí túc xá",
        "kí túc",
        "kí túc trường",
        "kTX",
        "k tx",
        "dorm",
        "dormitory",
        "ở ký túc",
        "o ky tuc",
    ],
    "bai_giu_xe": [
        "bãi giữ xe",
        "bai giu xe",
        "parking",
        "gửi xe",
        "gui xe",
        "thẻ giữ xe",
        "the giu xe",
    ],
    "can_tin": [
        "căn tin",
        "can tin",
        "canteen",
        "nhà ăn",
        "nha an",
        "quán ăn trong trường",
        "quan an trong truong",
    ],

    # ----- IT / account / portal -----
    "ho_tro_cntt": [
        "it support",
        "it helpdesk",
        "helpdesk",
        "hỗ trợ cntt",
        "ho tro cntt",
        "wifi",
        "đổi mật khẩu wifi",
        "quen mật khẩu wifi",
        "portal",
        "tài khoản portal",
        "tai khoan portal",
        "quên mật khẩu portal",
        "forgot portal password",
        "sinhvien portal",
        "student portal",
        "email sinh viên",
        "email sinh vien",
    ],

    # ----- Offices / departments -----
    "phong_dao_tao": [
        "phòng đào tạo",
        "phong dao tao",
        "academic office",
        "training department",
        "phòng giáo vụ",
        "phong giao vu",
    ],
    "phong_cong_tac_sv": [
        "phòng công tác sinh viên",
        "phong cong tac sinh vien",
        "student affairs office",
    ],

    # ----- Career / internship / activities -----
    "thuc_tap": [
        "thực tập",
        "thuc tap",
        "internship",
        "đăng ký thực tập",
        "dang ky thuc tap",
        "kỳ thực tập",
        "ky thuc tap",
    ],
    "viec_lam": [
        "việc làm",
        "viec lam",
        "career",
        "job",
        "tuyển dụng",
        "tuyen dung",
        "career fair",
    ],
    "clb": [
        "câu lạc bộ",
        "cau lac bo",
        "club",
        "hoạt động ngoại khóa",
        "hoat dong ngoai khoa",
    ],

    # Fallback
    "unknown": [],
}


def match_intent(query: str):
    """
    Simple rule-based intent detection.

    Returns:
        (intent: str, score: float)
    """
    q = normalize_text(query)

    best_intent = "unknown"
    best_score = 0.0

    for intent, patterns in INTENT_PATTERNS.items():
        if intent == "unknown":
            continue
        for p in patterns:
            p_norm = normalize_text(p)
            if not p_norm:
                continue
            if p_norm in q:
                # score dựa trên độ dài pattern so với câu hỏi
                score = len(p_norm) / max(len(q), len(p_norm))
                if score > best_score:
                    best_score = score
                    best_intent = intent

    return best_intent, float(best_score)


# ============================================================
# FAQ TF-IDF semantic search
# ============================================================


def build_tfidf_corpus(faqs: List[Dict[str, Any]]):
    """
    Build TF-IDF vectorizer + matrix from FAQ list.

    Args:
        faqs: list of documents with at least "question" field.

    Returns:
        dict with keys {"vectorizer", "matrix"} or None if no data.
    """
    if not faqs:
        return None

    texts = []
    for f in faqs:
        q = f.get("question", "")
        tags = f.get("tags", [])
        tag_str = " ".join(tags) if isinstance(tags, list) else str(tags)
        texts.append(f"{q} {tag_str}")

    vectorizer = TfidfVectorizer(
        max_features=4000,
        ngram_range=(1, 2),
        sublinear_tf=True,
    )
    matrix = vectorizer.fit_transform(texts)

    return {
        "vectorizer": vectorizer,
        "matrix": matrix,
    }


def semantic_search(query: str, tfidf_pack, top_k: int = 3):
    """
    Search similar FAQs using TF-IDF cosine similarity.

    Returns:
        list of {"idx": int, "score": float}
    """
    if not tfidf_pack:
        return []

    vectorizer: TfidfVectorizer = tfidf_pack["vectorizer"]
    matrix = tfidf_pack["matrix"]

    q_vec = vectorizer.transform([query])
    sims = cosine_similarity(q_vec, matrix).ravel()

    if sims.size == 0:
        return []

    idx_scores = sorted(
        enumerate(sims),
        key=lambda x: x[1],
        reverse=True,
    )[:top_k]

    results = [
        {"idx": int(i), "score": float(s)}
        for i, s in idx_scores
        if s > 0
    ]
    return results


# ============================================================
# RAG "embeddings" using TF-IDF
# ============================================================

_kb_vectorizer: TfidfVectorizer | None = None


def embed_texts(texts: List[str]):
    """
    Convert KB chunks to vector matrix.

    For simplicity we still use TF-IDF here, but separated from FAQ vectorizer.
    """
    global _kb_vectorizer
    _kb_vectorizer = TfidfVectorizer(
        max_features=6000,
        ngram_range=(1, 2),
        sublinear_tf=True,
    )
    matrix = _kb_vectorizer.fit_transform(texts)
    return matrix


def embedding_search(
    query: str,
    chunks: List[Dict[str, Any]],
    emb_matrix,
    top_k: int = 3,
):
    """
    Search KB chunks using TF-IDF embeddings.

    Args:
        query: user query
        chunks: list of KB chunk docs (only length used here)
        emb_matrix: TF-IDF matrix returned by embed_texts
        top_k: number of top results

    Returns:
        list of {"idx": int, "score": float}
    """
    global _kb_vectorizer
    if emb_matrix is None or _kb_vectorizer is None:
        return []

    q_vec = _kb_vectorizer.transform([query])
    sims = cosine_similarity(q_vec, emb_matrix).ravel()

    if sims.size == 0:
        return []

    idx_scores = sorted(
        enumerate(sims),
        key=lambda x: x[1],
        reverse=True,
    )[:top_k]

    results = [
        {"idx": int(i), "score": float(s)}
        for i, s in idx_scores
        if s > 0
    ]
    return results
