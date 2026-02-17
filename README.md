# ⚛️ Quantum Logics — Software House Website

> *Engineering the Future, One Commit at a Time.*

A full-featured software house website for **Quantum Logics**, built as a complete full-stack MERN-style React application. It showcases the company's values of **hard work, teamwork, and dedication**, while enabling users to create accounts, browse job listings, and submit applications — all managed through a powerful admin panel.

---

## 🚀 Live Features

### 🌐 Public Website
- **Hero section** with animated quantum-themed design, particle grid, and company stats
- **Core Values** page: Hard Work, Teamwork, Dedication, Innovation, Integrity & Precision
- **Leadership Team** section featuring key personnel
- **Careers page** with filterable job listings and detailed job descriptions

### 👤 User Accounts
- **Register / Login** modal system with full validation
- Secure password matching and minimum length enforcement
- **User Dashboard** to browse open positions and track all applications
- Apply modal with a full application form: phone, experience, LinkedIn, portfolio, and cover letter
- Duplicate application prevention per user per job

### 🛠️ Admin Panel
- **Overview Dashboard** with live stats: active jobs, total applications, pending reviews, registered users
- **Create / Edit / Delete** job postings with all fields (title, department, location, type, salary, description, requirements)
- **Pause / Activate** job postings without deleting them
- **Application Manager** — review all incoming applications and update their status (Pending → Reviewed → Accepted / Rejected)
- **User Registry** — view all registered accounts and their application counts

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 (Hooks) |
| Styling | Pure CSS (custom design system with CSS variables) |
| State Management | React `useState` / `useEffect` |
| Persistence | `localStorage` (browser-based, no backend required) |
| Typography | Syne (headings) + DM Sans (body) via Google Fonts |
| Icons | Inline SVG icon system |

> **Note:** This is a self-contained single-file React component (`.jsx`) designed for rapid deployment or embedding. Data is persisted in the browser's `localStorage`, simulating a full backend without requiring a server.

---

## 🗂️ Project Structure

```
quantum-logics.jsx        # Complete application — single file
└── App                   # Root component, routing state
    ├── Navbar            # Top navigation bar
    ├── HomePage          # Landing page (Hero, Values, Team, CTA)
    ├── JobsPage          # Public careers page with filters
    ├── AuthModal         # Login / Register modal
    ├── ApplyModal        # Job application form modal
    ├── UserDashboard     # Logged-in user view
    │   ├── Open Positions tab
    │   └── My Applications tab
    └── AdminDashboard    # Admin-only view
        ├── Overview tab
        ├── Manage Jobs tab (+ JobForm)
        ├── Applications tab
        └── Users tab
```

---

## 🔑 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@quantumlogics.io` | `admin123` |
| User | *(Register a new account)* | *(Your choice)* |

> The admin account is seeded automatically on first load if no admin exists in storage.

---

## 📦 Getting Started

