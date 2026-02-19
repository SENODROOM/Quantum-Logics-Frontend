// ─── Global Styles ─────────────────────────────────────────────────────────────
export const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #050810; --bg2: #090d1a; --card: #0d1424; --card2: #111827;
  --border: rgba(99,179,237,0.12); --border2: rgba(99,179,237,0.2);
  --primary: #00d4ff; --primary2: #0099cc; --accent: #ff6b35; --accent2: #ff8c5a;
  --gold: #ffd700; --text: #e8f4ff; --text2: #8ba8c7; --text3: #506480;
  --success: #10b981; --danger: #ef4444; --warning: #f59e0b;
  --font-head: 'Syne', sans-serif; --font-body: 'DM Sans', sans-serif;
}

html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--text); font-family: var(--font-body); overflow-x: hidden; }
.app { min-height: 100vh; }

.app::before {
  content: '';
  position: fixed; inset: 0; z-index: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none; opacity: 0.4;
}

/* ── Nav ─────────────────────────────────────── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  background: rgba(5,8,16,0.85); backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  padding: 0 2rem; height: 68px;
  display: flex; align-items: center; justify-content: space-between;
}
.nav-logo { display: flex; align-items: center; gap: 12px; cursor: pointer; }
.nav-logo-text {
  font-family: var(--font-head); font-size: 1.3rem; font-weight: 800;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.nav-links { display: flex; align-items: center; gap: 0.5rem; }
.nav-btn {
  background: none; border: none; cursor: pointer; color: var(--text2);
  font-family: var(--font-body); font-size: 0.9rem; padding: 8px 16px;
  border-radius: 8px; transition: all 0.2s; font-weight: 500;
}
.nav-btn:hover { color: var(--text); background: rgba(99,179,237,0.08); }
.nav-btn.active { color: var(--primary); }
.nav-btn.primary {
  background: linear-gradient(135deg, var(--primary), var(--primary2));
  color: var(--bg); font-weight: 600; padding: 8px 20px;
}
.nav-btn.primary:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(0,212,255,0.3); }

/* ── Hero ────────────────────────────────────── */
.hero {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  position: relative; padding: 120px 2rem 80px; overflow: hidden;
}
.hero-grid {
  position: absolute; inset: 0; z-index: 0;
  background-image: linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
}
.hero-glow {
  position: absolute; width: 600px; height: 600px; border-radius: 50%;
  background: radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%);
  top: 50%; left: 50%; transform: translate(-50%, -50%);
  animation: pulse 4s ease-in-out infinite;
}
.hero-glow2 {
  position: absolute; width: 400px; height: 400px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,107,53,0.06) 0%, transparent 70%);
  top: 30%; right: 10%; animation: pulse 6s ease-in-out infinite reverse;
}
@keyframes pulse {
  0%,100% { transform: translate(-50%,-50%) scale(1); opacity:1; }
  50% { transform: translate(-50%,-50%) scale(1.1); opacity:0.7; }
}
.hero-content { position: relative; z-index: 1; text-align: center; max-width: 900px; }
.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.25);
  color: var(--primary); font-size: 0.78rem; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase;
  padding: 6px 16px; border-radius: 100px; margin-bottom: 2rem;
}
.hero-title {
  font-family: var(--font-head); font-size: clamp(2.8rem, 7vw, 5.5rem);
  font-weight: 800; line-height: 1.05; margin-bottom: 1.5rem; color: var(--text);
}
.hero-title span {
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.hero-sub {
  font-size: 1.15rem; color: var(--text2); max-width: 600px;
  margin: 0 auto 2.5rem; line-height: 1.7; font-weight: 300;
}
.hero-ctas { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

/* ── Buttons ─────────────────────────────────── */
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 28px; border-radius: 10px; font-family: var(--font-body);
  font-size: 0.95rem; font-weight: 600; cursor: pointer;
  border: none; transition: all 0.25s; text-decoration: none;
}
.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--primary2));
  color: var(--bg); box-shadow: 0 4px 24px rgba(0,212,255,0.25);
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,212,255,0.4); }
.btn-outline {
  background: transparent; color: var(--text); border: 1px solid var(--border2);
}
.btn-outline:hover { background: rgba(99,179,237,0.08); border-color: var(--primary); color: var(--primary); transform: translateY(-2px); }
.btn-accent {
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: white; box-shadow: 0 4px 24px rgba(255,107,53,0.25);
}
.btn-accent:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(255,107,53,0.4); }
.btn-danger { background: var(--danger); color: white; }
.btn-danger:hover { background: #dc2626; transform: translateY(-1px); }
.btn-sm { padding: 7px 16px; font-size: 0.85rem; }
.btn-ghost { background: rgba(99,179,237,0.06); border: 1px solid var(--border); color: var(--text2); }
.btn-ghost:hover { background: rgba(99,179,237,0.12); color: var(--text); }
.btn-success { background: var(--success); color: white; }
.btn-success:hover { background: #059669; }

/* ── Stats Row ───────────────────────────────── */
.stats-row {
  display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap;
  margin-top: 4rem; padding-top: 3rem; border-top: 1px solid var(--border);
}
.stat-item { text-align: center; }
.stat-num { font-family: var(--font-head); font-size: 2.2rem; font-weight: 800; color: var(--primary); }
.stat-label { font-size: 0.82rem; color: var(--text3); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px; }

/* ── Sections ────────────────────────────────── */
.section { padding: 100px 2rem; position: relative; z-index: 1; }
.section-inner { max-width: 1200px; margin: 0 auto; }
.section-label {
  display: inline-block; color: var(--primary); font-size: 0.75rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 1rem;
  font-family: var(--font-head);
}
.section-title { font-family: var(--font-head); font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800; margin-bottom: 1rem; color: var(--text); }
.section-sub { color: var(--text2); font-size: 1rem; max-width: 600px; line-height: 1.7; font-weight: 300; }

/* ── Values ──────────────────────────────────── */
.values-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 3rem; }
.value-card {
  background: var(--card); border: 1px solid var(--border); border-radius: 16px;
  padding: 2rem; transition: all 0.3s; position: relative; overflow: hidden;
}
.value-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  transform: scaleX(0); transition: transform 0.3s; transform-origin: left;
}
.value-card:hover { border-color: var(--border2); transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.3); }
.value-card:hover::before { transform: scaleX(1); }
.value-icon { width: 52px; height: 52px; border-radius: 14px; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
.value-card h3 { font-family: var(--font-head); font-size: 1.15rem; font-weight: 700; margin-bottom: 0.6rem; }
.value-card p { color: var(--text2); font-size: 0.9rem; line-height: 1.7; font-weight: 300; }

/* ── Jobs ────────────────────────────────────── */
.jobs-grid { display: grid; gap: 1.25rem; margin-top: 2.5rem; }
.job-card {
  background: var(--card); border: 1px solid var(--border); border-radius: 16px;
  padding: 1.75rem; display: grid; grid-template-columns: 1fr auto;
  gap: 1.5rem; align-items: start; transition: all 0.25s; cursor: pointer;
}
.job-card:hover {
  border-color: var(--border2); background: var(--card2);
  transform: translateX(4px); box-shadow: -4px 0 0 var(--primary);
}
.job-title { font-family: var(--font-head); font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem; }
.job-dept { color: var(--primary); font-size: 0.82rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.75rem; }
.job-meta { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.job-tag { display: flex; align-items: center; gap: 5px; color: var(--text3); font-size: 0.82rem; font-weight: 400; }
.job-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 0.75rem; }

/* ── Badges ──────────────────────────────────── */
.badge { padding: 4px 12px; border-radius: 100px; font-size: 0.75rem; font-weight: 600; display: inline-block; }
.badge-green { background: rgba(16,185,129,0.15); color: var(--success); border: 1px solid rgba(16,185,129,0.25); }
.badge-blue { background: rgba(0,212,255,0.1); color: var(--primary); border: 1px solid rgba(0,212,255,0.2); }
.badge-orange { background: rgba(255,107,53,0.1); color: var(--accent); border: 1px solid rgba(255,107,53,0.2); }
.badge-gray { background: rgba(80,100,128,0.2); color: var(--text3); border: 1px solid rgba(80,100,128,0.2); }

/* ── Team ────────────────────────────────────── */
.team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-top: 3rem; }
.team-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 2rem; text-align: center; transition: all 0.3s; }
.team-card:hover { border-color: var(--border2); transform: translateY(-4px); }
.team-avatar {
  width: 80px; height: 80px; border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center;
  font-family: var(--font-head); font-size: 1.5rem; font-weight: 800; color: var(--bg);
}
.team-name { font-family: var(--font-head); font-weight: 700; margin-bottom: 0.25rem; }
.team-role { color: var(--text3); font-size: 0.85rem; }

