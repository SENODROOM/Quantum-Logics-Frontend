import { useState, useEffect, useRef } from "react";

// ─── Simulated Backend (In-Memory + Storage) ───────────────────────────────

const STORAGE_KEY_USERS = "ql_users";
const STORAGE_KEY_JOBS = "ql_jobs";
const STORAGE_KEY_APPS = "ql_applications";

const defaultJobs = [
    {
        id: "job_1",
        title: "Senior Full Stack Engineer",
        department: "Engineering",
        location: "Lahore, Pakistan / Remote",
        type: "Full-time",
        salary: "$3,000 – $5,000/mo",
        description:
            "Lead the architecture and development of scalable web applications. You'll work closely with product and design teams to deliver world-class software.",
        requirements: [
            "5+ years experience with React/Node.js",
            "Strong database design skills (MongoDB, PostgreSQL)",
            "Experience with cloud platforms (AWS/GCP)",
            "Excellent communication skills",
        ],
        postedAt: new Date("2025-01-10").toISOString(),
        active: true,
    },
    {
        id: "job_2",
        title: "UI/UX Designer",
        department: "Design",
        location: "Remote",
        type: "Full-time",
        salary: "$2,000 – $3,500/mo",
        description:
            "Craft intuitive, beautiful user experiences for our product suite. You'll conduct user research, create wireframes, and work hand-in-hand with our engineering team.",
        requirements: [
            "3+ years UX/UI design experience",
            "Proficiency in Figma and Adobe Creative Suite",
            "Portfolio showcasing strong design thinking",
            "Experience with design systems",
        ],
        postedAt: new Date("2025-01-15").toISOString(),
        active: true,
    },
    {
        id: "job_3",
        title: "DevOps Engineer",
        department: "Infrastructure",
        location: "Hybrid",
        type: "Full-time",
        salary: "$2,800 – $4,500/mo",
        description:
            "Maintain, optimize, and scale our cloud infrastructure. You'll automate deployments, monitor system health, and champion engineering best practices.",
        requirements: [
            "Strong Linux administration skills",
            "Experience with Kubernetes and Docker",
            "CI/CD pipeline expertise",
            "Security-first mindset",
        ],
        postedAt: new Date("2025-01-20").toISOString(),
        active: true,
    },
];

const defaultAdmin = {
    id: "admin_0",
    name: "Admin",
    email: "admin@quantumlogics.io",
    password: "admin123",
    role: "admin",
    createdAt: new Date().toISOString(),
};

function getUsers() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY_USERS);
        const users = raw ? JSON.parse(raw) : [];
        if (!users.find((u) => u.role === "admin")) users.unshift(defaultAdmin);
        return users;
    } catch {
        return [defaultAdmin];
    }
}
function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
}
function getJobs() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY_JOBS);
        return raw ? JSON.parse(raw) : defaultJobs;
    } catch {
        return defaultJobs;
    }
}
function saveJobs(jobs) {
    localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(jobs));
}
function getApplications() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY_APPS);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}
function saveApplications(apps) {
    localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(apps));
}

// ─── Icons ──────────────────────────────────────────────────────────────────

