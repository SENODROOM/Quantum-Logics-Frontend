import { useState, useEffect, useCallback } from "react";
import Icon from "./Icon";
import JobForm from "./JobForm";
import api from "../utils/api";

// ─── Helper: initials from name or email ──────────────────────────────────────
function initials(str = "") {
  const parts = str.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return str.slice(0, 2).toUpperCase();
}

// ─── Admin Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard({ user, logout, notify }) {
  const [tab, setTab] = useState("overview");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const fetchAll = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [jobsRes, appsRes, usersRes] = await Promise.all([
        api.get("/jobs/all"),
        api.get("/applications"),
        api.get("/users"),
      ]);
      setJobs(jobsRes.data);
      setApplications(appsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      notify("Failed to load data.", "error");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [notify]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

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
    if (["overview", "applications", "users"].includes(newTab)) fetchAll(true);
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job posting? This cannot be undone.")) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      notify("Job deleted.");
    } catch {
      notify("Failed to delete job.", "error");
    }
  };

  const toggleJobStatus = async (job) => {
    try {
      const { data } = await api.put(`/jobs/${job._id}`, { active: !job.active });
      setJobs((prev) => prev.map((j) => (j._id === data._id ? data : j)));
      notify("Job status updated.");
    } catch {
      notify("Failed to update job status.", "error");
    }
  };

  const updateAppStatus = async (appId, status) => {
    try {
      const { data } = await api.patch(`/applications/${appId}/status`, { status });
      setApplications((prev) => prev.map((a) => (a._id === data._id ? data : a)));
      notify(`Application marked as ${status}.`);
      fetchAll(true);
    } catch {
      notify("Failed to update status.", "error");
    }
  };

  const statusColor = {
    pending: "badge-blue",
    reviewed: "badge-orange",
    accepted: "badge-green",
    rejected: "badge-gray",
  };

  const pendingCount = applications.filter((a) => a.status === "pending").length;

  const navItems = [
    { id: "overview", icon: "home", label: "Overview" },
    { id: "jobs", icon: "briefcase", label: "Jobs" },
    { id: "applications", icon: "eye", label: "Applications", badge: pendingCount },
    { id: "users", icon: "users", label: "Users" },
    { id: "settings", icon: "settings", label: "Settings" },
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
            {item.label}
            {item.badge > 0 && (
              <span className="badge badge-orange" style={{ marginLeft: "auto" }}>
                {item.badge}
              </span>
            )}
          </button>
        ))}

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <strong>Admin</strong>{user.email}
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
            {navItems.find((n) => n.id === tab)?.label ?? "Dashboard"}
          </span>
          <button className="sidebar-toggle" onClick={logout} aria-label="Sign out">
            <Icon name="logout" size={18} />
          </button>
        </div>

        <div key={tab} className="tab-content">
          {loading && (
            <div className="empty-state" style={{ marginTop: "4rem" }}>
              <p style={{ color: "var(--text3)" }}>Loading…</p>
            </div>
          )}

          {/* ── Overview ────────────────────────────── */}
          {!loading && tab === "overview" && (
            <>
              <div className="page-header">
                <h1>Admin Overview</h1>
                <p>A high-level look at Quantum Logics' hiring activity.</p>
              </div>

              <div className="stats-cards">
                <div className="stat-card">
                  <div className="stat-card-icon"><Icon name="briefcase" size={17} /></div>
                  <div className="stat-card-label">Active Jobs</div>
                  <div className="stat-card-num">{jobs.filter((j) => j.active).length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-icon"><Icon name="eye" size={17} /></div>
                  <div className="stat-card-label">Total Applications</div>
                  <div className="stat-card-num">{applications.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-icon"><Icon name="clock" size={17} /></div>
                  <div className="stat-card-label">Pending Review</div>
                  <div className="stat-card-num">{pendingCount}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-icon"><Icon name="users" size={17} /></div>
                  <div className="stat-card-label">Registered Users</div>
                  <div className="stat-card-num">{users.length}</div>
                </div>
              </div>

              <div className="card">
                <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, marginBottom: "1rem" }}>
                  Recent Applications
                </h3>

                {applications.length === 0 ? (
                  <div className="empty-state"><p>No applications yet.</p></div>
                ) : (
                  <>
                    {/* Desktop: scrollable table */}
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr><th>Applicant</th><th>Position</th><th>Date</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                          {applications.slice(0, 5).map((a) => (
                            <tr key={a._id}>
                              <td>
                                <strong>{a.userName}</strong>
                                <div style={{ fontSize: "0.8rem", color: "var(--text3)" }}>{a.userEmail}</div>
                              </td>
                              <td>{a.jobTitle}</td>
                              <td style={{ color: "var(--text2)" }}>{new Date(a.appliedAt).toLocaleDateString()}</td>
                              <td><span className={`badge ${statusColor[a.status] || "badge-gray"}`}>{a.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile: card list */}
                    <div className="app-list">
                      {applications.slice(0, 5).map((a) => (
                        <div key={a._id} className="app-list-item">
                          <div className="app-list-avatar">{initials(a.userName || a.userEmail)}</div>
                          <div className="app-list-info">
                            <div className="app-list-name">{a.userName || a.userEmail}</div>
                            <div className="app-list-sub">{a.jobTitle}</div>
                          </div>
                          <div className="app-list-right">
                            <span className={`badge ${statusColor[a.status] || "badge-gray"}`}>{a.status}</span>
                            <div className="app-list-date">{new Date(a.appliedAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* ── Manage Jobs ─────────────────────────── */}
          {!loading && tab === "jobs" && (
            <>
              <div className="page-header page-header--row">
                <div>
                  <h1>Manage Jobs</h1>
                  <p>Create, edit, and manage job postings.</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditJob(null); setShowJobForm(true); }}>
                  <Icon name="plus" size={16} /> Create Job
                </button>
              </div>

              {showJobForm && (
                <JobForm
                  initial={editJob}
                  notify={notify}
                  onSave={(savedJob) => {
                    if (editJob) {
                      setJobs((prev) => prev.map((j) => (j._id === savedJob._id ? savedJob : j)));
                    } else {
                      setJobs((prev) => [savedJob, ...prev]);
                    }
                    setShowJobForm(false);
                    setEditJob(null);
                    notify(editJob ? "Job updated!" : "Job created!");
                  }}
                  onCancel={() => { setShowJobForm(false); setEditJob(null); }}
                />
              )}

              <div className="jobs-grid" style={{ marginTop: "1.5rem" }}>
                {jobs.map((job) => (
                  <div key={job._id} className="job-card" style={{ cursor: "default" }}>
                    <div>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.4rem" }}>
                        <span className="job-dept" style={{ marginBottom: 0 }}>{job.department}</span>
                        <span className={`badge ${job.active ? "badge-green" : "badge-gray"}`} style={{ fontSize: "0.7rem" }}>
                          {job.active ? "Active" : "Paused"}
                        </span>
                      </div>
                      <div className="job-title">{job.title}</div>
                      <div className="job-meta">
                        <span className="job-tag"><Icon name="location" size={13} />{job.location}</span>
                        <span className="job-tag"><Icon name="clock" size={13} />{job.type}</span>
                        <span className="job-tag"><Icon name="users" size={13} />{applications.filter((a) => a.jobId === job._id).length} applicants</span>
                      </div>
                    </div>
                    <div className="job-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => toggleJobStatus(job)}>
                        {job.active ? "Pause" : "Activate"}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => { setEditJob(job); setShowJobForm(true); window.scrollTo(0, 0); }}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteJob(job._id)}>
                        <Icon name="trash" size={13} />
                      </button>
                    </div>
                  </div>
                ))}
                {jobs.length === 0 && (
                  <div className="empty-state"><p>No jobs yet. Create your first posting!</p></div>
                )}
              </div>
            </>
          )}

          {/* ── Applications ────────────────────────── */}
          {!loading && tab === "applications" && (
            <>
              <div className="page-header">
                <h1>All Applications</h1>
                <p>Review and manage incoming job applications.</p>
              </div>

              {applications.length === 0 ? (
                <div className="card empty-state">
                  <Icon name="briefcase" size={40} color="var(--text3)" />
                  <p>No applications yet.</p>
                </div>
              ) : (
                <div className="card">
                  {/* Desktop: scrollable table */}
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr><th>Applicant</th><th>Position</th><th>Experience</th><th>Date</th><th>Status</th><th>Action</th></tr>
                      </thead>
                      <tbody>
                        {applications.map((a) => (
                          <tr key={a._id}>
                            <td>
                              <strong>{a.userName}</strong>
                              <div style={{ fontSize: "0.8rem", color: "var(--text3)" }}>{a.userEmail}</div>
                              {a.phone && <div style={{ fontSize: "0.8rem", color: "var(--text3)" }}>{a.phone}</div>}
                            </td>
                            <td>{a.jobTitle}</td>
                            <td style={{ color: "var(--text2)" }}>{a.experience || "—"}</td>
                            <td style={{ color: "var(--text2)" }}>{new Date(a.appliedAt).toLocaleDateString()}</td>
                            <td><span className={`badge ${statusColor[a.status] || "badge-gray"}`}>{a.status}</span></td>
                            <td>
                              <select
                                className="form-select"
                                style={{ padding: "5px 8px", fontSize: "0.8rem", width: "auto" }}
                                value={a.status}
                                onChange={(e) => updateAppStatus(a._id, e.target.value)}
                              >
                                <option value="pending">Pending</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile: card list */}
                  <div className="app-list">
                    {applications.map((a) => (
                      <div key={a._id} className="app-list-item">
                        <div className="app-list-avatar">{initials(a.userName || a.userEmail)}</div>
                        <div className="app-list-info">
                          <div className="app-list-name">{a.userName || a.userEmail}</div>
                          <div className="app-list-sub">{a.jobTitle}</div>
                          {a.experience && (
                            <div className="app-list-sub" style={{ color: "var(--text3)" }}>{a.experience}</div>
                          )}
                        </div>
                        <div className="app-list-right">
                          <select
                            className="form-select"
                            style={{ padding: "3px 6px", fontSize: "0.72rem", width: "auto", borderRadius: "7px" }}
                            value={a.status}
                            onChange={(e) => updateAppStatus(a._id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          <div className="app-list-date">{new Date(a.appliedAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Users ───────────────────────────────── */}
          {!loading && tab === "users" && (
            <>
              <div className="page-header">
                <h1>Registered Users</h1>
                <p>All accounts created on the Quantum Logics platform.</p>
              </div>

              {users.length === 0 ? (
                <div className="card empty-state">
                  <Icon name="users" size={40} color="var(--text3)" />
                  <p>No users registered yet.</p>
                </div>
              ) : (
                <div className="card">
                  {/* Desktop: scrollable table */}
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr><th>Name</th><th>Email</th><th>Joined</th><th>Applications</th></tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u._id}>
                            <td><strong>{u.name}</strong></td>
                            <td style={{ color: "var(--text2)" }}>{u.email}</td>
                            <td style={{ color: "var(--text2)" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                            <td>
                              <span className="badge badge-blue">
                                {applications.filter((a) => String(a.userId) === String(u._id)).length}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile: card list */}
                  <div className="app-list">
                    {users.map((u) => {
                      const appCount = applications.filter((a) => String(a.userId) === String(u._id)).length;
                      return (
                        <div key={u._id} className="app-list-item">
                          <div className="app-list-avatar">{initials(u.name || u.email)}</div>
                          <div className="app-list-info">
                            <div className="app-list-name">{u.name}</div>
                            <div className="app-list-sub">{u.email}</div>
                          </div>
                          <div className="app-list-right">
                            <span className="badge badge-blue">{appCount} app{appCount !== 1 ? "s" : ""}</span>
                            <div className="app-list-date">Joined {new Date(u.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Settings ────────────────────────────── */}
          {!loading && tab === "settings" && (
            <>
              <div className="page-header">
                <h1>Admin Settings</h1>
                <p>Configure notifications and platform preferences.</p>
              </div>

              <div className="card">
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
                  <Icon name="email" size={24} color="var(--accent)" />
                  <h3 style={{ margin: 0, fontFamily: "var(--font-head)", fontWeight: 700 }}>Email Notification Service</h3>
                </div>

                <div style={{ color: "var(--text2)", lineHeight: 1.6 }}>
                  <p>When someone applies for a job, you will receive an email automatically. To enable this, ensure your <code>backend/.env</code> is configured with your Gmail App Password.</p>

                  <div style={{ background: "rgba(0, 212, 255, 0.05)", padding: "1.5rem", borderRadius: "10px", marginTop: "1rem", border: "1px solid rgba(0, 212, 255, 0.1)" }}>
                    <h4 style={{ margin: "0 0 10px 0", color: "#fff", fontSize: "0.95rem" }}>How to set up:</h4>
                    <ol style={{ paddingLeft: "20px", fontSize: "0.9rem" }}>
                      <li style={{ marginBottom: "8px" }}>Go to your <strong>Google Account</strong> &gt; Security.</li>
                      <li style={{ marginBottom: "8px" }}>Enable <strong>2-Step Verification</strong> if not already active.</li>
                      <li style={{ marginBottom: "8px" }}>Search for <strong>App Passwords</strong> at the top search bar.</li>
                      <li style={{ marginBottom: "8px" }}>Create one for "Mail" and copy the 16-character code.</li>
                      <li style={{ marginBottom: "8px" }}>Paste it into <code>backend/.env</code> as <code>EMAIL_PASS</code>.</li>
                    </ol>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>{/* end tab-content */}
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
            <span className="dash-bottom-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}