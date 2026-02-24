import { useState, useEffect, useCallback } from "react";
import Icon from "./Icon";
import api from "../utils/api";

// ─── Helper: initials from name or email ──────────────────────────────────────
function initials(str = "") {
  const parts = str.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return str.slice(0, 2).toUpperCase();
}

// ─── User Dashboard ────────────────────────────────────────────────────────────
export default function UserDashboard({ user, logout, setShowApplyModal, notify }) {
  const [tab, setTab] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Close sidebar on outside click
  useEffect(() => {
    if (!sidebarOpen) return;
    const close = (e) => {
      if (!e.target.closest(".sidebar") && !e.target.closest(".sidebar-toggle")) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [sidebarOpen]);

  const navigate = (newTab) => {
    if (newTab === tab) { setSidebarOpen(false); return; }
    setSidebarOpen(false);
    setTab(newTab);
    if (newTab === "applications") refreshApps();
  };

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

  const navItems = [
    { id: "jobs", icon: "briefcase", label: "Positions" },
    { id: "applications", icon: "eye", label: "Applied", badge: applications.length },
  ];

  return (
    <div className="dashboard">

      {/* ── Sidebar ─────────────────────────────── */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar-logo">
          <Icon name="quantum" size={28} color="#00d4ff" />
          <span className="sidebar-logo-text">Quantum Logics</span>
        </div>

        {navItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-btn ${tab === item.id ? "active" : ""}`}
            onClick={() => navigate(item.id)}
          >
            <Icon name={item.icon} size={18} />
            {item.label === "Positions" ? "Open Positions" : "My Applications"}
            {item.badge > 0 && (
              <span className="badge badge-blue" style={{ marginLeft: "auto" }}>
                {item.badge}
              </span>
            )}
          </button>
        ))}

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <strong>{user.name}</strong>{user.email}
          </div>
          <button className="sidebar-btn" onClick={logout}>
            <Icon name="logout" size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      {/* ── Main Content ────────────────────────── */}
      <main className="main-content">

        {/* Mobile topbar */}
        <div className="dash-topbar">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen((o) => !o)} aria-label="Open menu">
            <Icon name="menu" size={20} />
          </button>
          <span className="dash-topbar-title">
            {tab === "jobs" ? "Open Positions" : "My Applications"}
          </span>
          <button className="sidebar-toggle" onClick={logout} aria-label="Sign out">
            <Icon name="logout" size={18} />
          </button>
        </div>

        {loading && (
          <div className="empty-state" style={{ marginTop: "4rem" }}>
            <p style={{ color: "var(--text3)" }}>Loading…</p>
          </div>
        )}

        {!loading && (
          <div key={tab} className="tab-content">

            {/* ── Open Positions ──────────────────── */}
            {tab === "jobs" && (
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
                          <span className="badge badge-green">Applied</span>
                        ) : (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => setShowApplyModal(job)}
                          >
                            Apply
                          </button>
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

            {/* ── My Applications ─────────────────── */}
            {tab === "applications" && (
              <>
                <div className="page-header">
                  <h1>My Applications</h1>
                  <p>Track the status of all your job applications.</p>
                </div>

                {applications.length === 0 ? (
                  <div className="card empty-state">
                    <Icon name="briefcase" size={40} color="var(--text3)" />
                    <p>You haven't applied to any roles yet.</p>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ marginTop: "1rem" }}
                      onClick={() => navigate("jobs")}
                    >
                      Browse Open Roles
                    </button>
                  </div>
                ) : (
                  <div className="card">
                    {/* Desktop: table */}
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

                    {/* Mobile: app-list */}
                    <div className="app-list">
                      {applications.map((a) => (
                        <div key={a._id} className="app-list-item">
                          <div className="app-list-avatar">{initials(a.jobTitle)}</div>
                          <div className="app-list-info">
                            <div className="app-list-name">{a.jobTitle}</div>
                            <div className="app-list-sub">
                              Applied {new Date(a.appliedAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="app-list-right">
                            <span className={`badge ${statusColor[a.status] || "badge-gray"}`}>
                              {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

          </div>
        )}
      </main>

      {/* ── Mobile Bottom Nav ───────────────────── */}
      <nav className="dash-bottom-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`dash-bottom-btn ${tab === item.id ? "active" : ""}`}
            onClick={() => navigate(item.id)}
          >
            <span className="dash-bottom-icon">
              <Icon name={item.icon} size={20} />
              {item.badge > 0 && <span className="dash-bottom-badge">{item.badge}</span>}
            </span>
            <span className="dash-bottom-label">
              {item.id === "jobs" ? "Positions" : "Applied"}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}