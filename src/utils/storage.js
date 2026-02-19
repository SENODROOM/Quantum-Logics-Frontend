// ─── Storage Keys ─────────────────────────────────────────────────────────────
export const STORAGE_KEY_USERS = "ql_users";
export const STORAGE_KEY_JOBS = "ql_jobs";
export const STORAGE_KEY_APPS = "ql_applications";

// ─── Default Data ──────────────────────────────────────────────────────────────
export const defaultAdmin = {
  id: "admin_0",
  name: "Admin",
  email: "admin@quantumlogics.io",
  password: "admin123",
  role: "admin",
  createdAt: new Date().toISOString(),
};

export const defaultJobs = [
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

// ─── CRUD Helpers ─────────────────────────────────────────────────────────────
export function getUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    const users = raw ? JSON.parse(raw) : [];
    if (!users.find((u) => u.role === "admin")) users.unshift(defaultAdmin);
    return users;
  } catch {
    return [defaultAdmin];
  }
}

export function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
}

export function getJobs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_JOBS);
    return raw ? JSON.parse(raw) : defaultJobs;
  } catch {
    return defaultJobs;
  }
}

export function saveJobs(jobs) {
  localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(jobs));
}

export function getApplications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_APPS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveApplications(apps) {
  localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(apps));
}
