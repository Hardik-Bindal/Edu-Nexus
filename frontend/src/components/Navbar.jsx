import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import { getUser } from "../services/session";

const Navbar = ({ title = "EduNexus", links = [] }) => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="nav-shell">
      <div className="nav-inner">
        <div className="nav-brand">
          <span className="nav-logo">EN</span>
          <div className="nav-brand-meta">
            <div className="nav-title">{title}</div>
            <div className="nav-subtitle">Smart learning workspace</div>
          </div>
        </div>

        <nav className="nav-links" aria-label="Primary navigation">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link-active" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <span className="user-pill">
            {user?.name || "User"} · {(user?.role || "guest").toUpperCase()}
          </span>
          <button type="button" onClick={handleLogout} className="btn btn-danger btn-sm">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
