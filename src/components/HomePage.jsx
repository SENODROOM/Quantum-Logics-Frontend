import { useNavigate } from "react-router-dom";

// ─── Home Page ─────────────────────────────────────────────────────────────────
export default function HomePage({ setShowAuth }) {
  const navigate = useNavigate();
  const values = [
    { icon: "⚡", color: "rgba(0,212,255,0.15)", title: "Hard Work", desc: "We believe in relentless effort and pushing boundaries. Every line of code, every pixel, every decision reflects our commitment to excellence." },
    { icon: "🤝", color: "rgba(255,107,53,0.12)", title: "Teamwork", desc: "Our greatest strength lies in collaboration. We build together, solve together, and grow together — sharing knowledge across every level." },
    { icon: "🎯", color: "rgba(255,215,0,0.1)", title: "Dedication", desc: "We don't just finish projects — we see them through with unwavering focus. Our dedication to clients and quality is never negotiable." },
    { icon: "🚀", color: "rgba(16,185,129,0.1)", title: "Innovation", desc: "We challenge conventional thinking and embrace emerging technologies to craft solutions that put clients ahead of the curve." },
    { icon: "🛡️", color: "rgba(168,85,247,0.1)", title: "Integrity", desc: "Trust is the foundation of every relationship we build. Transparency, honesty, and accountability drive everything we do." },
    { icon: "📐", color: "rgba(239,68,68,0.1)", title: "Precision", desc: "Quantum precision means measurable results. We set clear goals, track progress rigorously, and deliver outcomes that matter." },
  ];

  const team = [
    { name: "Zaid Akhtar", role: "CEO & Co-Founder", init: "ZA" },
    { name: "Sara Mehmood", role: "CTO", init: "SM" },
    { name: "Hassan Ali", role: "Lead Engineer", init: "HA" },
    { name: "Nadia Khan", role: "Head of Design", init: "NK" },
  ];

  return (
    <>
      {/* ── Hero Section ─────────────────────────────── */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-glow2" />
        <div className="hero-content fade-up">
          <div className="hero-badge">✦ Quantum Logics — Est. 2019</div>
          <h1 className="hero-title">
            Engineering the Future,{" "}
            <span>One Commit at a Time.</span>
          </h1>
          <p className="hero-sub">
            We're a software house that blends relentless hard work, deep technical expertise, and seamless teamwork to build products that scale, inspire, and endure.
          </p>
          <div className="hero-ctas">
            <button className="btn btn-primary" onClick={() => navigate("/jobs")}>
              Join Our Team →
            </button>
            <button className="btn btn-outline" onClick={() => setShowAuth("register")}>
              Create Account
            </button>
          </div>
          <div className="stats-row">
            <div className="stat-item"><div className="stat-num">120+</div><div className="stat-label">Projects Delivered</div></div>
            <div className="stat-item"><div className="stat-num">45+</div><div className="stat-label">Team Members</div></div>
            <div className="stat-item"><div className="stat-num">6yr</div><div className="stat-label">In Business</div></div>
            <div className="stat-item"><div className="stat-num">98%</div><div className="stat-label">Client Satisfaction</div></div>
          </div>
        </div>
      </section>

      {/* ── Values Section ────────────────────────────── */}
      <section className="section" style={{ background: "var(--bg2)" }}>
        <div className="section-inner">
          <span className="section-label">Our Core Values</span>
          <h2 className="section-title">Built on Principles. Driven by Purpose.</h2>
          <p className="section-sub">
            Every team member at Quantum Logics lives by these values — they're not just words on a wall, they're the engine of everything we build.
          </p>
          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} className="value-card">
                <div className="value-icon" style={{ background: v.color }}>{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team Section ──────────────────────────────── */}
      <section className="section">
        <div className="section-inner">
          <span className="section-label">Leadership</span>
          <h2 className="section-title">The Minds Behind Quantum</h2>
          <p className="section-sub">
            A team of passionate engineers, designers, and strategists committed to building what matters.
          </p>
          <div className="team-grid">
            {team.map((t, i) => (
              <div key={i} className="team-card">
                <div className="team-avatar">{t.init}</div>
                <div className="team-name">{t.name}</div>
                <div className="team-role">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────────── */}
      <section className="section" style={{ background: "var(--bg2)" }}>
        <div className="section-inner" style={{ textAlign: "center" }}>
          <span className="section-label">Join the Team</span>
          <h2 className="section-title">Ready to Build Something Extraordinary?</h2>
          <p className="section-sub" style={{ margin: "0 auto 2.5rem" }}>
            We're always looking for talented, driven people to join our growing team. Apply for an open role or create an account to get started.
          </p>
          <div className="hero-ctas">
            <button className="btn btn-primary" onClick={() => navigate("/jobs")}>View Open Roles</button>
            <button className="btn btn-outline" onClick={() => setShowAuth("register")}>Create Account</button>
          </div>
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