/* ── Auth Modal ──────────────────────────────── */
.modal-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(5,8,16,0.9); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; padding: 1rem;
}
.modal {
  background: var(--card); border: 1px solid var(--border2); border-radius: 20px;
  padding: 2.5rem; width: 100%; max-width: 440px; position: relative;
  max-height: 90vh; overflow-y: auto;
}
.modal-close {
  position: absolute; top: 1.25rem; right: 1.25rem;
  background: rgba(99,179,237,0.08); border: 1px solid var(--border);
  border-radius: 8px; color: var(--text2); cursor: pointer; padding: 6px;
  display: flex; transition: all 0.2s;
}
.modal-close:hover { color: var(--text); background: rgba(99,179,237,0.15); }
.modal-title { font-family: var(--font-head); font-size: 1.5rem; font-weight: 800; margin-bottom: 0.4rem; }
.modal-sub { color: var(--text2); font-size: 0.88rem; margin-bottom: 2rem; font-weight: 300; }

/* ── Forms ───────────────────────────────────── */
.form-group { margin-bottom: 1.25rem; }
.form-label { display: block; font-size: 0.82rem; font-weight: 600; color: var(--text2); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.06em; }
.form-input, .form-select, .form-textarea {
  width: 100%; background: rgba(99,179,237,0.05); border: 1px solid var(--border);
  border-radius: 10px; color: var(--text); font-family: var(--font-body);
  font-size: 0.95rem; padding: 10px 14px; transition: all 0.2s; outline: none; font-weight: 300;
}
.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: var(--primary); background: rgba(0,212,255,0.06);
  box-shadow: 0 0 0 3px rgba(0,212,255,0.1);
}
.form-textarea { resize: vertical; min-height: 100px; }
.form-select option { background: var(--card2); }
.form-error { color: var(--danger); font-size: 0.82rem; margin-top: 4px; }

