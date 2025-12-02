import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function AdminFaq() {
  const [faqs, setFaqs] = useState([]);
  const [form, setForm] = useState({
    intent: "unknown",
    question: "",
    answer: "",
    tags: "",
  });

  const load = async () => {
    const { data } = await api.get("/faqs");
    setFaqs(data);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    await api.post("/faqs", payload);
    setForm({ intent: "unknown", question: "", answer: "", tags: "" });
    load();
  };

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>

      <a href="/admin/dashboard" className="sidebar-link">
        Dashboard
      </a>

      <a href="/admin/faq" className="sidebar-link active">
        Manage FAQ
      </a>

      <a href="/admin/pending" className="sidebar-link">
        Pending Questions
      </a>

      <a href="/admin/kb" className="sidebar-link">
        Knowledge Base (RAG)
      </a>
    </aside>


      <main className="admin-main">
        <h1 className="admin-header">Manage FAQ</h1>

        <div className="admin-grid">
          <input
            className="admin-input"
            placeholder="intent"
            value={form.intent}
            onChange={(e) => setForm({ ...form, intent: e.target.value })}
          />
          <input
            className="admin-input"
            placeholder="question"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
          />
          <textarea
            className="admin-textarea"
            placeholder="answer"
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
          />
          <input
            className="admin-input"
            placeholder="tags (comma)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
        </div>

        <button className="admin-button" onClick={add}>
          Thêm FAQ
        </button>

        <h2 className="section-title">Danh sách FAQ</h2>
        <div className="admin-list">
          {faqs.map((f) => (
            <div key={f._id} className="admin-item">
              <div className="admin-item-meta">
                {f.intent} ·{" "}
                {f.updated_at
                  ? new Date(f.updated_at).toLocaleString()
                  : ""}
              </div>
              <div className="admin-item-question">{f.question}</div>
              <div className="admin-item-answer">{f.answer}</div>
              <div className="admin-item-tags">
                tags: {(f.tags || []).join(", ")}
              </div>
            </div>
          ))}
          {faqs.length === 0 && (
            <div className="admin-item">
              <div className="admin-item-question">
                Chưa có FAQ nào. Hãy thêm một câu hỏi–trả lời mới.
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
