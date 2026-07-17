import { useState } from "react";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (authLoading) return <div className="container" style={{ padding: "3rem" }}>Loading…</div>;
  if (user) return <Navigate to="/dashboard" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (ex) {
      setErr(ex.response?.data?.detail || "Invalid credentials.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ padding: "3rem 0 5rem" }}>
      <div className="container" style={{ maxWidth: 420 }}>
        <h1 style={{ marginTop: 0 }}>Welcome back</h1>
        <p className="muted">Sign in with your email. Admins use the same form.</p>

        <form onSubmit={onSubmit} className="surface" style={{ padding: "1.75rem", marginTop: "1.5rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: "1.25rem" }}>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {err && (
            <p style={{ color: "#f87171", fontSize: "0.9rem" }} role="alert">
              {err}
            </p>
          )}
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
          <p className="muted" style={{ marginTop: "1rem", textAlign: "center", marginBottom: 0 }}>
            No account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
