import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";

const PAYMENT_METHODS = [
  { value: "card", label: "Credit / debit card" },
  { value: "upi", label: "UPI" },
  { value: "wallet", label: "Digital wallet" },
  { value: "simulated", label: "Simulated (demo)" },
];

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [travelers, setTravelers] = useState(1);
  const [notes, setNotes] = useState("");
  const [simulate, setSimulate] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get(`/packages/${id}/`);
        if (!cancelled) setPkg(data);
      } catch {
        if (!cancelled) setPkg(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await api.post("/bookings/", {
        package: Number(id),
        travelers,
        notes,
        simulate_payment: simulate,
        payment_method: paymentMethod,
      });
      navigate("/dashboard", { replace: true });
    } catch (ex) {
      const d = ex.response?.data;
      setErr(typeof d === "object" ? JSON.stringify(d) : d || "Booking failed.");
    } finally {
      setLoading(false);
    }
  }

  if (!pkg) return <p className="container" style={{ padding: "3rem 0" }}>Loading package…</p>;

  const total = Number(pkg.price) * travelers;

  return (
    <main style={{ padding: "2.5rem 0 4rem" }}>
      <div className="container" style={{ maxWidth: 560 }}>
        <h1 style={{ marginTop: 0 }}>Book {pkg.title}</h1>
        <p className="muted">
          {pkg.location} · {pkg.duration}
        </p>

        <form onSubmit={onSubmit} className="surface" style={{ padding: "1.75rem", marginTop: "1.5rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label className="label" htmlFor="travelers">
              Travelers
            </label>
            <input
              id="travelers"
              type="number"
              min={1}
              max={20}
              className="input"
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label className="label" htmlFor="pay-method">
              Payment method
            </label>
            <select
              id="pay-method"
              className="input"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <p className="muted" style={{ fontSize: "0.8rem", marginTop: "0.35rem", marginBottom: 0 }}>
              Amount, method, and status are stored with your booking on the server.
            </p>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label className="label" htmlFor="notes">
              Notes (optional)
            </label>
            <textarea id="notes" className="input" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", cursor: "pointer" }}>
            <input type="checkbox" checked={simulate} onChange={(e) => setSimulate(e.target.checked)} />
            <span>Complete payment now (simulated success — uncheck to leave payment pending)</span>
          </label>

          <div
            style={{
              padding: "1rem",
              borderRadius: 10,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              marginBottom: "1.25rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
              <span className="muted">Total due</span>
              <strong>Rs. {total.toFixed(2)}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }} className="muted">
              <span>Method</span>
              <span style={{ textTransform: "capitalize" }}>{paymentMethod.replace("_", " ")}</span>
            </div>
          </div>

          {err && (
            <p style={{ color: "#f87171", fontSize: "0.9rem" }} role="alert">
              {err}
            </p>
          )}

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Processing…" : "Confirm booking"}
            </button>
            <Link to={`/packages/${id}`} className="btn btn-ghost">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
