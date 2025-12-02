export default function Home() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="page-container">
      <div
        className="card"
        style={{
          maxWidth: 720,
          margin: "2rem auto",
          padding: "1.75rem 2rem",
        }}
      >
        <h1 className="chat-title" style={{ marginBottom: "0.5rem" }}>
          Welcome to the Student Portal
        </h1>
        <p className="chat-subtitle" style={{ marginBottom: "1rem" }}>
          Ask the AI chatbot about tuition, schedules, registration, exams, and
          more – and manage your personal profile in one place.
        </p>

        {user ? (
          <div
            style={{
              marginTop: "0.75rem",
              fontSize: "0.9rem",
              lineHeight: 1.6,
            }}
          >
            You are logged in as{" "}
            <strong>{user.full_name || "Student"}</strong> (
            <span>{user.email}</span>).
            <br />
            • Go to <a href="/chat">Chatbox (AI)</a> to ask questions.
            <br />
            • View or update your information in your{" "}
            <a href="/profile">Profile</a>.
          </div>
        ) : (
          <div
            style={{
              marginTop: "0.75rem",
              fontSize: "0.9rem",
              lineHeight: 1.6,
            }}
          >
            You are not logged in yet.
            <br />
            • <a href="/login">Log in</a> if you already have an account.
            <br />
            • Or <a href="/register">sign up</a> to start using the portal.
          </div>
        )}
      </div>
    </div>
  );
}