### Option 1 — Use as a React Artifact (Recommended)
Paste the contents of `quantum-logics.jsx` directly into the [Claude.ai](https://claude.ai) artifact renderer or any React sandbox (e.g., CodeSandbox, StackBlitz).

### Option 2 — Run Locally with Vite

**Prerequisites:** Node.js 18+

```bash
# 1. Create a new Vite + React project
npm create vite@latest quantum-logics -- --template react
cd quantum-logics

# 2. Replace src/App.jsx with the contents of quantum-logics.jsx

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Option 3 — Embed in an Existing React App

Copy `quantum-logics.jsx` into your `src/` directory and import it:

```jsx
import QuantumLogics from './quantum-logics';

function App() {
  return <QuantumLogics />;
}
```

---

## 🗄️ Data Model

All data is stored in `localStorage` under three keys:

### `ql_users`
```json
{
  "id": "user_1234567890",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "plaintext123",
  "role": "user",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### `ql_jobs`
```json
{
  "id": "job_1",
  "title": "Senior Full Stack Engineer",
  "department": "Engineering",
  "location": "Lahore, Pakistan / Remote",
  "type": "Full-time",
  "salary": "$3,000 – $5,000/mo",
  "description": "...",
  "requirements": ["5+ years React/Node.js", "..."],
  "postedAt": "2025-01-10T00:00:00.000Z",
  "active": true
}
```

### `ql_applications`
```json
{
  "id": "app_1234567890",
  "jobId": "job_1",
  "jobTitle": "Senior Full Stack Engineer",
  "userId": "user_1234567890",
  "userName": "Jane Doe",
  "userEmail": "jane@example.com",
  "phone": "+92 300 0000000",
  "experience": "3-5 years",
  "linkedin": "linkedin.com/in/janedoe",
  "portfolio": "github.com/janedoe",
  "coverLetter": "I would love to join Quantum Logics because...",
  "status": "pending",
  "appliedAt": "2025-01-25T00:00:00.000Z"
}
```

---

## 🎨 Design System

The UI uses a custom dark-tech aesthetic with full CSS variable support.

| Variable | Value | Usage |
|----------|-------|-------|
| `--bg` | `#050810` | Page background |
| `--primary` | `#00d4ff` | Cyan accent, CTAs |
| `--accent` | `#ff6b35` | Orange contrast |
| `--card` | `#0d1424` | Card backgrounds |
| `--text` | `#e8f4ff` | Primary text |
| `--text2` | `#8ba8c7` | Secondary text |

**Fonts:** Syne 800 (headings) + DM Sans 300–600 (body)

**Effects:** Animated grid background, radial glow orbs, CSS noise texture overlay, card hover lift + border highlight, staggered fade-up animations.

---

## 🔄 Application Status Flow

```
Submitted → Pending → Reviewed → Accepted
                              ↘ Rejected
```

Admins can update any application's status from the Applications tab using the inline dropdown.

---

## ⚠️ Known Limitations

- **No real authentication** — passwords are stored in plain text in `localStorage`. For production, use JWT + bcrypt with a real backend.
- **No file uploads** — the portfolio/LinkedIn fields are text-only. A production version should integrate a file upload service (e.g., AWS S3).
- **localStorage only** — data does not sync across devices or browsers. Connect to MongoDB + Express for true persistence.
- **Single admin account** — the admin role is hardcoded. A production system should support role-based access control (RBAC).

---

## 🗺️ Roadmap (Full MERN Migration)

To convert this to a production MERN stack:

- [ ] **MongoDB** — replace `localStorage` with Mongoose models (`User`, `Job`, `Application`)
- [ ] **Express.js** — REST API with routes: `POST /auth/register`, `POST /auth/login`, `GET /jobs`, `POST /jobs/:id/apply`, `PUT /applications/:id/status`
- [ ] **JWT Authentication** — secure routes with `jsonwebtoken` + `bcrypt`
- [ ] **React Router** — replace state-based navigation with proper URL routing
- [ ] **File Uploads** — integrate Multer + S3 for CV/resume uploads
- [ ] **Email Notifications** — notify applicants when their status changes (Nodemailer / SendGrid)
- [ ] **Pagination** — for jobs and applications lists
- [ ] **Search & Filters** — full-text job search with department/type/location filters

---

## 🤝 Company Values

Quantum Logics was built on these six pillars:

| Value | Description |
|-------|-------------|
| ⚡ **Hard Work** | Relentless effort and commitment to excellence in every line of code |
| 🤝 **Teamwork** | Collaboration at every level — building, solving, and growing together |
| 🎯 **Dedication** | Unwavering focus on quality and client success from start to finish |
| 🚀 **Innovation** | Challenging convention and embracing emerging technology |
| 🛡️ **Integrity** | Transparency, honesty, and accountability in every relationship |
| 📐 **Precision** | Measurable goals, rigorous tracking, and outcomes that matter |

---

## 📄 License

MIT — free to use, modify, and distribute.

---

*Built with hard work, teamwork & dedication. © 2025 Quantum Logics.*