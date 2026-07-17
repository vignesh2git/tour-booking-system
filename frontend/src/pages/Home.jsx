import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import { IconExperiences, IconGlobe, IconPlane } from "../components/StatIcons.jsx";
import { getLocationImage } from "../utils/locationImages";

const placeholder =
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=900&q=80";



const LOCATION_GALLERY = [
  { name: "Paris", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80" },
  { name: "Dubai", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80" },
  { name: "Tokyo", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80" },
  { name: "New York", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=900&q=80" },
  { name: "Barcelona", img: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=900&q=80" },
  { name: "Bali", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80" },
  { name: "London", img: "https://plus.unsplash.com/premium_photo-1671734045770-4b9e1a5e53a0?auto=format&fit=crop&w=900&q=80" },
  { name: "Sydney", img: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=900&q=80" },
];

export default function Home() {
  const { user } = useAuth();
  const location = useLocation();
  const carouselRef = useRef(null);
  const [topPackages, setTopPackages] = useState([]);
  const [loadingTop, setLoadingTop] = useState(true);

  const [searchLocation, setSearchLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [searchMsg, setSearchMsg] = useState("");

  const [activeCard, setActiveCard] = useState("hotel"); // default to hotel
  const [tripType, setTripType] = useState("oneway"); // "oneway" or "roundtrip"

  const [cName, setCName] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cSubject, setCSubject] = useState("");
  const [cMessage, setCMessage] = useState("");
  const [cStatus, setCStatus] = useState("");
  const [cLoading, setCLoading] = useState(false);

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (!hash) return;
    const t = setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    }, 120);
    return () => clearTimeout(t);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/packages/?ordering=-price");
        const list = Array.isArray(data) ? data : data.results || [];
        if (!cancelled) setTopPackages(list);
      } catch {
        if (!cancelled) setTopPackages([]);
      } finally {
        if (!cancelled) setLoadingTop(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function onSearchSubmit(e) {
    e.preventDefault();
    setSearchMsg(
      `Demo: searching stays & fares for “${searchLocation || "anywhere"}” · ${checkIn || "?"} → ${checkOut || "?"}. Wire this to your hotels/flights API when ready.`,
    );
  }

  function scrollCarousel(dir) {
    const el = carouselRef.current;
    if (!el) return;
    const delta = Math.min(el.clientWidth * 0.85, 360) * dir;
    el.scrollBy({ left: delta, behavior: "smooth" });
  }

  async function onContactSubmit(e) {
    e.preventDefault();
    setCStatus("");
    setCLoading(true);
    try {
      await api.post("/contact/", {
        name: cName,
        email: cEmail,
        subject: cSubject,
        message: cMessage,
      });
      setCStatus("Thanks — we received your message and will reply soon.");
      setCName("");
      setCEmail("");
      setCSubject("");
      setCMessage("");
    } catch (ex) {
      const d = ex.response?.data;
      setCStatus(typeof d === "object" ? JSON.stringify(d) : "Something went wrong. Please try again.");
    } finally {
      setCLoading(false);
    }
  }

  return (
    <main>
      <section
        className="home-hero"
        style={{
          position: "relative",
          minHeight: "70vh",
          display: "grid",
          alignItems: "end",
          paddingBottom: "3.5rem",
          overflow: "hidden",
        }}
      >
        <div
          className="home-hero-bg"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(120deg, rgba(11,18,32,0.92) 0%, rgba(11,18,32,0.55) 45%, rgba(11,18,32,0.2) 100%), url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <p className="section-kicker" style={{ color: "var(--accent-2)" }}>
            Travel curated for you
          </p>
          <h1 style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)", maxWidth: "18ch", margin: "0.6rem 0 1rem" }}>
            Discover destinations that feel like a story worth telling.
          </h1>
          <p className="muted" style={{ fontSize: "1.1rem", maxWidth: "52ch", marginBottom: "2rem" }}>
            Browse curated packages, plan stays and flights, and book with flexible payment options — clarity on every
            screen.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link to="/packages" className="btn btn-primary">
              Explore packages
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-ghost">
                Create account
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="home-travel-search section-block ">
        <div className="container">
          <div className="home-search-behance">
            <div className="home-search-behance-head">
              <p className="home-search-behance-kicker">Plan your trip</p>
            </div>

            {/* Toggle Buttons */}
            <div className="home-search-behance-toggle" style={{ marginBottom: "1rem" }}>
              <button
                className={`toggle-btn ${activeCard === "hotel" ? "active" : ""}`}
                type="button"
                onClick={() => setActiveCard("hotel")}
                
              >
                Hotels
              </button>
              <button
                className={`toggle-btn ${activeCard === "flight" ? "active" : ""}`}
                type="button"
                onClick={() => setActiveCard("flight")}
                
              >
                Flights
              </button>
            </div>

            {/* Form */}
            <form className="home-search-behance-form" onSubmit={onSearchSubmit}>
              {activeCard === "hotel" && (
                <div className="home-search-behance-row">
                  <div className="home-search-behance-field">
                    <label htmlFor="hs-loc">Where to?</label>
                    <input
                      id="hs-loc"
                      type="text"
                      placeholder="City, airport, hotel…"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                  <span className="home-search-behance-divider" aria-hidden />
                  <div className="home-search-behance-field">
                    <label htmlFor="hs-in">Check in</label>
                    <input id="hs-in" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                  </div>
                  <span className="home-search-behance-divider" aria-hidden />
                  <div className="home-search-behance-field">
                    <label htmlFor="hs-out">Check out</label>
                    <input id="hs-out" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                  </div>
                </div>
              )}

              {activeCard === "flight" && (
                <div className="home-search-behance-row" style={{ position: "relative" }}>
                  {/* Trip type toggle */}
                  <div style={{ position: "absolute", top: 0, right: 0, display: "flex", gap: "0.5rem" }}>
                    <button
                      type="button"
                      className={`flight-toggle ${tripType === "oneway" ? "active" : ""}`}
                      onClick={() => setTripType("oneway")}
                      
                    >
                      One-way
                    </button>
                    <button
                      type="button"
                      className={`flight-toggle ${tripType === "roundtrip" ? "active" : ""}`}
                      onClick={() => setTripType("roundtrip")}
                    >
                      Round-trip
                    </button>
                  </div>

                  <div className="home-search-behance-field">
                    <label htmlFor="flight-from">From</label>
                    <input id="flight-from" type="text" placeholder="City or airport" />
                  </div>
                  <span className="home-search-behance-divider" aria-hidden />
                  <div className="home-search-behance-field">
                    <label htmlFor="flight-to">To</label>
                    <input id="flight-to" type="text" placeholder="City or airport" />
                  </div>
                  <span className="home-search-behance-divider" aria-hidden />
                  <div className="home-search-behance-field">
                    <label htmlFor="flight-date">Date</label>
                    <input id="flight-date" type="date" />
                  </div>

                  {/* Conditionally show Return date if roundtrip */}
                  {tripType === "roundtrip" && (
                    <>
                      <span className="home-search-behance-divider" aria-hidden />
                      <div className="home-search-behance-field">
                        <label htmlFor="flight-return">Return</label>
                        <input id="flight-return" type="date" />
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="home-search-behance-action">
                <button type="submit" className="home-search-behance-btn">Search</button>
              </div>
            </form>

            {searchMsg && (
              <p className="home-search-behance-msg" role="status">
                {searchMsg}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="section-block container" id="recommended">
        <p className="section-kicker">Recommended</p>
        <h2 className="section-title">Top tour places</h2>
        <p className="muted" style={{ maxWidth: "52ch", marginBottom: "1.5rem" }}>
          A spotlight on premium experiences — sorted by value so you can dream big first.
        </p>
        {loadingTop && <p className="muted">Loading highlights…</p>}
        {!loadingTop && topPackages.length > 0 && (
          <div className="package-carousel-wrap">
            <button
              type="button"
              className="package-carousel-nav package-carousel-nav--prev"
              aria-label="Previous packages"
              onClick={() => scrollCarousel(-1)}
            />
            <div ref={carouselRef} className="package-carousel" tabIndex={0} role="region" aria-label="Tour packages carousel">
              {topPackages.map((p) => (
                <article key={p.id} className="package-carousel-card surface">
                  <div className="package-carousel-card-img">
                    <img src={p.image || getLocationImage(p.location)|| placeholder} alt="" />
                  </div>
                  <div className="package-carousel-card-body">
                    <h3>{p.title}</h3>
                    <p className="muted">{p.location}</p>
                    <div className="package-carousel-card-meta">
                      <span className="package-carousel-price">Rs. {Number(p.price).toFixed(0)}</span>
                      <span className="muted">{p.duration}</span>
                    </div>
                    <Link to={`/packages/${p.id}`} className="btn btn-primary package-carousel-cta">
                      View details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <button
              type="button"
              className="package-carousel-nav package-carousel-nav--next"
              aria-label="Next packages"
              onClick={() => scrollCarousel(1)}
            />
          </div>
        )}
        {!loadingTop && topPackages.length === 0 && <p className="muted">No packages available yet.</p>}
      </section>

      <section className="section-block container" id="about">
        <p className="section-kicker">Our story</p>
        <h2 className="section-title">About Wanderlust Travel</h2>
        <div className="about-grid">
          <div className="about-copy">
            <p className="muted" style={{ fontSize: "1.05rem", lineHeight: 1.75, marginTop: 0 }}>
              Wanderlust Travel connects explorers with hand-crafted itineraries. We combine local insight, transparent
              pricing, and responsive support so every trip feels personal — whether you are chasing coastlines, peaks, or
              city lights.
            </p>
            <ul className="about-list muted">
              <li>Clarity over clutter — duration, location, and price upfront.</li>
              <li>People first — bookings and payments stay easy to track in your dashboard.</li>
              <li>Design that travels — layouts stay polished on desktop, tablet, and mobile.</li>
            </ul>
          </div>
          <div className="about-visual surface" style={{ padding: 0, overflow: "hidden", minHeight: 220 }}>
            <img
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80"
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      <section className="section-block container">
        <div className="services-panel services-panel--light">
          <p className="section-kicker" style={{ color: "#0d9488" }}>
            Why choose us
          </p>
          <h2 className="section-title">We offer best services</h2>
          <p className="muted" style={{ maxWidth: "56ch", marginBottom: "0.5rem" }}>
            Smart trips, local insights, seamless bookings, memorable adventures, tailored experiences, reliable support, stress-free travel.
          </p>
          <div className="services-grid" style={{ marginTop: "1.75rem" }}>
            {[
              {
                title: "Customized Tours",
                text: "Tailored itineraries built around your dates, pace, and must-see stops.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                ),
              },
              {
                title: "Trusted Stays",
                text: "Partner hotels and lodges vetted for comfort, location, and guest care.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4" />
                  </svg>
                ),
              },
              {
                title: "24/7 Support",
                text: "Real humans on chat and phone before, during, and after your journey.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M22 16.92v2a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h2a2 2 0 012 1.72c.12.86.3 1.7.54 2.5a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.58-1.58a2 2 0 012.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0122 16.92z" />
                  </svg>
                ),
              },
              {
                title: "Secure Payments",
                text: "Flexible methods with clear totals — card, UPI, wallet, or guided simulation.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                ),
              },
            ].map((s) => (
              <div key={s.title} className="service-card">
                <div className="service-icon-wrap">{s.icon}</div>
                <h3 style={{ fontSize: "1.1rem", margin: "0 0 0.5rem", color: "#0f172a" }}>{s.title}</h3>
                <p className="muted" style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.55 }}>
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block container location-gallery-section">
        <p className="section-kicker" style={{ color: "#0d9488" }}>
          Destinations
        </p>
        <h2 className="section-title">Explore by location</h2>
        <p className="muted" style={{ maxWidth: "52ch", marginBottom: "1.5rem" }}>
          Eight hand-picked cities — names sit on photography in a clean editorial overlay.
        </p>
        <div className="location-gallery-grid">
          {LOCATION_GALLERY.map((loc) => (
            <div key={loc.name} className="location-gallery-tile">
              <img src={loc.img} alt="" loading="lazy" decoding="async" />
              <div className="location-gallery-scrim" aria-hidden />
              <span className="location-gallery-name">{loc.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="home-stats section-block">
        <div className="container">
          <div className="stats-panel stats-panel--branded">
            <div className="stat-item">
              <span className="stat-icon" aria-hidden>
                <IconExperiences />
              </span>
              <span className="stat-value">24,000+</span>
              <span className="stat-label">Travel experiences</span>
            </div>
            <div className="stat-divider" aria-hidden />
            <div className="stat-item">
              <span className="stat-icon" aria-hidden>
                <IconGlobe />
              </span>
              <span className="stat-value">85+</span>
              <span className="stat-label">Countries</span>
            </div>
            <div className="stat-divider" aria-hidden />
            <div className="stat-item stat-item--wide">
              <span className="stat-icon" aria-hidden>
                <IconPlane />
              </span>
              <span className="stat-value">Air ticketing</span>
              <span className="stat-label">Global fares &amp; flexible routing</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-contact section-block" id="contact">
        <div className="container">
          <div className="contact-split surface">
            <div className="contact-split-visual">
              <img
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80"
                alt=""
              />
              <div className="contact-split-gradient" />
              <div className="contact-split-caption">
                <p className="section-kicker" style={{ color: "rgba(255,255,255,0.85)", marginBottom: "0.35rem" }}>
                  Get in touch
                </p>
                <h2 style={{ margin: 0, fontSize: "clamp(1.5rem, 3vw, 2rem)", maxWidth: "14ch" }}>Let’s plan your next journey</h2>
              </div>
            </div>
            <div className="contact-split-form-wrap">
              <h3 style={{ marginTop: 0, fontSize: "1.35rem" }}>Contact us</h3>
              <p className="muted" style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>
                Questions about packages, partnerships, or support? We reply during business hours.
              </p>
              <form className="contact-inline-form" onSubmit={onContactSubmit}>
                <div>
                  <label className="label" htmlFor="hc-name">
                    Name
                  </label>
                  <input id="hc-name" className="input" value={cName} onChange={(e) => setCName(e.target.value)} required />
                </div>
                <div>
                  <label className="label" htmlFor="hc-email">
                    Email
                  </label>
                  <input
                    id="hc-email"
                    type="email"
                    className="input"
                    value={cEmail}
                    onChange={(e) => setCEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label" htmlFor="hc-subject">
                    Subject
                  </label>
                  <input id="hc-subject" className="input" value={cSubject} onChange={(e) => setCSubject(e.target.value)} required />
                </div>
                <div>
                  <label className="label" htmlFor="hc-msg">
                    Message
                  </label>
                  <textarea id="hc-msg" className="input" rows={4} value={cMessage} onChange={(e) => setCMessage(e.target.value)} required />
                </div>
                {cStatus && (
                  <p
                    style={{
                      color: cStatus.startsWith("Thanks") ? "var(--accent-2)" : "#f87171",
                      fontSize: "0.9rem",
                      margin: 0,
                    }}
                    role="status"
                  >
                    {cStatus}
                  </p>
                )}
                <button type="submit" className="btn btn-primary" disabled={cLoading} style={{ width: "100%" }}>
                  {cLoading ? "Sending…" : "Send message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <footer
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
          textAlign: "center",
          padding: "1rem",
          fontSize: "0.95rem",
          color: "#ffffff",
          fontWeight: 600, // added font weight
          background: "rgba(11, 18, 32, 0.6)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderRadius: "0 0 12px 12px",
        }}
      >
        &copy; 2026 <span style={{ color: "#f97316", fontSize: "1.1rem", fontWeight: 700 }}>&nbsp;𝐕𝐂 WanderLust</span>&nbsp;-&nbsp; Made with passion for travel
      </footer>


      
    </main>
  );
}
