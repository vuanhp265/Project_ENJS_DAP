import { useState } from "react";
import { api } from "../api/client";
import { useNavigate, Navigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const existingUser = localStorage.getItem("user");
  if (existingUser) {
    return <Navigate to="/" replace />;
  }

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password: pass,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      if (data.role === "admin") navigate("/admin/dashboard");
      else navigate("/");
    } catch (e) {
      setError("Invalid email or password.");
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
          Welcome back
        </h1>
        <p className="chat-subtitle">
          Sign in to access your campus assistant.
        </p>

        {error && (
          <div
            style={{
              marginTop: "0.75rem",
              marginBottom: "0.75rem",
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
          Log in
        </button>

        <p
          style={{
            marginTop: "0.75rem",
            fontSize: "0.8rem",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          Don&apos;t have an account?{" "}
          <a href="/register" style={{ textDecoration: "underline" }}>
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
