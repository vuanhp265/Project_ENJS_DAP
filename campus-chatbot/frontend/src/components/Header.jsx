import { NavLink, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!user;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="header">
      {/* Left: logo + title */}
      <div className="header-left">
        <div className="header-logo">S</div>
        <div className="header-title">Student Portal</div>
      </div>

      {/* Center: nav links */}
      <nav className="header-nav">
        <NavLink to="/" end className="header-link">
          Home
        </NavLink>
        <NavLink to="/profile" className="header-link">
          Profile
        </NavLink>
        <NavLink to="/chat" className="header-link">
          Chatbox (AI)
        </NavLink>
        {!isLoggedIn && (
          <NavLink to="/login" className="header-link">
            Login
          </NavLink>
        )}
      </nav>

      {/* Right: logout if logged in */}
      <div className="header-right">
        {isLoggedIn && <button onClick={handleLogout}>Log out</button>}
      </div>
    </header>
  );
}
