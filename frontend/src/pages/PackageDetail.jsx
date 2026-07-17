import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import { getLocationImage } from "../utils/locationImages";

const placeholder =
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80";

export default function PackageDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [pkg, setPkg] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const { data } = await api.get(`/packages/${id}/`);
        if (!cancelled) setPkg(data);
      } catch (e) {
        if (!cancelled) setErr(e.response?.status === 404 ? "Package not found." : "Could not load package.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <p className="container" style={{ padding: "3rem 0" }}>Loading…</p>;
  if (err || !pkg)
    return (
      <p className="container" style={{ padding: "3rem 0", color: "#f87171" }}>
        {err || "Not found."}
      </p>
    );

  return (
    <main style={{ padding: "2.5rem 0 4rem" }}>
      <div className="container">
        <div
          className="surface"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 0,
            overflow: "hidden",
          }}
        >
          <div style={{ minHeight: 320 }}>
            <img
              src={pkg.image || getLocationImage(pkg.location)  || placeholder}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div style={{ padding: "2rem" }}>
            <p className="muted" style={{ margin: 0, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.75rem" }}>
              {pkg.location}
            </p>
            <h1 style={{ margin: "0.5rem 0 1rem" }}>{pkg.title}</h1>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.65 }}>{pkg.description}</p>
            <div style={{ display: "flex", gap: "2rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
              <div>
                <div className="muted" style={{ fontSize: "0.85rem" }}>
                  From
                </div>
                <div style={{ fontSize: "1.75rem", fontWeight: 700 }}>Rs. {Number(pkg.price).toFixed(0)}</div>
              </div>
              <div>
                <div className="muted" style={{ fontSize: "0.85rem" }}>
                  Duration
                </div>
                <div style={{ fontSize: "1.25rem", fontWeight: 600 }}>{pkg.duration}</div>
              </div>
            </div>
            <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {user ? (
                <Link to={`/packages/${pkg.id}/book`} className="btn btn-primary">
                  Book this package
                </Link>
              ) : (
                <Link to="/login" className="btn btn-primary">
                  Log in to book
                </Link>
              )}
              <Link to="/packages" className="btn btn-ghost">
                Back to list
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
