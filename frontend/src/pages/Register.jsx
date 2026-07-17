import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (authLoading) return <div className="container" style={{ padding: "3rem" }}>Loading…</div>;
  if (user) return <Navigate to="/dashboard" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setSubmitting(true);
    try {
      await register({ username, email, password, password_confirm: passwordConfirm });
      navigate("/login");
    } catch (ex) {
      const d = ex.response?.data;
      if (typeof d === "object" && d !== null) {
        setErr(Object.entries(d).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join(" · "));
      } else setErr("Registration failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ padding: "3rem 0 5rem" }}>
      <div className="container" style={{ maxWidth: 420 }}>
        <h1 style={{ marginTop: 0 }}>Create account</h1>
        <p className="muted">New accounts are created as regular users.</p>

        <form onSubmit={onSubmit} className="surface" style={{ padding: "1.75rem", marginTop: "1.5rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label className="label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div style={{ marginBottom: "1.25rem" }}>
            <label className="label" htmlFor="password2">
              Confirm password
            </label>
            <input
              id="password2"
              type="password"
              className="input"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
          </div>
          {err && (
            <p style={{ color: "#f87171", fontSize: "0.9rem" }} role="alert">
              {err}
            </p>
          )}
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={submitting}>
            {submitting ? "Creating…" : "Register"}
          </button>
          <p className="muted" style={{ marginTop: "1rem", textAlign: "center", marginBottom: 0 }}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