const Icon = ({ name, size = 20, color = "currentColor" }) => {
    const icons = {
        quantum: (
            <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke={color} strokeWidth="2" />
                <circle cx="20" cy="20" r="6" fill={color} />
                <line x1="20" y1="2" x2="20" y2="38" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" />
                <line x1="2" y1="20" x2="38" y2="20" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" />
                <ellipse cx="20" cy="20" rx="18" ry="7" stroke={color} strokeWidth="1.5" transform="rotate(45 20 20)" />
            </svg>
        ),
        briefcase: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                <line x1="12" y1="12" x2="12" y2="12" />
                <path d="M2 12h20" />
            </svg>
        ),
        users: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
        logout: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
        ),
        plus: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
        ),
        check: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        ),
        x: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        ),
        eye: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
            </svg>
        ),
        arrow: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
        ),
        trash: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
            </svg>
        ),
        location: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
        ),
        dollar: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
        ),
        menu: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
        ),
        home: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
        clock: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
        ),
    };
    return icons[name] || null;
};

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #050810;
    --bg2: #090d1a;
    --card: #0d1424;
    --card2: #111827;
    --border: rgba(99,179,237,0.12);
    --border2: rgba(99,179,237,0.2);
    --primary: #00d4ff;
    --primary2: #0099cc;
    --accent: #ff6b35;
    --accent2: #ff8c5a;
    --gold: #ffd700;
    --text: #e8f4ff;
    --text2: #8ba8c7;
    --text3: #506480;
    --success: #10b981;
    --danger: #ef4444;
    --warning: #f59e0b;
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); overflow-x: hidden; }

  .app { min-height: 100vh; }

  /* Noise texture overlay */
  .app::before {
    content: '';
    position: fixed; inset: 0; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none; opacity: 0.4;
  }

  /* Nav */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(5,8,16,0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    padding: 0 2rem; height: 68px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .nav-logo { display: flex; align-items: center; gap: 12px; cursor: pointer; }
  .nav-logo-text { font-family: var(--font-head); font-size: 1.3rem; font-weight: 800; 
    background: linear-gradient(135deg, var(--primary), var(--accent));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .nav-links { display: flex; align-items: center; gap: 0.5rem; }
  .nav-btn {
    background: none; border: none; cursor: pointer;
    color: var(--text2); font-family: var(--font-body); font-size: 0.9rem;
    padding: 8px 16px; border-radius: 8px; transition: all 0.2s;
    font-weight: 500;
  }
  .nav-btn:hover { color: var(--text); background: rgba(99,179,237,0.08); }
  .nav-btn.active { color: var(--primary); }
  .nav-btn.primary {
    background: linear-gradient(135deg, var(--primary), var(--primary2));
    color: var(--bg); font-weight: 600; padding: 8px 20px;
  }
  .nav-btn.primary:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(0,212,255,0.3); }

  /* Hero */
  .hero {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    position: relative; padding: 120px 2rem 80px;
    overflow: hidden;
  }
  .hero-grid {
    position: absolute; inset: 0; z-index: 0;
    background-image:
      linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
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
    top: 30%; right: 10%;
    animation: pulse 6s ease-in-out infinite reverse;
  }
  @keyframes pulse { 0%,100% { transform: translate(-50%,-50%) scale(1); opacity:1; } 50% { transform: translate(-50%,-50%) scale(1.1); opacity:0.7; } }

  .hero-content { position: relative; z-index: 1; text-align: center; max-width: 900px; }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.25);
    color: var(--primary); font-size: 0.78rem; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; padding: 6px 16px; border-radius: 100px;
    margin-bottom: 2rem;
  }
  .hero-title {
    font-family: var(--font-head); font-size: clamp(2.8rem, 7vw, 5.5rem);
    font-weight: 800; line-height: 1.05; margin-bottom: 1.5rem;
    color: var(--text);
  }
  .hero-title span {
    background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .hero-sub { font-size: 1.15rem; color: var(--text2); max-width: 600px; margin: 0 auto 2.5rem; line-height: 1.7; font-weight: 300; }
  .hero-ctas { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 28px; border-radius: 10px; font-family: var(--font-body);
    font-size: 0.95rem; font-weight: 600; cursor: pointer; border: none;
    transition: all 0.25s; text-decoration: none;
  }
  .btn-primary {
    background: linear-gradient(135deg, var(--primary), var(--primary2));
    color: var(--bg);
    box-shadow: 0 4px 24px rgba(0,212,255,0.25);
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

  /* Stats */
  .stats-row {
    display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap;
    margin-top: 4rem; padding-top: 3rem;
    border-top: 1px solid var(--border);
  }
  .stat-item { text-align: center; }
  .stat-num { font-family: var(--font-head); font-size: 2.2rem; font-weight: 800; color: var(--primary); }
  .stat-label { font-size: 0.82rem; color: var(--text3); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px; }

  /* Sections */
  .section { padding: 100px 2rem; position: relative; z-index: 1; }
  .section-inner { max-width: 1200px; margin: 0 auto; }
  .section-label {
    display: inline-block; color: var(--primary); font-size: 0.75rem;
    font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em;
    margin-bottom: 1rem; font-family: var(--font-head);
  }
  .section-title { font-family: var(--font-head); font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800; margin-bottom: 1rem; color: var(--text); }
  .section-sub { color: var(--text2); font-size: 1rem; max-width: 600px; line-height: 1.7; font-weight: 300; }

  /* Values Grid */
  .values-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 3rem; }
  .value-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 16px; padding: 2rem;
    transition: all 0.3s; position: relative; overflow: hidden;
  }
  .value-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--primary), var(--accent));
    transform: scaleX(0); transition: transform 0.3s; transform-origin: left;
  }
  .value-card:hover { border-color: var(--border2); transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.3); }
  .value-card:hover::before { transform: scaleX(1); }
  .value-icon {
    width: 52px; height: 52px; border-radius: 14px; margin-bottom: 1.25rem;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem;
  }
  .value-card h3 { font-family: var(--font-head); font-size: 1.15rem; font-weight: 700; margin-bottom: 0.6rem; }
  .value-card p { color: var(--text2); font-size: 0.9rem; line-height: 1.7; font-weight: 300; }

  /* Jobs */
  .jobs-grid { display: grid; gap: 1.25rem; margin-top: 2.5rem; }
  .job-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 16px; padding: 1.75rem;
    display: grid; grid-template-columns: 1fr auto;
    gap: 1.5rem; align-items: start;
    transition: all 0.25s; cursor: pointer;
  }
  .job-card:hover { border-color: var(--border2); background: var(--card2); transform: translateX(4px); box-shadow: -4px 0 0 var(--primary); }
  .job-title { font-family: var(--font-head); font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem; }
  .job-dept { color: var(--primary); font-size: 0.82rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.75rem; }
  .job-meta { display: flex; flex-wrap: wrap; gap: 0.75rem; }
  .job-tag {
    display: flex; align-items: center; gap: 5px;
    color: var(--text3); font-size: 0.82rem; font-weight: 400;
  }
  .job-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 0.75rem; }
  .badge {
    padding: 4px 12px; border-radius: 100px; font-size: 0.75rem; font-weight: 600;
    display: inline-block;
  }
  .badge-green { background: rgba(16,185,129,0.15); color: var(--success); border: 1px solid rgba(16,185,129,0.25); }
  .badge-blue { background: rgba(0,212,255,0.1); color: var(--primary); border: 1px solid rgba(0,212,255,0.2); }
  .badge-orange { background: rgba(255,107,53,0.1); color: var(--accent); border: 1px solid rgba(255,107,53,0.2); }
  .badge-gray { background: rgba(80,100,128,0.2); color: var(--text3); border: 1px solid rgba(80,100,128,0.2); }

  /* Team */
  .team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-top: 3rem; }
  .team-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 16px; padding: 2rem; text-align: center;
    transition: all 0.3s;
  }
  .team-card:hover { border-color: var(--border2); transform: translateY(-4px); }
  .team-avatar {
    width: 80px; height: 80px; border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), var(--accent));
    margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center;
    font-family: var(--font-head); font-size: 1.5rem; font-weight: 800; color: var(--bg);
  }
  .team-name { font-family: var(--font-head); font-weight: 700; margin-bottom: 0.25rem; }
  .team-role { color: var(--text3); font-size: 0.85rem; }

  /* Auth Modal */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(5,8,16,0.9); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center; padding: 1rem;
  }
  .modal {
    background: var(--card); border: 1px solid var(--border2);
    border-radius: 20px; padding: 2.5rem; width: 100%; max-width: 440px;
    position: relative; max-height: 90vh; overflow-y: auto;
  }
  .modal-close {
    position: absolute; top: 1.25rem; right: 1.25rem;
    background: rgba(99,179,237,0.08); border: 1px solid var(--border); border-radius: 8px;
    color: var(--text2); cursor: pointer; padding: 6px; display: flex;
    transition: all 0.2s;
  }
  .modal-close:hover { color: var(--text); background: rgba(99,179,237,0.15); }
  .modal-title { font-family: var(--font-head); font-size: 1.5rem; font-weight: 800; margin-bottom: 0.4rem; }
  .modal-sub { color: var(--text2); font-size: 0.88rem; margin-bottom: 2rem; font-weight: 300; }

  /* Forms */
  .form-group { margin-bottom: 1.25rem; }
  .form-label { display: block; font-size: 0.82rem; font-weight: 600; color: var(--text2); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.06em; }
  .form-input, .form-select, .form-textarea {
    width: 100%; background: rgba(99,179,237,0.05); border: 1px solid var(--border);
    border-radius: 10px; color: var(--text); font-family: var(--font-body); font-size: 0.95rem;
    padding: 10px 14px; transition: all 0.2s; outline: none;
    font-weight: 300;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    border-color: var(--primary); background: rgba(0,212,255,0.06);
    box-shadow: 0 0 0 3px rgba(0,212,255,0.1);
  }
  .form-textarea { resize: vertical; min-height: 100px; }
  .form-select option { background: var(--card2); }
  .form-error { color: var(--danger); font-size: 0.82rem; margin-top: 4px; }

  /* Dashboard */
  .dashboard { min-height: 100vh; display: flex; }
  .sidebar {
    width: 260px; background: var(--bg2); border-right: 1px solid var(--border);
    padding: 1.5rem; display: flex; flex-direction: column; gap: 0.25rem;
    position: fixed; top: 0; bottom: 0; z-index: 50;
  }
  .sidebar-logo { display: flex; align-items: center; gap: 10px; padding: 0.5rem 0 1.5rem; border-bottom: 1px solid var(--border); margin-bottom: 0.5rem; }
  .sidebar-logo-text { font-family: var(--font-head); font-size: 1rem; font-weight: 800; color: var(--text); }
  .sidebar-btn {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 10px; border: none;
    background: none; color: var(--text2); font-family: var(--font-body);
    font-size: 0.9rem; font-weight: 500; cursor: pointer; width: 100%; text-align: left;
    transition: all 0.2s;
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

  /* Cards */
  .card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 1.75rem; }
  .card + .card { margin-top: 1.25rem; }

  /* Stats Cards */
  .stats-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 2rem; }
  .stat-card {
    background: var(--card); border: 1px solid var(--border); border-radius: 16px;
    padding: 1.5rem; position: relative; overflow: hidden;
  }
  .stat-card::after {
    content: ''; position: absolute; bottom: 0; right: 0;
    width: 80px; height: 80px; border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,255,0.08), transparent);
  }
  .stat-card-num { font-family: var(--font-head); font-size: 2rem; font-weight: 800; color: var(--primary); }
  .stat-card-label { font-size: 0.82rem; color: var(--text3); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px; }

  /* Table */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; font-size: 0.75rem; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: 0.1em; padding: 10px 16px; border-bottom: 1px solid var(--border); }
  td { padding: 14px 16px; border-bottom: 1px solid rgba(99,179,237,0.06); font-size: 0.9rem; vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(99,179,237,0.03); }

  /* Application detail */
  .app-detail { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem; }
  .app-detail-item label { font-size: 0.75rem; color: var(--text3); text-transform: uppercase; letter-spacing: 0.08em; }
  .app-detail-item p { color: var(--text); font-size: 0.9rem; margin-top: 2px; }

  /* Divider */
  .divider { height: 1px; background: var(--border); margin: 1.5rem 0; }

  /* Tab row */
  .tab-row { display: flex; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: -1px; }
  .tab-btn {
    padding: 10px 20px; background: none; border: none; cursor: pointer;
    font-family: var(--font-body); font-size: 0.9rem; font-weight: 500;
    color: var(--text2); transition: all 0.2s; position: relative;
    border-bottom: 2px solid transparent; margin-bottom: -1px;
  }
  .tab-btn:hover { color: var(--text); }
  .tab-btn.active { color: var(--primary); border-bottom-color: var(--primary); }

  /* Job detail panel */
  .job-detail-panel {
    background: var(--card); border: 1px solid var(--border2);
    border-radius: 20px; padding: 2.5rem; margin-top: 1.5rem;
  }
  .req-list { list-style: none; margin-top: 0.75rem; }
  .req-list li { display: flex; align-items: flex-start; gap: 10px; padding: 6px 0; font-size: 0.9rem; color: var(--text2); font-weight: 300; }
  .req-list li::before { content: '→'; color: var(--primary); font-weight: 700; flex-shrink: 0; }

  /* Apply form */
  .apply-form { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
  .apply-form .full { grid-column: 1 / -1; }

  /* Footer */
  .footer { background: var(--bg2); border-top: 1px solid var(--border); padding: 3rem 2rem; text-align: center; position: relative; z-index: 1; }
  .footer-brand { font-family: var(--font-head); font-size: 1.4rem; font-weight: 800; color: var(--text); margin-bottom: 0.5rem; }
  .footer-tag { color: var(--text3); font-size: 0.85rem; font-weight: 300; }

  /* Mobile tweaks */
  @media (max-width: 768px) {
    .sidebar { display: none; }
    .main-content { margin-left: 0; padding: 1.5rem 1rem; }
    .apply-form { grid-template-columns: 1fr; }
    .apply-form .full { grid-column: 1; }
    .job-card { grid-template-columns: 1fr; }
    .job-actions { flex-direction: row; align-items: center; }
  }

  /* Animations */
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fadeUp 0.5s ease forwards; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .spin { animation: spin 1s linear infinite; }

  /* Notification */
  .notification {
    position: fixed; top: 80px; right: 20px; z-index: 300;
    padding: 14px 20px; border-radius: 12px; font-size: 0.9rem; font-weight: 500;
    display: flex; align-items: center; gap: 10px; max-width: 360px;
    animation: fadeUp 0.3s ease;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .notification.success { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); color: var(--success); }
  .notification.error { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: var(--danger); }

  .empty-state { text-align: center; padding: 4rem 2rem; color: var(--text3); }
  .empty-state p { font-size: 0.9rem; margin-top: 0.5rem; }
`;

// ─── Main App ────────────────────────────────────────────────────────────────

export default function App() {
    const [page, setPage] = useState("home"); // home | jobs | admin | user
    const [showAuth, setShowAuth] = useState(null); // null | login | register
    const [currentUser, setCurrentUser] = useState(null);
    const [notification, setNotification] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showApplyModal, setShowApplyModal] = useState(null);

    const notify = (msg, type = "success") => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3500);
    };

    const logout = () => {
        setCurrentUser(null);
        setPage("home");
        notify("You've been logged out.");
    };

    const handleLogin = (user) => {
        setCurrentUser(user);
        setShowAuth(null);
        if (user.role === "admin") setPage("admin");
        else setPage("user");
        notify(`Welcome back, ${user.name}!`);
    };

    const isAdmin = currentUser?.role === "admin";

    return (
        <>
            <style>{styles}</style>
            <div className="app">
                {notification && (
                    <div className={`notification ${notification.type}`}>
                        <Icon name={notification.type === "success" ? "check" : "x"} size={16} />
                        {notification.msg}
                    </div>
                )}

                {showAuth && (
                    <AuthModal
                        mode={showAuth}
                        onClose={() => setShowAuth(null)}
                        onLogin={handleLogin}
                        setMode={setShowAuth}
                        notify={notify}
                    />
                )}

                {showApplyModal && (
                    <ApplyModal
                        job={showApplyModal}
                        user={currentUser}
                        onClose={() => setShowApplyModal(null)}
                        notify={notify}
                    />
                )}

                {/* Public pages */}
                {!currentUser && (
                    <>
                        <Navbar
                            currentUser={currentUser}
                            page={page}
                            setPage={setPage}
                            setShowAuth={setShowAuth}
                            logout={logout}
                        />
                        {page === "home" && <HomePage setPage={setPage} setShowAuth={setShowAuth} />}
                        {page === "jobs" && (
                            <JobsPage
                                currentUser={currentUser}
                                setShowAuth={setShowAuth}
                                setShowApplyModal={setShowApplyModal}
                                selectedJob={selectedJob}
                                setSelectedJob={setSelectedJob}
                            />
                        )}
                    </>
                )}

                {/* Logged in user */}
                {currentUser && !isAdmin && (
                    <UserDashboard
                        user={currentUser}
                        logout={logout}
                        setShowApplyModal={setShowApplyModal}
                        notify={notify}
                    />
                )}

                {/* Admin */}
                {currentUser && isAdmin && (
                    <AdminDashboard user={currentUser} logout={logout} notify={notify} />
                )}
            </div>
        </>
    );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar({ currentUser, page, setPage, setShowAuth, logout }) {
    return (
        <nav className="nav">
            <div className="nav-logo" onClick={() => setPage("home")}>
                <Icon name="quantum" size={32} color="#00d4ff" />
                <span className="nav-logo-text">Quantum Logics</span>
            </div>
            <div className="nav-links">
                <button className={`nav-btn ${page === "home" ? "active" : ""}`} onClick={() => setPage("home")}>Home</button>
                <button className={`nav-btn ${page === "jobs" ? "active" : ""}`} onClick={() => setPage("jobs")}>Careers</button>
                {!currentUser ? (
                    <>
                        <button className="nav-btn" onClick={() => setShowAuth("login")}>Sign In</button>
                        <button className="nav-btn primary" onClick={() => setShowAuth("register")}>Get Started</button>
                    </>
                ) : (
                    <button className="nav-btn" onClick={logout}>Sign Out</button>
                )}
            </div>
        </nav>
    );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

function HomePage({ setPage, setShowAuth }) {
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
            {/* Hero */}
            <section className="hero">
                <div className="hero-grid" />
                <div className="hero-glow" />
                <div className="hero-glow2" />
                <div className="hero-content fade-up">
                    <div className="hero-badge">
                        <Icon name="quantum" size={14} color="#00d4ff" />
                        Quantum Logics — Est. 2019
                    </div>
                    <h1 className="hero-title">
                        Engineering the <span>Future</span>,<br />
                        One Commit at a Time.
                    </h1>
                    <p className="hero-sub">
                        We're a software house that blends relentless hard work, deep technical expertise, and
                        seamless teamwork to build products that scale, inspire, and endure.
                    </p>
                    <div className="hero-ctas">
                        <button className="btn btn-primary" onClick={() => setPage("jobs")}>
                            Join Our Team <Icon name="arrow" size={16} />
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

            {/* Values */}
            <section className="section" style={{ background: "var(--bg2)" }}>
                <div className="section-inner">
                    <span className="section-label">Our Core Values</span>
                    <h2 className="section-title">Built on Principles.<br />Driven by Purpose.</h2>
                    <p className="section-sub">Every team member at Quantum Logics lives by these values — they're not just words on a wall, they're the engine of everything we build.</p>
                    <div className="values-grid">
                        {values.map((v, i) => (
                            <div className="value-card" key={i}>
                                <div className="value-icon" style={{ background: v.color }}>{v.icon}</div>
                                <h3>{v.title}</h3>
                                <p>{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="section">
                <div className="section-inner">
                    <span className="section-label">Leadership</span>
                    <h2 className="section-title">The Minds Behind Quantum</h2>
                    <p className="section-sub">A team of passionate engineers, designers, and strategists committed to building what matters.</p>
                    <div className="team-grid">
                        {team.map((t, i) => (
                            <div className="team-card" key={i}>
                                <div className="team-avatar">{t.init}</div>
                                <div className="team-name">{t.name}</div>
                                <div className="team-role">{t.role}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section" style={{ background: "var(--bg2)" }}>
                <div className="section-inner" style={{ textAlign: "center" }}>
                    <span className="section-label">Join the Team</span>
                    <h2 className="section-title">Ready to Build Something<br />Extraordinary?</h2>
                    <p className="section-sub" style={{ margin: "0 auto 2rem" }}>
                        We're always looking for talented, driven people to join our growing team. Apply for an open role or create an account to get started.
                    </p>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <button className="btn btn-primary" onClick={() => setPage("jobs")}>View Open Roles <Icon name="arrow" size={16} /></button>
                        <button className="btn btn-outline" onClick={() => setShowAuth("register")}>Create Account</button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-brand">Quantum Logics</div>
                <p className="footer-tag">© 2025 Quantum Logics. Built with hard work, teamwork & dedication.</p>
            </footer>
        </>
    );
}

// ─── Jobs Page (Public) ───────────────────────────────────────────────────────

function JobsPage({ currentUser, setShowAuth, setShowApplyModal, selectedJob, setSelectedJob }) {
    const [jobs, setJobs] = useState([]);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        setJobs(getJobs().filter((j) => j.active));
    }, []);

    const depts = ["All", ...new Set(jobs.map((j) => j.department))];
    const filtered = filter === "All" ? jobs : jobs.filter((j) => j.department === filter);

    return (
        <>
            <div style={{ paddingTop: "68px" }}>
                <section className="section">
                    <div className="section-inner">
                        <span className="section-label">Open Positions</span>
                        <h2 className="section-title">Build Your Career at Quantum</h2>
                        <p className="section-sub">We hire for talent, drive, and values. Find your perfect role below.</p>

                        {/* Filter */}
                        <div className="tab-row" style={{ marginTop: "2rem" }}>
                            {depts.map((d) => (
                                <button key={d} className={`tab-btn ${filter === d ? "active" : ""}`} onClick={() => setFilter(d)}>{d}</button>
                            ))}
                        </div>

                        <div className="jobs-grid">
                            {filtered.map((job) => (
                                <div key={job.id} className="job-card" onClick={() => setSelectedJob(job.id === selectedJob ? null : job.id)}>
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

                        {/* Selected job detail */}
                        {selectedJob && (() => {
                            const job = jobs.find((j) => j.id === selectedJob);
                            if (!job) return null;
                            return (
                                <div className="job-detail-panel fade-up">
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                                        <div>
                                            <div className="job-dept">{job.department}</div>
                                            <h2 style={{ fontFamily: "var(--font-head)", fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>{job.title}</h2>
                                            <div className="job-meta">
                                                <span className="job-tag"><Icon name="location" size={13} />{job.location}</span>
                                                <span className="job-tag"><Icon name="clock" size={13} />{job.type}</span>
                                                <span className="job-tag"><Icon name="dollar" size={13} />{job.salary}</span>
                                            </div>
                                        </div>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => {
                                                if (!currentUser) { setShowAuth("login"); return; }
                                                setShowApplyModal(job);
                                            }}
                                        >
                                            Apply for this Role <Icon name="arrow" size={16} />
                                        </button>
                                    </div>
                                    <div className="divider" />
                                    <p style={{ color: "var(--text2)", lineHeight: 1.8, fontWeight: 300 }}>{job.description}</p>
                                    <h4 style={{ fontFamily: "var(--font-head)", marginTop: "1.5rem", marginBottom: "0.25rem" }}>Requirements</h4>
                                    <ul className="req-list">
                                        {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
                                    </ul>
                                    {!currentUser && (
                                        <div style={{ marginTop: "1.5rem", padding: "1rem 1.25rem", background: "rgba(0,212,255,0.06)", border: "1px solid var(--border2)", borderRadius: 10, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                                            <span style={{ color: "var(--text2)", fontSize: "0.88rem" }}>Sign in or create an account to apply for this role.</span>
                                            <button className="btn btn-primary btn-sm" onClick={() => setShowAuth("register")}>Get Started</button>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                        {filtered.length === 0 && (
                            <div className="empty-state">
                                <Icon name="briefcase" size={40} color="var(--text3)" />
                                <p>No open positions in this department right now. Check back soon!</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
            <footer className="footer">
                <div className="footer-brand">Quantum Logics</div>
                <p className="footer-tag">© 2025 Quantum Logics. Built with hard work, teamwork & dedication.</p>
            </footer>
        </>
    );
}

// ─── Auth Modal ───────────────────────────────────────────────────────────────

function AuthModal({ mode, onClose, onLogin, setMode, notify }) {
    const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = () => {
        setError("");
        if (mode === "register") {
            if (!form.name || !form.email || !form.password) return setError("All fields are required.");
            if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
            if (form.password.length < 6) return setError("Password must be at least 6 characters.");
            const users = getUsers();
            if (users.find((u) => u.email === form.email)) return setError("Email already registered.");
            const newUser = { id: `user_${Date.now()}`, name: form.name, email: form.email, password: form.password, role: "user", createdAt: new Date().toISOString() };
            saveUsers([...users, newUser]);
            onLogin(newUser);
        } else {
            if (!form.email || !form.password) return setError("Email and password required.");
            const users = getUsers();
            const user = users.find((u) => u.email === form.email && u.password === form.password);
            if (!user) return setError("Invalid email or password.");
            onLogin(user);
        }
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal fade-up">
                <button className="modal-close" onClick={onClose}><Icon name="x" size={16} /></button>
                <div className="modal-title">{mode === "login" ? "Welcome back" : "Create your account"}</div>
                <p className="modal-sub">{mode === "login" ? "Sign in to manage your applications." : "Join Quantum Logics and start your journey."}</p>

                {mode === "register" && (
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input className="form-input" placeholder="Your name" value={form.name} onChange={set("name")} />
                    </div>
                )}
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
                </div>
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={set("password")} />
                </div>
                {mode === "register" && (
                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input className="form-input" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={set("confirmPassword")} />
                    </div>
                )}
                {error && <div className="form-error" style={{ marginBottom: "1rem" }}>{error}</div>}
                <button className="btn btn-primary" style={{ width: "100%" }} onClick={submit}>
                    {mode === "login" ? "Sign In" : "Create Account"}
                </button>
                <div style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.85rem", color: "var(--text2)" }}>
                    {mode === "login" ? (
                        <>Don't have an account? <button style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", fontWeight: 600 }} onClick={() => setMode("register")}>Sign up</button></>
                    ) : (
                        <>Already have an account? <button style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", fontWeight: 600 }} onClick={() => setMode("login")}>Sign in</button></>
                    )}
                </div>
                <div className="divider" />
                <p style={{ fontSize: "0.78rem", color: "var(--text3)", textAlign: "center" }}>Admin demo: admin@quantumlogics.io / admin123</p>
            </div>
        </div>
    );
}

// ─── Apply Modal ──────────────────────────────────────────────────────────────

function ApplyModal({ job, user, onClose, notify }) {
    const [form, setForm] = useState({ phone: "", experience: "", linkedin: "", portfolio: "", coverLetter: "" });
    const [submitted, setSubmitted] = useState(false);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const apply = () => {
        const apps = getApplications();
        const already = apps.find((a) => a.jobId === job.id && a.userId === user.id);
        if (already) { notify("You've already applied for this role.", "error"); onClose(); return; }
        const app = {
            id: `app_${Date.now()}`,
            jobId: job.id,
            jobTitle: job.title,
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            ...form,
            status: "pending",
            appliedAt: new Date().toISOString(),
        };
        saveApplications([...apps, app]);
        setSubmitted(true);
        notify("Application submitted successfully!");
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal fade-up" style={{ maxWidth: 580 }}>
                <button className="modal-close" onClick={onClose}><Icon name="x" size={16} /></button>
                {submitted ? (
                    <div style={{ textAlign: "center", padding: "2rem 0" }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                            <Icon name="check" size={28} color="#10b981" />
                        </div>
                        <h2 style={{ fontFamily: "var(--font-head)", fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.5rem" }}>Application Sent!</h2>
                        <p style={{ color: "var(--text2)", fontSize: "0.9rem", fontWeight: 300 }}>We've received your application for <strong style={{ color: "var(--text)" }}>{job.title}</strong>. Our team will review it and get back to you soon.</p>
                        <button className="btn btn-primary" style={{ marginTop: "1.5rem" }} onClick={onClose}>Done</button>
                    </div>
                ) : (
                    <>
                        <div className="modal-title">Apply: {job.title}</div>
                        <p className="modal-sub">{job.department} · {job.location}</p>
                        <div className="apply-form">
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input className="form-input" value={user.name} disabled />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input className="form-input" value={user.email} disabled />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input className="form-input" placeholder="+92 300 0000000" value={form.phone} onChange={set("phone")} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Years of Experience</label>
                                <select className="form-select" value={form.experience} onChange={set("experience")}>
                                    <option value="">Select</option>
                                    <option>0-1 years</option><option>1-3 years</option><option>3-5 years</option><option>5+ years</option>
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
                                <textarea className="form-textarea" style={{ minHeight: 120 }} placeholder="Tell us why you'd be a great fit at Quantum Logics..." value={form.coverLetter} onChange={set("coverLetter")} />
                            </div>
                        </div>
                        <button className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }} onClick={apply}>
                            Submit Application <Icon name="arrow" size={16} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

// ─── User Dashboard ───────────────────────────────────────────────────────────

function UserDashboard({ user, logout, setShowApplyModal, notify }) {
    const [tab, setTab] = useState("jobs");
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        setJobs(getJobs().filter((j) => j.active));
        setApplications(getApplications().filter((a) => a.userId === user.id));
    }, []);

    const refreshApps = () => setApplications(getApplications().filter((a) => a.userId === user.id));

    const statusColor = { pending: "badge-blue", reviewed: "badge-orange", accepted: "badge-green", rejected: "badge-gray" };

    return (
        <div className="dashboard">
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
            <main className="main-content">
                {tab === "jobs" && (
                    <>
                        <div className="page-header">
                            <h1>Open Positions</h1>
                            <p>Browse and apply for available roles at Quantum Logics.</p>
                        </div>
                        <div className="jobs-grid">
                            {jobs.map((job) => {
                                const applied = getApplications().find((a) => a.jobId === job.id && a.userId === user.id);
                                return (
                                    <div key={job.id} className="job-card">
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
                                            {applied ? (
                                                <span className="badge badge-blue">Applied</span>
                                            ) : (
                                                <button className="btn btn-primary btn-sm" onClick={() => { setShowApplyModal(job); }}>Apply</button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {jobs.length === 0 && <div className="empty-state"><Icon name="briefcase" size={36} color="var(--text3)" /><p>No open positions right now.</p></div>}
                        </div>
                    </>
                )}

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
                                <button className="btn btn-primary btn-sm" style={{ marginTop: "1rem" }} onClick={() => setTab("jobs")}>Browse Open Roles</button>
                            </div>
                        ) : (
                            <div className="card">
                                <div className="table-wrap">
                                    <table>
                                        <thead><tr><th>Position</th><th>Applied</th><th>Status</th></tr></thead>
                                        <tbody>
                                            {applications.map((a) => (
                                                <tr key={a.id}>
                                                    <td><strong>{a.jobTitle}</strong></td>
                                                    <td style={{ color: "var(--text2)" }}>{new Date(a.appliedAt).toLocaleDateString()}</td>
                                                    <td><span className={`badge ${statusColor[a.status] || "badge-gray"}`}>{a.status.charAt(0).toUpperCase() + a.status.slice(1)}</span></td>
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

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

function AdminDashboard({ user, logout, notify }) {
    const [tab, setTab] = useState("overview");
    const [jobs, setJobs] = useState(getJobs());
    const [applications, setApplications] = useState(getApplications());
    const [users, setUsers] = useState(getUsers().filter((u) => u.role !== "admin"));
    const [showJobForm, setShowJobForm] = useState(false);
    const [editJob, setEditJob] = useState(null);

    const refresh = () => {
        setJobs(getJobs());
        setApplications(getApplications());
        setUsers(getUsers().filter((u) => u.role !== "admin"));
    };

    const deleteJob = (id) => {
        const updated = jobs.filter((j) => j.id !== id);
        saveJobs(updated);
        setJobs(updated);
        notify("Job deleted.");
    };

    const toggleJobStatus = (id) => {
        const updated = jobs.map((j) => j.id === id ? { ...j, active: !j.active } : j);
        saveJobs(updated);
        setJobs(updated);
        notify("Job status updated.");
    };

    const updateAppStatus = (appId, status) => {
        const updated = applications.map((a) => a.id === appId ? { ...a, status } : a);
        saveApplications(updated);
        setApplications(updated);
        notify(`Application marked as ${status}.`);
    };

    const statusColor = { pending: "badge-blue", reviewed: "badge-orange", accepted: "badge-green", rejected: "badge-gray" };

    return (
        <div className="dashboard">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <Icon name="quantum" size={28} color="#00d4ff" />
                    <span className="sidebar-logo-text">Quantum Logics</span>
                </div>
                <button className={`sidebar-btn ${tab === "overview" ? "active" : ""}`} onClick={() => { setTab("overview"); refresh(); }}>
                    <Icon name="home" size={18} /> Overview
                </button>
                <button className={`sidebar-btn ${tab === "jobs" ? "active" : ""}`} onClick={() => setTab("jobs")}>
                    <Icon name="briefcase" size={18} /> Manage Jobs
                </button>
                <button className={`sidebar-btn ${tab === "applications" ? "active" : ""}`} onClick={() => { setTab("applications"); refresh(); }}>
                    <Icon name="eye" size={18} /> Applications
                    {applications.filter((a) => a.status === "pending").length > 0 && (
                        <span className="badge badge-orange" style={{ marginLeft: "auto" }}>{applications.filter((a) => a.status === "pending").length}</span>
                    )}
                </button>
                <button className={`sidebar-btn ${tab === "users" ? "active" : ""}`} onClick={() => { setTab("users"); refresh(); }}>
                    <Icon name="users" size={18} /> Users
                </button>
                <div className="sidebar-footer">
                    <div className="sidebar-user"><strong>Admin</strong>{user.email}</div>
                    <button className="sidebar-btn" onClick={logout}><Icon name="logout" size={18} /> Sign Out</button>
                </div>
            </aside>

            <main className="main-content">
                {/* Overview */}
                {tab === "overview" && (
                    <>
                        <div className="page-header">
                            <h1>Admin Overview</h1>
                            <p>A high-level look at Quantum Logics' hiring activity.</p>
                        </div>
                        <div className="stats-cards">
                            <div className="stat-card"><div className="stat-card-num">{jobs.filter((j) => j.active).length}</div><div className="stat-card-label">Active Jobs</div></div>
                            <div className="stat-card"><div className="stat-card-num" style={{ color: "var(--accent)" }}>{applications.length}</div><div className="stat-card-label">Total Applications</div></div>
                            <div className="stat-card"><div className="stat-card-num" style={{ color: "var(--warning)" }}>{applications.filter((a) => a.status === "pending").length}</div><div className="stat-card-label">Pending Review</div></div>
                            <div className="stat-card"><div className="stat-card-num" style={{ color: "var(--success)" }}>{users.length}</div><div className="stat-card-label">Registered Users</div></div>
                        </div>
                        <div className="card">
                            <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, marginBottom: "1rem" }}>Recent Applications</h3>
                            {applications.length === 0 ? (
                                <div className="empty-state"><p>No applications yet.</p></div>
                            ) : (
                                <div className="table-wrap">
                                    <table>
                                        <thead><tr><th>Applicant</th><th>Position</th><th>Date</th><th>Status</th></tr></thead>
                                        <tbody>
                                            {applications.slice(-5).reverse().map((a) => (
                                                <tr key={a.id}>
                                                    <td><strong>{a.userName}</strong><div style={{ fontSize: "0.8rem", color: "var(--text3)" }}>{a.userEmail}</div></td>
                                                    <td>{a.jobTitle}</td>
                                                    <td style={{ color: "var(--text2)" }}>{new Date(a.appliedAt).toLocaleDateString()}</td>
                                                    <td><span className={`badge ${statusColor[a.status] || "badge-gray"}`}>{a.status}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Manage Jobs */}
                {tab === "jobs" && (
                    <>
                        <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                            <div><h1>Manage Jobs</h1><p>Create, edit, and manage job postings.</p></div>
                            <button className="btn btn-primary" onClick={() => { setEditJob(null); setShowJobForm(true); }}>
                                <Icon name="plus" size={16} /> Create Job
                            </button>
                        </div>

                        {showJobForm && (
                            <JobForm
                                initial={editJob}
                                onSave={(job) => {
                                    let updated;
                                    if (editJob) updated = jobs.map((j) => j.id === job.id ? job : j);
                                    else updated = [job, ...jobs];
                                    saveJobs(updated);
                                    setJobs(updated);
                                    setShowJobForm(false);
                                    setEditJob(null);
                                    notify(editJob ? "Job updated!" : "Job created!");
                                }}
                                onCancel={() => { setShowJobForm(false); setEditJob(null); }}
                            />
                        )}

                        <div className="jobs-grid" style={{ marginTop: "1.5rem" }}>
                            {jobs.map((job) => (
                                <div key={job.id} className="job-card" style={{ cursor: "default" }}>
                                    <div>
                                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.4rem" }}>
                                            <span className="job-dept" style={{ marginBottom: 0 }}>{job.department}</span>
                                            <span className={`badge ${job.active ? "badge-green" : "badge-gray"}`} style={{ fontSize: "0.7rem" }}>{job.active ? "Active" : "Paused"}</span>
                                        </div>
                                        <div className="job-title">{job.title}</div>
                                        <div className="job-meta">
                                            <span className="job-tag"><Icon name="location" size={13} />{job.location}</span>
                                            <span className="job-tag"><Icon name="clock" size={13} />{job.type}</span>
                                            <span className="job-tag"><Icon name="users" size={13} />{applications.filter((a) => a.jobId === job.id).length} applicants</span>
                                        </div>
                                    </div>
                                    <div className="job-actions">
                                        <button className="btn btn-ghost btn-sm" onClick={() => toggleJobStatus(job.id)}>
                                            {job.active ? "Pause" : "Activate"}
                                        </button>
                                        <button className="btn btn-ghost btn-sm" onClick={() => { setEditJob(job); setShowJobForm(true); window.scrollTo(0, 0); }}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => deleteJob(job.id)}><Icon name="trash" size={13} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Applications */}
                {tab === "applications" && (
                    <>
                        <div className="page-header">
                            <h1>All Applications</h1>
                            <p>Review and manage incoming job applications.</p>
                        </div>
                        {applications.length === 0 ? (
                            <div className="card empty-state"><Icon name="briefcase" size={40} color="var(--text3)" /><p>No applications yet.</p></div>
                        ) : (
                            <div className="card">
                                <div className="table-wrap">
                                    <table>
                                        <thead><tr><th>Applicant</th><th>Position</th><th>Experience</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
                                        <tbody>
                                            {applications.map((a) => (
                                                <tr key={a.id}>
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
                                                            onChange={(e) => updateAppStatus(a.id, e.target.value)}
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
                            </div>
                        )}
                    </>
                )}

                {/* Users */}
                {tab === "users" && (
                    <>
                        <div className="page-header">
                            <h1>Registered Users</h1>
                            <p>All accounts created on the Quantum Logics platform.</p>
                        </div>
                        {users.length === 0 ? (
                            <div className="card empty-state"><Icon name="users" size={40} color="var(--text3)" /><p>No users registered yet.</p></div>
                        ) : (
                            <div className="card">
                                <div className="table-wrap">
                                    <table>
                                        <thead><tr><th>Name</th><th>Email</th><th>Joined</th><th>Applications</th></tr></thead>
                                        <tbody>
                                            {users.map((u) => (
                                                <tr key={u.id}>
                                                    <td><strong>{u.name}</strong></td>
                                                    <td style={{ color: "var(--text2)" }}>{u.email}</td>
                                                    <td style={{ color: "var(--text2)" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                                                    <td><span className="badge badge-blue">{applications.filter((a) => a.userId === u.id).length}</span></td>
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

// ─── Job Form ─────────────────────────────────────────────────────────────────

function JobForm({ initial, onSave, onCancel }) {
    const blank = { title: "", department: "Engineering", location: "", type: "Full-time", salary: "", description: "", requirements: [""], active: true };
    const [form, setForm] = useState(initial ? { ...initial, requirements: [...initial.requirements] } : blank);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
    const setReq = (i, val) => setForm((f) => { const r = [...f.requirements]; r[i] = val; return { ...f, requirements: r }; });
    const addReq = () => setForm((f) => ({ ...f, requirements: [...f.requirements, ""] }));
    const removeReq = (i) => setForm((f) => ({ ...f, requirements: f.requirements.filter((_, j) => j !== i) }));

    const save = () => {
        const job = {
            ...form,
            id: initial?.id || `job_${Date.now()}`,
            requirements: form.requirements.filter(Boolean),
            postedAt: initial?.postedAt || new Date().toISOString(),
        };
        onSave(job);
    };

    return (
        <div className="card" style={{ borderColor: "var(--border2)" }}>
            <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, marginBottom: "1.5rem" }}>{initial ? "Edit Job" : "Create New Job"}</h3>
            <div className="apply-form">
                <div className="form-group">
                    <label className="form-label">Job Title</label>
                    <input className="form-input" placeholder="e.g. Senior React Developer" value={form.title} onChange={set("title")} />
                </div>
                <div className="form-group">
                    <label className="form-label">Department</label>
                    <select className="form-select" value={form.department} onChange={set("department")}>
                        <option>Engineering</option><option>Design</option><option>Infrastructure</option>
                        <option>Product</option><option>Marketing</option><option>Operations</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Location</label>
                    <input className="form-input" placeholder="e.g. Lahore / Remote" value={form.location} onChange={set("location")} />
                </div>
                <div className="form-group">
                    <label className="form-label">Job Type</label>
                    <select className="form-select" value={form.type} onChange={set("type")}>
                        <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Remote</option>
                    </select>
                </div>
                <div className="form-group full">
                    <label className="form-label">Salary Range</label>
                    <input className="form-input" placeholder="e.g. $2,000 – $4,000/mo" value={form.salary} onChange={set("salary")} />
                </div>
                <div className="form-group full">
                    <label className="form-label">Job Description</label>
                    <textarea className="form-textarea" placeholder="Describe the role, responsibilities, and ideal candidate..." value={form.description} onChange={set("description")} />
                </div>
                <div className="form-group full">
                    <label className="form-label">Requirements</label>
                    {form.requirements.map((r, i) => (
                        <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                            <input className="form-input" placeholder={`Requirement ${i + 1}`} value={r} onChange={(e) => setReq(i, e.target.value)} />
                            {form.requirements.length > 1 && (
                                <button className="btn btn-ghost btn-sm" onClick={() => removeReq(i)} style={{ flexShrink: 0 }}><Icon name="x" size={14} /></button>
                            )}
                        </div>
                    ))}
                    <button className="btn btn-ghost btn-sm" onClick={addReq} style={{ marginTop: "4px" }}>
                        <Icon name="plus" size={14} /> Add Requirement
                    </button>
                </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button className="btn btn-primary" onClick={save}>{initial ? "Update Job" : "Create Job"}</button>
                <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
}