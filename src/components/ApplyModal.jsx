import { useState } from "react";
import Icon from "./Icon";
import api from "../utils/api";

// ─── Apply Modal ───────────────────────────────────────────────────────────────
export default function ApplyModal({ job, user, onClose, notify }) {
  const [form, setForm] = useState({ phone: "", experience: "", linkedin: "", portfolio: "", coverLetter: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const apply = async () => {
    setError("");
    setLoading(true);
    try {
      await api.post("/applications", {
        jobId: job._id || job.id,
        ...form,
      });
      setSubmitted(true);
      notify("Application submitted successfully!");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit application.";
      if (msg.includes("already applied")) {
        notify(msg, "error");
        onClose();
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 560 }}>
        <button className="modal-close" onClick={onClose}>
          <Icon name="x" size={16} />
        </button>

        {submitted ? (
          /* ── Success State ──────────────────────────── */
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(16,185,129,0.15)", border: "1px solid var(--success)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
              <Icon name="check" size={28} color="var(--success)" />
            </div>
            <h2 className="modal-title">Application Sent!</h2>
            <p className="modal-sub">
              We've received your application for <strong>{job.title}</strong>. Our team will review it and get back to you soon.
            </p>
            <button className="btn btn-primary" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            {/* ── Form Header ─────────────────────────── */}
            <h2 className="modal-title">Apply: {job.title}</h2>
            <p className="modal-sub" style={{ marginBottom: "1.5rem" }}>
              {job.department} · {job.location}
            </p>

            {/* ── Read-only User Info ──────────────────── */}
            <div className="apply-form" style={{ marginBottom: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={user.name} disabled style={{ opacity: 0.6 }} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" value={user.email} disabled style={{ opacity: 0.6 }} />
              </div>
            </div>

            {/* ── Application Fields ───────────────────── */}
            <div className="apply-form">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="+92 300 0000000" value={form.phone} onChange={set("phone")} />
              </div>

              <div className="form-group">
                <label className="form-label">Years of Experience</label>
                <select className="form-select" value={form.experience} onChange={set("experience")}>
                  <option value="">Select</option>
                  <option>0-1 years</option>
                  <option>1-3 years</option>
                  <option>3-5 years</option>
                  <option>5+ years</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">LinkedIn Profile</label>
                <input className="form-input" placeholder="linkedin.com/in/yourname" value={form.linkedin} onChange={set("linkedin")} />
              </div>

              <div className="form-group">
                <label className="form-label">Portfolio / GitHub</label>
                <input className="form-input" placeholder="github.com/yourname" value={form.portfolio} onChange={set("portfolio")} />
              </div>

              <div className="form-group full">
                <label className="form-label">Cover Letter</label>
                <textarea className="form-textarea" placeholder="Tell us why you're a great fit..." value={form.coverLetter} onChange={set("coverLetter")} />
              </div>
            </div>

            {error && <div className="form-error" style={{ marginBottom: "0.75rem" }}>{error}</div>}

            <button className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }} onClick={apply} disabled={loading}>
              {loading ? "Submitting…" : <> Submit Application <Icon name="arrow" size={16} /></>}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
