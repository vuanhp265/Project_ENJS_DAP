import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function AdminKB() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    source: "",
    content: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const loadDocs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/kb/docs");
      setDocs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const onCreateDoc = async () => {
    const { title, source, content } = form;
    if (!title.trim() || !content.trim()) return;

    try {
      await api.post("/kb/docs", {
        title: title.trim(),
        source: source.trim(),
        content: content.trim(),
      });
      setForm({ title: "", source: "", content: "" });
      loadDocs();
    } catch (e) {
      console.error(e);
    }
  };

  const onSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;
    setSearchLoading(true);
    try {
      const { data } = await api.post("/kb/search", { query: q });
      setSearchResults(data.results || []);
    } catch (e) {
      console.error(e);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <a href="/admin/dashboard" className="sidebar-link">
          Dashboard
        </a>
        <a href="/admin/faq" className="sidebar-link">
          Manage FAQ
        </a>
        <a href="/admin/pending" className="sidebar-link">
          Pending Questions
        </a>
        <a href="/admin/kb" className="sidebar-link active">
          Knowledge Base (RAG)
        </a>
      </aside>

      <main className="admin-main">
        <h1 className="admin-header">Knowledge Base (RAG)</h1>

        {/* Form tạo document mới */}
        <section>
          <h2 className="section-title">Thêm tài liệu vào KB</h2>
          <div className="admin-grid">
            <input
              className="admin-input"
              placeholder="Tiêu đề tài liệu (vd: Quy định học phí)"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
            <input
              className="admin-input"
              placeholder="Nguồn (vd: Quy chế học vụ 2024)"
              value={form.source}
              onChange={(e) =>
                setForm((f) => ({ ...f, source: e.target.value }))
              }
            />
            <textarea
              className="admin-textarea"
              placeholder="Nội dung tài liệu (có thể là copy từ PDF / website trường)..."
              value={form.content}
              onChange={(e) =>
                setForm((f) => ({ ...f, content: e.target.value }))
              }
            />
          </div>
          <button className="admin-button" onClick={onCreateDoc}>
            Thêm tài liệu KB
          </button>
        </section>

        {/* Danh sách documents trong KB */}
        <section>
          <h2 className="section-title">Danh sách tài liệu trong KB</h2>
          <div className="admin-list">
            {loading && (
              <div className="admin-item">
                <div className="admin-item-question">Đang tải...</div>
              </div>
            )}
            {!loading && docs.length === 0 && (
              <div className="admin-item">
                <div className="admin-item-question">
                  Chưa có tài liệu KB nào. Hãy thêm ít nhất 1 tài liệu.
                </div>
              </div>
            )}
            {docs.map((d) => (
              <div key={d._id} className="admin-item">
                <div className="admin-item-question">
                  {d.title}{" "}
                  <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                    ({d.source || "N/A"})
                  </span>
                </div>
                <div className="admin-item-meta">
                  {d.created_at
                    ? new Date(d.created_at).toLocaleString()
                    : ""}
                </div>
                <div className="admin-item-tags">
                  chunks: {d.chunk_count ?? 0}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Test search KB bằng RAG */}
        <section>
          <h2 className="section-title">Test RAG trên Knowledge Base</h2>
          <div className="admin-grid">
            <input
              className="admin-input"
              placeholder="Nhập câu hỏi để test RAG (ví dụ: Nếu đóng học phí trễ thì sao?)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="admin-button" onClick={onSearch}>
            {searchLoading ? "Đang tìm..." : "Tìm trong KB"}
          </button>

          <div className="logs-list" style={{ marginTop: "0.75rem" }}>
            {searchResults.length === 0 && (
              <div className="log-item">
                <div className="log-query">
                  Chưa có kết quả. Hãy nhập câu hỏi và bấm &quot;Tìm trong KB&quot;.
                </div>
              </div>
            )}
            {searchResults.map((r, idx) => (
              <div key={idx} className="log-item">
                <div className="log-query">
                  {r.title}{" "}
                  <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                    ({r.source}) · score: {r.score.toFixed(3)}
                  </span>
                </div>
                <div className="log-meta">{r.text}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
