import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css';

// ─── Pages & Components ────────────────────────────────────────────────────────
import HomePage from "./components/HomePage";
import JobsPage from "./components/JobsPage";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import ApplyModal from "./components/ApplyModal";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from './utils/ScrollToTop';
import Icon from "./components/Icon";

// ─── Styles ────────────────────────────────────────────────────────────────────
import { globalStyles } from "./styles/globals";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuth, setShowAuth] = useState(null);    // null | "login" | "register"
  const [notification, setNotification] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Restore session & Inject Styles ──────────────────────────────────────────
  useEffect(() => {
    // Inject styles once on mount to prevent flickering
    const styleTag = document.getElementById("quantum-global-styles") || document.createElement("style");
    styleTag.id = "quantum-global-styles";
    styleTag.innerHTML = globalStyles;
    if (!document.getElementById("quantum-global-styles")) document.head.appendChild(styleTag);

    const storedUser = localStorage.getItem("ql_user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("ql_user");
        localStorage.removeItem("ql_token");
      }
    }

    // Simulate slight delay for smooth entry if needed, but here we just set loading false
    setTimeout(() => setLoading(false), 200);
  }, []);

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleLogin = (user, token) => {
    localStorage.setItem("ql_token", token);
    localStorage.setItem("ql_user", JSON.stringify(user));
    setCurrentUser(user);
    setShowAuth(null);
    notify(`Welcome back, ${user.name}!`);
  };

  const handleLogout = () => {
    localStorage.removeItem("ql_token");
    localStorage.removeItem("ql_user");
    setCurrentUser(null);
    notify("You've been logged out.");
  };

  if (loading) {
    return (
      <div style={{ background: "#0a0f1e", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="quantum" size={64} color="#00d4ff" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />

      <div className="app">
        {/* ── Toasts ───────────────────────────────────── */}
        {notification && (
          <div className={`notification ${notification.type}`}>
            <Icon name={notification.type === "success" ? "check" : "x"} size={16} />
            {notification.msg}
          </div>
        )}

        {/* ── Modals ───────────────────────────────────── */}
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

        <Routes>
          {/* Public Routes with Navbar */}
          <Route path="/" element={
            <>
              <Navbar currentUser={currentUser} setShowAuth={setShowAuth} logout={handleLogout} />
              <HomePage setShowAuth={setShowAuth} />
            </>
          } />

          <Route path="/jobs" element={
            <>
              <Navbar currentUser={currentUser} setShowAuth={setShowAuth} logout={handleLogout} />
              <JobsPage
                currentUser={currentUser}
                setShowAuth={setShowAuth}
                setShowApplyModal={setShowApplyModal}
              />
            </>
          } />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute user={currentUser}>
              {currentUser?.role === "admin" ? (
                <Navigate to="/admin-panel" replace />
              ) : (
                <UserDashboard
                  user={currentUser}
                  logout={handleLogout}
                  setShowApplyModal={setShowApplyModal}
                  notify={notify}
                />
              )}
            </ProtectedRoute>
          } />

          <Route path="/admin-panel" element={
            <ProtectedRoute user={currentUser} adminOnly>
              <AdminDashboard
                user={currentUser}
                logout={handleLogout}
                notify={notify}
              />
            </ProtectedRoute>
          } />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;