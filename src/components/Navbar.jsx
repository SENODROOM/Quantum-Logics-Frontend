import { Link, NavLink, useNavigate } from "react-router-dom";
import Icon from "./Icon";

// ─── Navbar Component ──────────────────────────────────────────────────────────
export default function Navbar({ currentUser, setShowAuth, logout }) {
  const navigate = useNavigate();

  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        <Icon name="quantum" size={32} color="#00d4ff" />
        <span className="nav-logo-text">Quantum Logics</span>
      </div>

      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}>
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
          <button className="nav-btn" onClick={logout}>
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
}
