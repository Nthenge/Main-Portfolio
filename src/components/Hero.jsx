import { ArrowUpRight } from "lucide-react";
import Terminal from "./Terminal";
import { useSectionNav } from "../context/SectionContext";
import { useAvailability } from "../hooks/useAvailability";
import "./Hero.css";

export default function Hero() {
  const { registerSection, scrollToSection } = useSectionNav();
  const { available, loading } = useAvailability();

  return (
    <section id="home" className="hero" ref={registerSection("home")}>
      <div className="hero-inner">
        <Terminal />

        <div className="hero-text">
          <div
            className={`status-badge${
              !loading && !available ? " status-badge-unavailable" : ""
            }`}
          >
            <span className="status-dot" />
            {loading
              ? "CHECKING STATUS..."
              : available
              ? "STATUS: OPEN TO WORK"
              : "STATUS: CURRENTLY BOOKED"}
          </div>
          <div className="eyebrow">// Backend Dev. Terminal's live — type help to poke around.</div>
          <h1 className="hero-title">
            I build backend systems that don't flinch.
          </h1>
          <p className="hero-sub">
            Java and Spring Boot on the outside, stubbornness on the
            inside. I design APIs, databases, and services meant to hold
            up under real load. Limits are just unsolved problems.
          </p>
          <div className="hero-ctas">
            <button
              className="btn btn-primary focusable"
              onClick={() => scrollToSection("work")}
            >
              View work <ArrowUpRight size={16} />
            </button>
            <button
              className="btn btn-ghost focusable"
              onClick={() => scrollToSection("contact")}
            >
              Get in touch
            </button>
          </div>
        </div>
      </div>
      <p className="terminal-hint">
        <br/><br/><br/><br/>
        Try typing into the terminal: work · about · contact · whoami · ls · help
      </p>
    </section>
  );
}