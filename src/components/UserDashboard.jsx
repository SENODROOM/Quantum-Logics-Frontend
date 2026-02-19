import { useState, useEffect, useCallback } from "react";
import Icon from "./Icon";
import api from "../utils/api";

// ─── User Dashboard ────────────────────────────────────────────────────────────
export default function UserDashboard({ user, logout, setShowApplyModal, notify }) {
  const [tab, setTab] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.get("/jobs"),
        api.get("/applications/mine"),
      ]);
      setJobs(jobsRes.data);
      setApplications(appsRes.data);
    } catch {
      notify("Failed to load data.", "error");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const refreshApps = async () => {
    try {
      const { data } = await api.get("/applications/mine");
      setApplications(data);
    } catch {
      notify("Failed to refresh applications.", "error");
    }
  };

  const statusColor = {
    pending: "badge-blue",
    reviewed: "badge-orange",
    accepted: "badge-green",
    rejected: "badge-gray",
  };

  const hasApplied = (jobId) => applications.some((a) => String(a.jobId) === String(jobId));

  return (
    <div className="dashboard">
      {/* ── Sidebar ───────────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Icon name="quantum" size={28} color="#00d4ff" />
          <span className="sidebar-logo-text">Quantum Logics</span>
        </div>

        <button className={`sidebar-btn ${tab === "jobs" ? "active" : ""}`} onClick={() => setTab("jobs")}>
          <Icon name="briefcase" size={18} /> Open Positions
        </button>

        <button className={`sidebar-btn ${tab === "applications" ? "active" : ""}`} onClick={() => { setTab("applications"); refreshApps(); }}>
          <Icon name="eye" size={18} /> My Applications
          {applications.length > 0 && <span className="badge badge-blue" style={{ marginLeft: "auto" }}>{applications.length}</span>}
        </button>

        <div className="sidebar-footer">
          <div className="sidebar-user"><strong>{user.name}</strong>{user.email}</div>
          <button className="sidebar-btn" onClick={logout}><Icon name="logout" size={18} /> Sign Out</button>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────── */}
      <main className="main-content">

        {loading && (
          <div className="empty-state" style={{ marginTop: "4rem" }}>
            <p style={{ color: "var(--text3)" }}>Loading…</p>
          </div>
        )}

        {/* ── Tab: Open Positions ───────────────────────── */}
        {!loading && tab === "jobs" && (
          <>
            <div className="page-header">
              <h1>Open Positions</h1>
              <p>Browse and apply for available roles at Quantum Logics.</p>
            </div>
            <div className="jobs-grid">
              {jobs.map((job) => (
                <div key={job._id} className="job-card">
                  <div>
                    <div className="job-dept">{job.department}</div>
                    <div className="job-title">{job.title}</div>
                    <div className="job-meta">
                      <span className="job-tag"><Icon name="location" size={13} />{job.location}</span>
                      <span className="job-tag"><Icon name="clock" size={13} />{job.type}</span>
                      <span className="job-tag"><Icon name="dollar" size={13} />{job.salary}</span>
                    </div>
                  </div>
                  <div className="job-actions">
                    {hasApplied(job._id) ? (
                      <span className="badge badge-blue">Applied</span>
                    ) : (
                      <button className="btn btn-primary btn-sm" onClick={() => setShowApplyModal(job)}>Apply</button>
                    )}
                  </div>
                </div>
              ))}
              {jobs.length === 0 && (
                <div className="empty-state">
                  <Icon name="briefcase" size={36} color="var(--text3)" />
                  <p>No open positions right now.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Tab: My Applications ──────────────────────── */}
        {!loading && tab === "applications" && (
          <>
            <div className="page-header">
              <h1>My Applications</h1>
              <p>Track the status of all your job applications.</p>
            </div>

            {applications.length === 0 ? (
              <div className="card empty-state">
                <Icon name="briefcase" size={40} color="var(--text3)" />
                <p>You haven't applied to any roles yet.</p>
                <button className="btn btn-primary btn-sm" style={{ marginTop: "1rem" }} onClick={() => setTab("jobs")}>
                  Browse Open Roles
                </button>
              </div>
            ) : (
              <div className="card">
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Position</th><th>Applied</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {applications.map((a) => (
                        <tr key={a._id}>
                          <td><strong>{a.jobTitle}</strong></td>
                          <td style={{ color: "var(--text2)" }}>{new Date(a.appliedAt).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${statusColor[a.status] || "badge-gray"}`}>
                              {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
