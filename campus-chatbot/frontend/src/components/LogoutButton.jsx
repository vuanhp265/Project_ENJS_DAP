export default function LogoutButton() {
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <button
      onClick={logout}
      style={{
        padding: "8px 16px",
        borderRadius: "6px",
        background: "#d9534f",
        color: "#fff",
        cursor: "pointer",
        border: "none",
        marginTop: "10px"
      }}>
      Log out
    </button>
  );
}
