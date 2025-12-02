export default function ChatBubble({ role, text, time }) {
  const isUser = role === "user";

  return (
    <div className={`chat-row ${isUser ? "user" : "bot"}`}>
      <div className={`chat-bubble ${isUser ? "user" : "bot"}`}>
        <div>{text}</div>
        {time && (
          <div className="chat-meta">
            {isUser ? "Bạn · " : "Bot · "}
            {time}
          </div>
        )}
      </div>
    </div>
  );
}
