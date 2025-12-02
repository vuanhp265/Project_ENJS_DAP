import { useEffect, useRef, useState } from "react";
import { api } from "../api/client";

export default function Chat() {
  const [messages, setMessages] = useState([]); // { sender, text, ts }
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [atBottom, setAtBottom] = useState(true); // đang ở cuối hay không
  const bottomRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  // Scroll handler: xác định user đang ở cuối không
  const handleScroll = (e) => {
    const el = e.currentTarget;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const isBottom = distanceToBottom < 40; // < 40px coi như đang ở cuối
    setAtBottom(isBottom);
  };

  // Auto-scroll CHỈ khi đang ở cuối
  useEffect(() => {
    if (!atBottom) return;
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, atBottom]);

  // Load history nếu đã login
  useEffect(() => {
    if (!token) return;

    api
      .get("/chat/history")
      .then((res) => {
        const msgs = res.data.messages || [];
        setMessages(msgs);
      })
      .catch(() => {});
  }, [token]);

  const sendMsg = async () => {
    const q = input.trim();
    if (!q || loading) return;

    const now = new Date().toISOString();
    const userMsg = { sender: "user", text: q, ts: now };

    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    setAtBottom(true); // sau khi gửi, tự coi như đang ở cuối

    try {
      const res = await api.post("/chat/query", {
        query: q,
        history: messages.slice(-4),
        user_email: user?.email || null,
      });

      const answer = res.data.answer || "No response.";

      setMessages((m) => [
        ...m,
        { sender: "bot", text: answer, ts: new Date().toISOString() },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          sender: "bot",
          text: "⚠️ Server error. Please try again.",
          ts: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMsg();
  };

  return (
    <div className="page-container">
      <div className="card" style={{ padding: "1.5rem", borderRadius: "14px" }}>
        <div className="chat-header">
          <h2 className="chat-title">Campus ChatBot</h2>
          <p className="chat-subtitle">
            Ask anything about tuition, registration, schedules, or exams.
          </p>
        </div>

        {/* Chat window */}
        <div className="chat-window" onScroll={handleScroll}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`chat-row ${m.sender === "user" ? "user" : "bot"}`}
            >
              <div className={`chat-bubble ${m.sender}`}>
                {m.text}
                <div className="chat-meta">
                  {m.ts &&
                    new Date(m.ts).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-row bot">
              <div className="chat-bubble bot">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input row */}
        <div className="chat-input-row">
          <input
            className="chat-input"
            placeholder="Type your question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button className="chat-button" onClick={sendMsg} disabled={loading}>
            Send
          </button>
        </div>

        <p className="chat-hints">
          Example: “How much is tuition per credit?”, “Where can I see my exam
          schedule?”
        </p>
      </div>
    </div>
  );
}
