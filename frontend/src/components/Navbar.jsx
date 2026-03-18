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

  const getInitials = (name) => {
    return name ? name.substring(0, 2).toUpperCase() : "US";
  };

  return (
    <nav className="sd-navbar">
      <div className="sd-navbar-inner">
        <div className="sd-navbar-brand">
          <div className="sd-navbar-logo flex items-center justify-center font-bold text-lg rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-white shadow-lg">
            EN
          </div>
          <div className="sd-navbar-title">{title}</div>
        </div>

        <div className="sd-navbar-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `sd-navbar-link ${isActive ? "sd-navbar-link-active" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="sd-navbar-user">
          <div className="sd-navbar-role">
            {(user?.role || "guest").toUpperCase()}
          </div>
          <div className="sd-navbar-avatar">
            {getInitials(user?.name)}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="ml-2 px-3 py-1.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors border border-red-400/20"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
