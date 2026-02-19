import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon";
import api from "../utils/api";

// ─── Auth Modal (Login / Register) ────────────────────────────────────────────
export default function AuthModal({ mode, onClose, onLogin, setMode, notify }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setError("");

    if (mode === "register") {
      if (!form.name || !form.email || !form.password) return setError("All fields are required.");
      if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
      if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    } else {
      if (!form.email || !form.password) return setError("Email and password required.");
    }

    setLoading(true);
    try {
      const endpoint = mode === "register" ? "/auth/register" : "/auth/login";
      const payload =
        mode === "register"
          ? { name: form.name, email: form.email, password: form.password }
          : { email: form.email, password: form.password };

      const { data } = await api.post(endpoint, payload);
      onLogin(data.user, data.token);

      // Navigate based on role
      if (data.user.role === "admin") navigate("/admin-panel");
      else navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") submit(); };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          <Icon name="x" size={16} />
        </button>

        <h2 className="modal-title">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
        <p className="modal-sub">
          {mode === "login" ? "Sign in to manage your applications." : "Join Quantum Logics and start your journey."}
        </p>

        {/* ── Register-only: Name Field ─────────────────── */}
        {mode === "register" && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="Your full name" value={form.name} onChange={set("name")} onKeyDown={handleKey} />
          </div>
        )}

        {/* ── Shared Fields ─────────────────────────────── */}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} onKeyDown={handleKey} />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={set("password")} onKeyDown={handleKey} />
        </div>

        {/* ── Register-only: Confirm Password ──────────── */}
        {mode === "register" && (
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={set("confirmPassword")} onKeyDown={handleKey} />
          </div>
        )}

        {error && <div className="form-error" style={{ marginBottom: "1rem" }}>{error}</div>}

        <button className="btn btn-primary" style={{ width: "100%" }} onClick={submit} disabled={loading}>
          {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
        </button>

        <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.85rem", color: "var(--text2)" }}>
          {mode === "login" ? (
            <>Don't have an account? <button style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", fontSize: "0.85rem" }} onClick={() => setMode("register")}>Sign up</button></>
          ) : (
            <>Already have an account? <button style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", fontSize: "0.85rem" }} onClick={() => setMode("login")}>Sign in</button></>
          )}
        </p>

        {/* ── Admin Demo Hint ───────────────────────────── */}
        <div style={{ marginTop: "1.5rem", padding: "0.75rem 1rem", background: "rgba(0,212,255,0.05)", border: "1px solid var(--border)", borderRadius: 8, fontSize: "0.78rem", color: "var(--text3)" }}>
          Admin demo: admin@quantumlogics.io / admin123
        </div>
      </div>
    </div>
  );
}
