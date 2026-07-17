import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const [b, p] = await Promise.all([api.get("/bookings/"), isAdmin ? api.get("/packages/") : Promise.resolve({ data: [] })]);
      setBookings(Array.isArray(b.data) ? b.data : b.data.results || []);
      setPackages(Array.isArray(p.data) ? p.data : p.data.results || []);
    } catch (e) {
      setErr(e.response?.data?.detail || "Could not load dashboard.");
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateBookingStatus(id, status) {
    try {
      await api.patch(`/bookings/${id}/status/`, { status });
      await load();
    } catch (e) {
      setErr(e.response?.data?.detail || "Update failed.");
    }
  }

  async function deletePackage(id) {
    if (!window.confirm("Delete this package?")) return;
    try {
      await api.delete(`/packages/${id}/`);
      await load();
    } catch (e) {
      setErr(e.response?.data?.detail || "Delete failed.");
    }
  }

  return (
    <main style={{ padding: "2.5rem 0 4rem" }}>
      <div className="container">
        <h1 style={{ marginTop: 0 }}>Dashboard</h1>
        <p className="muted">
          {isAdmin ? "Manage packages and bookings." : "Your booking history."}
        </p>

        {loading && <p className="muted">Loading…</p>}
        {err && (
          <p style={{ color: "#f87171" }} role="alert">
            {err}
          </p>
        )}

        {isAdmin && !loading && <AdminPackageForm onCreated={load} />}

        <section style={{ marginTop: "2rem" }}>
          <h2 style={{ fontSize: "1.35rem" }}>Bookings</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: "0.75rem 0" }}>ID</th>
                  {isAdmin && <th>User</th>}
                  <th>Package</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Pay status</th>
                  <th>Amount</th>
                  <th>Method</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "0.6rem 0" }}>{b.id}</td>
                    {isAdmin && <td>{b.user_username}</td>}
                    <td>{b.package_detail?.title || b.package}</td>
                    <td className="muted" style={{ fontSize: "0.9rem" }}>
                      {new Date(b.booking_date).toLocaleString()}
                    </td>
                    <td>
                      {isAdmin ? (
                        <select
                          className="input"
                          style={{ padding: "0.35rem 0.5rem", fontSize: "0.85rem", maxWidth: 140 }}
                          value={b.status}
                          onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                        >
                          <option value="pending">pending</option>
                          <option value="confirmed">confirmed</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      ) : (
                        b.status
                      )}
                    </td>
                    <td className="muted" style={{ fontSize: "0.9rem" }}>
                      {b.payment?.status || "—"}
                    </td>
                    <td style={{ fontSize: "0.9rem" }}>
                      {b.payment?.amount != null ? `$${Number(b.payment.amount).toFixed(2)}` : "—"}
                    </td>
                    <td className="muted" style={{ fontSize: "0.9rem", textTransform: "capitalize" }}>
                      {b.payment?.method?.replace("_", " ") || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && bookings.length === 0 && <p className="muted">No bookings yet.</p>}
        </section>

        {isAdmin && !loading && (
          <section style={{ marginTop: "2.5rem" }}>
            <h2 style={{ fontSize: "1.35rem" }}>Packages</h2>
            <div className="card-grid" style={{ marginTop: "1rem" }}>
              {packages.map((p) => (
                <div key={p.id} className="surface" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <strong>{p.title}</strong>
                  <span className="muted" style={{ fontSize: "0.9rem" }}>
                    {p.location}
                  </span>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <Link to={`/packages/${p.id}`} className="btn btn-ghost" style={{ padding: "0.4rem 0.9rem", fontSize: "0.85rem" }}>
                      View
                    </Link>
                    <button type="button" className="btn btn-ghost" style={{ padding: "0.4rem 0.9rem", fontSize: "0.85rem", color: "#f87171" }} onClick={() => deletePackage(p.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function AdminPackageForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      fd.append("location", location);
      fd.append("price", price);
      fd.append("duration", duration);
      if (image) fd.append("image", image);
      await api.post("/packages/", fd);
      setTitle("");
      setDescription("");
      setLocation("");
      setPrice("");
      setDuration("");
      setImage(null);
      setMsg("Package created.");
      onCreated();
    } catch (ex) {
      const d = ex.response?.data;
      setMsg(typeof d === "object" ? JSON.stringify(d) : "Failed to create.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="surface" style={{ padding: "1.5rem", marginTop: "1.5rem" }}>
      <h2 style={{ fontSize: "1.25rem", marginTop: 0 }}>Add package (admin)</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <div>
          <label className="label">Title</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="label">Location</label>
          <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>
        <div>
          <label className="label">Price (USD)</label>
          <input className="input" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <label className="label">Duration</label>
          <input className="input" placeholder="5 days / 4 nights" value={duration} onChange={(e) => setDuration(e.target.value)} required />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label className="label">Description</label>
          <textarea className="input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label className="label">Image</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Saving…" : "Create package"}
          </button>
          {msg && <p className="muted" style={{ marginTop: "0.75rem" }}>{msg}</p>}
        </div>
      </form>
    </section>
  );
}
