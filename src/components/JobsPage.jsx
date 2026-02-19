import { useState, useEffect } from "react";
import Icon from "./Icon";
import api from "../utils/api";

// ─── Jobs Page (Public) ────────────────────────────────────────────────────────
export default function JobsPage({ currentUser, setShowAuth, setShowApplyModal, selectedJob, setSelectedJob }) {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/jobs")
      .then(({ data }) => setJobs(data))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const depts = ["All", ...new Set(jobs.map((j) => j.department))];
  const filtered = filter === "All" ? jobs : jobs.filter((j) => j.department === filter);

  return (
    <>
      {/* ── Header ────────────────────────────────────── */}
      <section className="section" style={{ paddingTop: "120px", paddingBottom: "40px" }}>
        <div className="section-inner">
          <span className="section-label">Open Positions</span>
          <h2 className="section-title">Build Your Career at Quantum</h2>
          <p className="section-sub">We hire for talent, drive, and values. Find your perfect role below.</p>
        </div>
      </section>

      {/* ── Department Filter ─────────────────────────── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            {depts.map((d) => (
              <button
                key={d}
                className={`btn btn-sm ${filter === d ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setFilter(d)}
              >
                {d}
              </button>
            ))}
          </div>

          {/* ── Loading ───────────────────────────────────── */}
          {loading && (
            <div className="empty-state">
              <p style={{ color: "var(--text3)" }}>Loading jobs…</p>
            </div>
          )}

          {/* ── Job Listings ──────────────────────────────── */}
          {!loading && (
            <div className="jobs-grid">
              {filtered.map((job) => (
                <div key={job._id} className="job-card" onClick={() => setSelectedJob(job._id === selectedJob ? null : job._id)}>
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
                    <span className="badge badge-green">Open</span>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!currentUser) { setShowAuth("login"); return; }
                        setShowApplyModal(job);
                      }}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Expanded Job Detail ───────────────────────── */}
          {selectedJob && (() => {
            const job = jobs.find((j) => j._id === selectedJob);
            if (!job) return null;
            return (
              <div className="job-detail-panel">
                <div className="job-dept">{job.department}</div>
                <h2 className="job-title" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{job.title}</h2>
                <div className="job-meta" style={{ marginBottom: "1.5rem" }}>
                  <span className="job-tag"><Icon name="location" size={13} />{job.location}</span>
                  <span className="job-tag"><Icon name="clock" size={13} />{job.type}</span>
                  <span className="job-tag"><Icon name="dollar" size={13} />{job.salary}</span>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ marginBottom: "2rem" }}
                  onClick={() => {
                    if (!currentUser) { setShowAuth("login"); return; }
                    setShowApplyModal(job);
                  }}
                >
                  Apply for this Role <Icon name="arrow" size={16} />
                </button>
                <div className="divider" />
                <p style={{ color: "var(--text2)", lineHeight: 1.7, marginBottom: "1.5rem" }}>{job.description}</p>
                <h4 style={{ fontFamily: "var(--font-head)", fontWeight: 700, marginBottom: "0.5rem" }}>Requirements</h4>
                <ul className="req-list">
                  {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
                {!currentUser && (
                  <div style={{ marginTop: "2rem", padding: "1.5rem", background: "rgba(0,212,255,0.05)", border: "1px solid var(--border2)", borderRadius: 12 }}>
                    <p style={{ color: "var(--text2)", marginBottom: "1rem" }}>
                      Sign in or create an account to apply for this role.
                    </p>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowAuth("register")}>
                      Get Started
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          {!loading && filtered.length === 0 && (
            <div className="empty-state">
              <Icon name="briefcase" size={40} color="var(--text3)" />
              <p>No open positions in this department right now. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer-brand">Quantum Logics</div>
        <div className="footer-tag">© 2025 Quantum Logics. Built with hard work, teamwork &amp; dedication.</div>
      </footer>
    </>
  );
}
