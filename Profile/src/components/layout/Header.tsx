import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Menu, X, Home, User, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Trang Chủ', icon: Home },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/chatbox', label: 'Chatbox', icon: MessageSquare },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header-wrapper">
      <nav className="main-navbar">
        <div className="container">
          <div className="navbar-content">
            <Link to="/" className="navbar-brand" onClick={() => setIsMenuOpen(false)}>
              <GraduationCap className="brand-icon" size={32} />
              <span className="brand-text">Student Portal</span>
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <ul className={`navbar-menu ${isMenuOpen ? 'show' : ''}`}>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path} className="nav-item">
                    <Link
                      to={item.path}
                      className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon size={20} className="nav-icon" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}