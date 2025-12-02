import { useState } from "react";
import { api } from "../api/client";
import { useNavigate, Navigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const existingUser = localStorage.getItem("user");
  if (existingUser) {
    return <Navigate to="/" replace />;
  }

  const [full, setFull] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    setMsg("");
    try {
      await api.post("/auth/register-student", {
        full_name: full,
        email,
        password: pass,
      });
      setMsg("Account created successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (e) {
      setError("This email is already in use.");
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") submit();
  };

  return (
    <div className="page-container">
      <div
        className="card"
        style={{ maxWidth: 420, margin: "2rem auto", padding: "1.75rem" }}
      >
        <h1 className="chat-title" style={{ marginBottom: "0.5rem" }}>
          Create a student account
        </h1>
        <p className="chat-subtitle">
          Register to start using the campus chatbot.
        </p>

        {msg && (
          <div
            style={{
              marginTop: "0.75rem",
              marginBottom: "0.5rem",
              fontSize: "0.85rem",
              color: "#166534",
              background: "#dcfce7",
              border: "1px solid #bbf7d0",
              borderRadius: 8,
              padding: "0.5rem 0.75rem",
            }}
          >
            {msg}
          </div>
        )}
        {error && (
          <div
            style={{
              marginTop: "0.75rem",
              marginBottom: "0.5rem",
              fontSize: "0.85rem",
              color: "#b91c1c",
              background: "#fee2e2",
              border: "1px solid #fecaca",
              borderRadius: 8,
              padding: "0.5rem 0.75rem",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginTop: "1rem", display: "grid", gap: "0.75rem" }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                marginBottom: "0.15rem",
              }}
            >
              Full name
            </label>
            <input
              className="admin-input"
              placeholder="Nguyen Van A"
              value={full}
              onChange={(e) => setFull(e.target.value)}
              onKeyDown={onKeyDown}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                marginBottom: "0.15rem",
              }}
            >
              Email
            </label>
            <input
              className="admin-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={onKeyDown}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                marginBottom: "0.15rem",
              }}
            >
              Password
            </label>
            <input
              type="password"
              className="admin-input"
              placeholder="••••••••"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              onKeyDown={onKeyDown}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <button
          onClick={submit}
          className="admin-button"
          style={{ width: "100%", marginTop: "1rem" }}
        >
          Sign up
        </button>

        <p
          style={{
            marginTop: "0.75rem",
            fontSize: "0.8rem",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          Already have an account?{" "}
          <a href="/login" style={{ textDecoration: "underline" }}>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
