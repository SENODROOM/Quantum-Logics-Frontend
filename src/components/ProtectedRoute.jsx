import { Navigate } from "react-router-dom";

/**
 * ── Protected Route ──────────────────────────────────────────────────────────
 * Wraps routes that require authentication.
 * If user is not logged in, redirects to /.
 * If adminOnly is true, also checks if user is an admin.
 */
export default function ProtectedRoute({ user, children, adminOnly = false }) {
    if (!user) {
        // If not logged in, go to home
        return <Navigate to="/" replace />;
    }

    if (adminOnly && user.role !== "admin") {
        // If admin required but user is not admin, go to their own dashboard
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
