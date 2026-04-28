import { useEffect, useState } from "react";
import "./Navbar.css";

const links = [
  { href: "#top", label: "Home" },
  { href: "#customers", label: "Customers" },
];

const MOBILE_MAX = 640;

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > MOBILE_MAX) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <a className="navbar__brand" href="#top" onClick={closeMenu}>
          Arali
        </a>
        <button
          type="button"
          className="navbar__menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="navbar-main-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="navbar__menu-bar" aria-hidden />
          <span className="navbar__menu-bar" aria-hidden />
          <span className="navbar__menu-bar" aria-hidden />
        </button>
        <nav
          id="navbar-main-menu"
          className={`navbar__nav${menuOpen ? " navbar__nav--open" : ""}`}
          aria-label="Main"
        >
          {links.map((link) => (
            <a
              key={link.href}
              className="navbar__link"
              href={link.href}
              onClick={closeMenu}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
