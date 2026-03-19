import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../services/authService";
import { getUser } from "../services/session";

const Navbar = ({ title = "EduNexus", links = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name) =>
    name ? name.substring(0, 2).toUpperCase() : "US";

  return (
    <>
      <nav className="sd-navbar" ref={menuRef}>
        <div className="sd-navbar-inner">
          {/* Brand */}
          <NavLink to="/" className="sd-navbar-brand" style={{ textDecoration: "none" }}>
            <div className="sd-navbar-logo">EN</div>
            <div className="sd-navbar-title">EduNexus</div>
          </NavLink>

          {/* Desktop links */}
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

          {/* Right side: role badge + avatar + logout (desktop) */}
          <div className="sd-navbar-user">
            <div className="sd-navbar-role sd-hide-mobile">
              {(user?.role || "guest").toUpperCase()}
            </div>
            <div className="sd-navbar-avatar">
              {getInitials(user?.name)}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="sd-logout-btn sd-hide-mobile"
            >
              Logout
            </button>

            {/* Hamburger button – mobile only */}
            <button
              type="button"
              className="sd-hamburger"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {menuOpen ? (
                // X icon
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                // Hamburger icon
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile drop-down menu */}
        <div className={`sd-mobile-menu ${menuOpen ? "sd-mobile-menu-open" : ""}`}>
          <div className="sd-mobile-menu-inner">
            {/* User info row */}
            <div className="sd-mobile-user-row">
              <div className="sd-navbar-avatar">{getInitials(user?.name)}</div>
              <div>
                <div className="sd-mobile-user-name">{user?.name || "User"}</div>
                <div className="sd-mobile-user-role">{(user?.role || "guest").toUpperCase()}</div>
              </div>
            </div>

            {/* Nav links */}
            <nav className="sd-mobile-nav">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `sd-mobile-nav-link ${isActive ? "sd-mobile-nav-link-active" : ""}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="sd-mobile-logout"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className="sd-mobile-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar;
