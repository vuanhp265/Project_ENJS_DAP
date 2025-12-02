import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function AdminPending() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/questions/pending");
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/questions/${id}`, { status });
      load();
    } catch (e) {
      console.error(e);
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

  <a href="/admin/pending" className="sidebar-link active">
    Pending Questions
  </a>

  <a href="/admin/kb" className="sidebar-link">
    Knowledge Base (RAG)
  </a>
</aside>


      <main className="admin-main">
        <h1 className="admin-header">Pending Questions</h1>

        <div className="pending-top-row">
          <button className="admin-button" onClick={load} disabled={loading}>
            {loading ? "Reloading..." : "Reload"}
          </button>
        </div>

        <div className="pending-list">
          {items.length === 0 && (
            <div className="pending-empty">
              Hiện không có câu hỏi pending nào. Khi bot không chắc câu trả lời,
              người dùng có thể gửi câu hỏi để hiện ở đây.
            </div>
          )}

          {items.map((q) => (
            <div key={q._id} className="pending-item">
              <div className="pending-query">“{q.query}”</div>
              <div className="pending-meta">
                {q.created_at
                  ? new Date(q.created_at).toLocaleString()
                  : ""}
              </div>
              <div className="pending-actions">
                <button
                  className="pending-btn pending-btn-done"
                  onClick={() => updateStatus(q._id, "done")}
                >
                  Mark as done
                </button>
                <button
                  className="pending-btn"
                  onClick={() => updateStatus(q._id, "in_progress")}
                >
                  In progress
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