/* ── Dashboard ───────────────────────────────── */
.dashboard { min-height: 100vh; display: flex; }
.sidebar {
  width: 260px; background: var(--bg2); border-right: 1px solid var(--border);
  padding: 1.5rem; display: flex; flex-direction: column; gap: 0.25rem;
  position: fixed; top: 0; bottom: 0; z-index: 50;
}
.sidebar-logo { display: flex; align-items: center; gap: 10px; padding: 0.5rem 0 1.5rem; border-bottom: 1px solid var(--border); margin-bottom: 0.5rem; }
.sidebar-logo-text { font-family: var(--font-head); font-size: 1rem; font-weight: 800; color: var(--text); }
.sidebar-btn {
  display: flex; align-items: center; gap: 10px; padding: 10px 14px;
  border-radius: 10px; border: none; background: none; color: var(--text2);
  font-family: var(--font-body); font-size: 0.9rem; font-weight: 500;
  cursor: pointer; width: 100%; text-align: left; transition: all 0.2s;
}
.sidebar-btn:hover { background: rgba(99,179,237,0.08); color: var(--text); }
.sidebar-btn.active { background: rgba(0,212,255,0.12); color: var(--primary); }
.sidebar-footer { margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border); }
.sidebar-user { padding: 10px 14px; font-size: 0.85rem; color: var(--text2); font-weight: 300; margin-bottom: 0.5rem; }
.sidebar-user strong { display: block; color: var(--text); font-weight: 600; font-size: 0.9rem; }
.main-content { margin-left: 260px; flex: 1; padding: 2.5rem; min-height: 100vh; }
.page-header { margin-bottom: 2.5rem; }
.page-header h1 { font-family: var(--font-head); font-size: 1.8rem; font-weight: 800; margin-bottom: 0.3rem; }
.page-header p { color: var(--text2); font-size: 0.9rem; font-weight: 300; }

