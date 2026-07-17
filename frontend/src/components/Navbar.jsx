import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import brandLogo from "../assets/brand.jpg";

const linkStyle = ({ isActive }) => ({
  color: isActive ? "var(--accent)" : "var(--text-muted)",
  fontWeight: isActive ? 600 : 500,
});
// use only if want logo design 
// function LogoMark() {
//   return (
//     <svg className="nav-logo-mark" width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
//       <circle cx="20" cy="20" r="18" stroke="url(#navGrad)" strokeWidth="2" />
//       <path
//         d="M12 26c2-6 6-10 8-12 2 2 6 6 8 12M16 18l4-6 4 6"
//         stroke="url(#navGrad)"
//         strokeWidth="1.8"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <defs>
//         <linearGradient id="navGrad" x1="8" y1="8" x2="32" y2="32">
//           <stop stopColor="#14b8a6" />
//           <stop offset="1" stopColor="#f97316" />
//         </linearGradient>
//       </defs>
//     </svg>
//   );
// }

function NavLinks({ onNavigate, linkStyleFn }) {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();

  function handleAboutClick(e) {
    onNavigate();
    if (location.pathname === "/") {
      e.preventDefault();
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <>
      <NavLink to="/" end style={linkStyleFn} onClick={onNavigate}>
        Home
      </NavLink>
      <NavLink to="/packages" style={linkStyleFn} onClick={onNavigate}>
        Packages
      </NavLink>
      <Link
        to="/#about"
        className="nav-hash-link"
        style={{ color: "var(--text-muted)", fontWeight: 500 }}
        onClick={(e) => scrollToSection("about", e)}
      >
        About Us
      </Link>
      {user && (
        <NavLink to="/dashboard" style={linkStyleFn} onClick={onNavigate}>
          Dashboard
        </NavLink>
      )}
      {user ? (
        <div className="nav-auth-inline">
          <span className="muted navbar-user" style={{ fontSize: "0.9rem" }}>
            {user.username}
          </span>
          {isAdmin && (
            <span
              style={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                padding: "0.2rem 0.5rem",
                borderRadius: 6,
                background: "var(--accent-soft)",
                color: "var(--accent)",
              }}
            >
              Admin
            </span>
          )}
          <button
            type="button"
            className="btn btn-ghost nav-logout-btn"
            onClick={() => {
              logout();
              onNavigate();
            }}
          >
            Log out
          </button>
        </div>
      ) : (
        <div className="nav-auth-inline">
          <Link to="/login" className="btn btn-ghost" onClick={onNavigate}>
            Login
          </Link>
          <Link to="/register" className="btn btn-primary">
            Register
          </Link>
        </div>
      )}
    </>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 900) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        backdropFilter: "blur(12px)",
        background: "rgba(11, 18, 32, 0.88)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <nav className="nav-shell container">
        <div className="nav-bar-row">
          <Link to="/" className="nav-brand nav-brand-with-logo" onClick={closeMenu}>
            {/* <LogoMark />  --> logo design*/}
            <img 
              src={brandLogo}
              alt="Wanderlust Logo" 
              className="nav-logo-mark" 
            />
            <span>
              Wander<span style={{ color: "var(--accent)" }}>lust</span>
            </span>
          </Link>

          <button
            type="button"
            className="nav-burger"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className={menuOpen ? "nav-burger-line open" : "nav-burger-line"} />
            <span className={menuOpen ? "nav-burger-line open" : "nav-burger-line"} />
            <span className={menuOpen ? "nav-burger-line open" : "nav-burger-line"} />
          </button>

          <div className={`nav-links-cluster ${menuOpen ? "nav-links-cluster--open" : ""}`}>
            <div className="nav-links-inner">
              <NavLinks onNavigate={closeMenu} linkStyleFn={linkStyle} />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
