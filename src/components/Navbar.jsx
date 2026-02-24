import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Icon from "./Icon";

// ─── Navbar Component ──────────────────────────────────────────────────────────
export default function Navbar({ currentUser, setShowAuth, logout }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add shadow + tighter bg on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change / outside click
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => {
      if (!e.target.closest(".nav")) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      {/* Logo */}
      <div className="nav-logo" onClick={() => { navigate("/"); closeMenu(); }}>
        <Icon name="quantum" size={30} color="#00d4ff" />
        <span className="nav-logo-text">Quantum Logics</span>
      </div>

      {/* Desktop links */}
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}>
          Home
        </NavLink>
        <NavLink to="/jobs" className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}>
          Careers
        </NavLink>

        {currentUser && (
          <NavLink to="/dashboard" className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}>
            Dashboard
          </NavLink>
        )}

        <div className="nav-divider" />

        {!currentUser ? (
          <>
            <button className="nav-btn" onClick={() => setShowAuth("login")}>
              Sign In
            </button>
            <button className="nav-btn primary" onClick={() => setShowAuth("register")}>
              Get Started
            </button>
          </>
        ) : (
          <button className="nav-btn sign-out" onClick={logout}>
            Sign Out
          </button>
        )}
      </div>

      {/* Hamburger */}
      <button
        className={`nav-hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile drawer */}
      <div className={`nav-drawer ${menuOpen ? "open" : ""}`}>
        <NavLink to="/" end className={({ isActive }) => `nav-drawer-link ${isActive ? "active" : ""}`} onClick={closeMenu}>
          Home
        </NavLink>
        <NavLink to="/jobs" className={({ isActive }) => `nav-drawer-link ${isActive ? "active" : ""}`} onClick={closeMenu}>
          Careers
        </NavLink>

        {currentUser && (
          <NavLink to="/dashboard" className={({ isActive }) => `nav-drawer-link ${isActive ? "active" : ""}`} onClick={closeMenu}>
            Dashboard
          </NavLink>
        )}

        <div className="nav-drawer-footer">
          {!currentUser ? (
            <>
              <button
                className="btn btn-outline"
                style={{ width: "100%" }}
                onClick={() => { setShowAuth("login"); closeMenu(); }}
              >
                Sign In
              </button>
              <button
                className="btn btn-primary"
                style={{ width: "100%" }}
                onClick={() => { setShowAuth("register"); closeMenu(); }}
              >
                Get Started
              </button>
            </>
          ) : (
            <button
              className="btn btn-ghost"
              style={{ width: "100%" }}
              onClick={() => { logout(); closeMenu(); }}
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && <div className="nav-backdrop" onClick={closeMenu} />}
    </nav>
  );
}