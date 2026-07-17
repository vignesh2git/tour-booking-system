import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { getLocationImage } from "../utils/locationImages";

const placeholder =
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=900&q=80";

export default function Packages() {
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (q.trim()) p.set("search", q.trim());
    if (location.trim()) p.set("location", location.trim());
    if (ordering) p.set("ordering", ordering);
    return p.toString();
  }, [q, location, ordering]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const { data } = await api.get(`/packages/${params ? `?${params}` : ""}`);
        if (!cancelled) setItems(Array.isArray(data) ? data : data.results || []);
      } catch (e) {
        if (!cancelled) setErr(e.response?.data?.detail || "Could not load packages.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params]);

  return (
    <main style={{ padding: "2.5rem 0 4rem" }}>
      <div className="container">
        <h1 style={{ marginTop: 0 }}>Packages</h1>
        <p className="muted" style={{ maxWidth: "60ch" }}>
          Explore top stays by location or neighborhood. Compare prices, check amenities, and book the ideal accommodation for your travels
        </p>

        <div
          className="surface"
          style={{
            marginTop: "1.5rem",
            padding: "1.25rem",
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            alignItems: "end",
          }}
        >
          <div>
            <label className="label" htmlFor="search">
              Search
            </label>
            <input
              id="search"
              className="input"
              placeholder="Title, description, location…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="loc">
              Location filter
            </label>
            <input
              id="loc"
              className="input"
              placeholder="e.g. Dubai"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="sort">
              Sort
            </label>
            <select id="sort" className="input" value={ordering} onChange={(e) => setOrdering(e.target.value)}>
              <option value="-created_at">Newest</option>
              <option value="price">Price ↑</option>
              <option value="-price">Price ↓</option>
              <option value="title">Title A–Z</option>
            </select>
          </div>
        </div>

        {err && (
          <p style={{ color: "#f87171", marginTop: "1rem" }} role="alert">
            {err}
          </p>
        )}
        {loading && <p className="muted">Loading packages…</p>}

        {!loading && (
          <div className="card-grid" style={{ marginTop: "2rem" }}>
            {items.map((p) => (
              <article key={p.id} className="surface" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ aspectRatio: "16/10", overflow: "hidden" }}>
                  <img
                    src={p.image || getLocationImage(p.location)|| placeholder}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                  <h2 style={{ fontSize: "1.25rem", margin: 0 }}>{p.title}</h2>
                  <p className="muted" style={{ margin: 0, fontSize: "0.95rem" }}>
                    {p.location}
                  </p>
                  <p style={{ margin: "0.25rem 0 0", flex: 1, fontSize: "0.95rem", color: "var(--text-muted)" }}>
                    {p.description?.slice(0, 110)}
                    {p.description?.length > 110 ? "…" : ""}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem" }}>
                    <div>
                      <span style={{ fontSize: "1.35rem", fontWeight: 700 }}>
                        Rs. {Number(p.price).toFixed(0)}
                      </span>
                      <span className="muted" style={{ fontSize: "0.85rem", marginLeft: "0.35rem" }}>
                        / person
                      </span>
                    </div>
                    <span className="muted" style={{ fontSize: "0.85rem" }}>
                      {p.duration}
                    </span>
                  </div>
                  <Link to={`/packages/${p.id}`} className="btn btn-primary" style={{ marginTop: "0.75rem", width: "100%" }}>
                    View details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && !err && <p className="muted">No packages match your filters.</p>}
      </div>
    </main>
  );
}