/* ── Cards ───────────────────────────────────── */
.card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 1.75rem; }
.card + .card { margin-top: 1.25rem; }
.stats-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 2rem; }
.stat-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 1.5rem; position: relative; overflow: hidden; }
.stat-card::after {
  content: ''; position: absolute; bottom: 0; right: 0; width: 80px; height: 80px;
  border-radius: 50%; background: radial-gradient(circle, rgba(0,212,255,0.08), transparent);
}
.stat-card-num { font-family: var(--font-head); font-size: 2rem; font-weight: 800; color: var(--primary); }
.stat-card-label { font-size: 0.82rem; color: var(--text3); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px; }

/* ── Table ───────────────────────────────────── */
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th { text-align: left; font-size: 0.75rem; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: 0.1em; padding: 10px 16px; border-bottom: 1px solid var(--border); }
td { padding: 14px 16px; border-bottom: 1px solid rgba(99,179,237,0.06); font-size: 0.9rem; vertical-align: middle; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: rgba(99,179,237,0.03); }

/* ── Job Detail ──────────────────────────────── */
.job-detail-panel { background: var(--card); border: 1px solid var(--border2); border-radius: 20px; padding: 2.5rem; margin-top: 1.5rem; }
.req-list { list-style: none; margin-top: 0.75rem; }
.req-list li { display: flex; align-items: flex-start; gap: 10px; padding: 6px 0; font-size: 0.9rem; color: var(--text2); font-weight: 300; }
.req-list li::before { content: '→'; color: var(--primary); font-weight: 700; flex-shrink: 0; }

/* ── Apply Form ──────────────────────────────── */
.apply-form { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
.apply-form .full { grid-column: 1 / -1; }

/* ── Footer ──────────────────────────────────── */
.footer { background: var(--bg2); border-top: 1px solid var(--border); padding: 3rem 2rem; text-align: center; position: relative; z-index: 1; }
.footer-brand { font-family: var(--font-head); font-size: 1.4rem; font-weight: 800; color: var(--text); margin-bottom: 0.5rem; }
.footer-tag { color: var(--text3); font-size: 0.85rem; font-weight: 300; }

/* ── Misc ────────────────────────────────────── */
.divider { height: 1px; background: var(--border); margin: 1.5rem 0; }
.tab-row { display: flex; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: -1px; }
.tab-btn { padding: 10px 20px; background: none; border: none; cursor: pointer; font-family: var(--font-body); font-size: 0.9rem; font-weight: 500; color: var(--text2); transition: all 0.2s; position: relative; border-bottom: 2px solid transparent; margin-bottom: -1px; }
.tab-btn:hover { color: var(--text); }
.tab-btn.active { color: var(--primary); border-bottom-color: var(--primary); }
.empty-state { text-align: center; padding: 4rem 2rem; color: var(--text3); }
.empty-state p { font-size: 0.9rem; margin-top: 0.5rem; }

/* ── Notification ────────────────────────────── */
.notification {
  position: fixed; top: 80px; right: 20px; z-index: 300;
  padding: 14px 20px; border-radius: 12px; font-size: 0.9rem; font-weight: 500;
  display: flex; align-items: center; gap: 10px; max-width: 360px;
  animation: fadeUp 0.3s ease; box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}
.notification.success { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); color: var(--success); }
.notification.error { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: var(--danger); }

/* ── Animations ──────────────────────────────── */
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.fade-up { animation: fadeUp 0.5s ease forwards; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.spin { animation: spin 1s linear infinite; }

/* ── Mobile ──────────────────────────────────── */
@media (max-width: 768px) {
  .sidebar { display: none; }
  .main-content { margin-left: 0; padding: 1.5rem 1rem; }
  .apply-form { grid-template-columns: 1fr; }
  .apply-form .full { grid-column: 1; }
  .job-card { grid-template-columns: 1fr; }
  .job-actions { flex-direction: row; align-items: center; }
}
`;
