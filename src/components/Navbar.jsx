import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAME, ROLE, NAV_LINKS } from "../data/content";
import { useSectionNav } from "../context/SectionContext";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollToSection } = useSectionNav();

  const goTo = (id) => {
    scrollToSection(id);
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <span className="navbar-name">{NAME}</span>
          <span className="navbar-role">{ROLE}</span>
        </div>

        <div className="navbar-links">
          {NAV_LINKS.map((id) => (
            <button
              key={id}
              className="navbar-link focusable"
              onClick={() => goTo(id)}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}
          <button
            className="navbar-cta focusable"
            onClick={() => goTo("contact")}
          >
            Let's talk
          </button>
        </div>

        <button
          className="navbar-menu-btn focusable"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </nav>

      {menuOpen && (
        <div className="navbar-mobile">
          <div className="navbar-mobile-top">
            <span className="navbar-name">{NAME}</span>
            <button
              className="navbar-menu-btn focusable"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={26} />
            </button>
          </div>
          <div className="navbar-mobile-links">
            {[...NAV_LINKS, "services", "contact"].map((id) => (
              <button
                key={id}
                className="navbar-mobile-link focusable"
                onClick={() => goTo(id)}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
