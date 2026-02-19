import { useState } from "react";
import Icon from "./Icon";
import api from "../utils/api";

// ─── Job Form (Create / Edit) ──────────────────────────────────────────────────
export default function JobForm({ initial, onSave, onCancel, notify }) {
  const blank = {
    title: "", department: "Engineering", location: "", type: "Full-time",
    salary: "", description: "", requirements: [""], active: true,
  };

  const [form, setForm] = useState(
    initial ? { ...initial, requirements: [...(initial.requirements || [""])] } : blank
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const setReq = (i, val) => setForm((f) => {
    const r = [...f.requirements];
    r[i] = val;
    return { ...f, requirements: r };
  });

  const addReq = () => setForm((f) => ({ ...f, requirements: [...f.requirements, ""] }));
  const removeReq = (i) => setForm((f) => ({ ...f, requirements: f.requirements.filter((_, j) => j !== i) }));

  const save = async () => {
    setError("");
    if (!form.title || !form.location || !form.description) {
      return setError("Title, location, and description are required.");
    }
    setLoading(true);
    try {
      const payload = { ...form, requirements: form.requirements.filter(Boolean) };
      let savedJob;
      if (initial?._id) {
        const { data } = await api.put(`/jobs/${initial._id}`, payload);
        savedJob = data;
      } else {
        const { data } = await api.post("/jobs", payload);
        savedJob = data;
      }
      onSave(savedJob);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ borderColor: "var(--border2)" }}>
      <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, marginBottom: "1.5rem" }}>
        {initial ? "Edit Job" : "Create New Job"}
      </h3>

      <div className="apply-form">
        {/* ── Basic Info ────────────────────────────────── */}
        <div className="form-group">
          <label className="form-label">Job Title</label>
          <input className="form-input" placeholder="e.g. Senior React Developer" value={form.title} onChange={set("title")} />
        </div>

        <div className="form-group">
          <label className="form-label">Department</label>
          <select className="form-select" value={form.department} onChange={set("department")}>
            <option>Engineering</option>
            <option>Design</option>
            <option>Infrastructure</option>
            <option>Product</option>
            <option>Marketing</option>
            <option>Operations</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Location</label>
          <input className="form-input" placeholder="e.g. Lahore / Remote" value={form.location} onChange={set("location")} />
        </div>

        <div className="form-group">
          <label className="form-label">Job Type</label>
          <select className="form-select" value={form.type} onChange={set("type")}>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Internship</option>
            <option>Remote</option>
          </select>
        </div>

        {/* ── Full-width Fields ─────────────────────────── */}
        <div className="form-group full">
          <label className="form-label">Salary Range</label>
          <input className="form-input" placeholder="e.g. $2,000 – $4,000/mo" value={form.salary} onChange={set("salary")} />
        </div>

        <div className="form-group full">
          <label className="form-label">Job Description</label>
          <textarea className="form-textarea" placeholder="Describe the role, responsibilities, and ideal candidate..." value={form.description} onChange={set("description")} />
        </div>

        {/* ── Requirements ──────────────────────────────── */}
        <div className="form-group full">
          <label className="form-label">Requirements</label>
          {form.requirements.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <input
                className="form-input"
                placeholder={`Requirement ${i + 1}`}
                value={r}
                onChange={(e) => setReq(i, e.target.value)}
              />
              {form.requirements.length > 1 && (
                <button className="btn btn-ghost btn-sm" onClick={() => removeReq(i)} style={{ flexShrink: 0 }}>
                  <Icon name="x" size={14} />
                </button>
              )}
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" onClick={addReq} style={{ marginTop: "4px" }}>
            <Icon name="plus" size={14} /> Add Requirement
          </button>
        </div>
      </div>

      {error && <div className="form-error" style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>{error}</div>}

      {/* ── Actions ───────────────────────────────────── */}
      <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
        <button className="btn btn-primary" onClick={save} disabled={loading}>
          {loading ? "Saving…" : initial ? "Update Job" : "Create Job"}
        </button>
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
