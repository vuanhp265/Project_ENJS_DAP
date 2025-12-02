import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    faq: 0,
    logs: 0,
    pending: 0,
    intents: [],
    daily: [],
  });

  const [logs, setLogs] = useState([]);

  const loadData = async () => {
    const statsRes = await api.get("/logs/stats");
    const logsRes = await api.get("/logs?limit=20");

    setStats(statsRes.data);
    setLogs(logsRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const topIntents = (stats.intents || []).slice(0, 5);

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar">
  <h2 className="sidebar-title">Admin Panel</h2>

  <a href="/admin/dashboard" className="sidebar-link active">
    Dashboard
  </a>

  <a href="/admin/faq" className="sidebar-link">
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
        <h1 className="admin-header">Dashboard</h1>

        <div className="admin-cards">
          <div className="admin-card">
            <h3>FAQ Count</h3>
            <p className="number">{stats.faq}</p>
          </div>
          <div className="admin-card">
            <h3>Total Logs</h3>
            <p className="number">{stats.logs}</p>
          </div>
          <div className="admin-card">
            <h3>Pending Questions</h3>
            <p className="number">{stats.pending}</p>
          </div>
        </div>

        <section>
          <h2 className="section-title">Top Intents</h2>
          <div className="intent-list">
            {topIntents.length === 0 && (
              <div className="intent-empty">
                Chưa có dữ liệu intent. Hãy thử hỏi bot vài câu để tạo log.
              </div>
            )}
            {topIntents.map((it) => (
              <div key={it.intent} className="intent-item">
                <div className="intent-name">{it.intent || "unknown"}</div>
                <div className="intent-count">{it.count} queries</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title">Recent Logs</h2>
          <div className="logs-list">
            {logs.map((l) => (
              <div key={l._id} className="log-item">
                <div className="log-query">“{l.query}”</div>
                <div className="log-meta">
                  intent: {l.matched_intent} • score:{" "}
                  {Number(l.score || 0).toFixed(2)} •{" "}
                  {l.created_at
                    ? new Date(l.created_at).toLocaleString()
                    : ""}
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="log-item">
                <div className="log-query">
                  Chưa có log nào. Hãy dùng thử chatbot để tạo log.
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
