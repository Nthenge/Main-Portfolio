import { useSkills } from "../hooks/useSkills";
import { useSectionNav } from "../context/SectionContext";
import { STATS } from "../data/content";
import SkillsTerminal from "./SkillsTerminal";
import "./About.css";

export default function About() {
  const { registerSection } = useSectionNav();
  const { skills, loading, error } = useSkills();

  return (
    <section id="about" className="section about" ref={registerSection("about")}>
      <div className="about-grid">
        <div className="about-text">
          <span className="eyebrow">About</span>
          <h2 className="section-title">Backend Dev.</h2>
          <p>
            I build backend systems that don't buckle under pressure. APIs,
            microservices, and databases engineered with Java and Spring Boot
            to handle whatever gets thrown at them. Limits are just unsolved
            problems.
          </p>
          <p>
            When I'm not deep in code, I'm reverse-engineering how things
            work, breaking them on purpose, and putting them back together a
            little better than before.
          </p>

          <div className="about-stats">
            {STATS.map((stat) => (
              <div key={stat.label} className="about-stat">
                <span className="about-stat-value">{stat.value}</span>
                <span className="about-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="tag-list">
            {loading && <span className="tag">Loading...</span>}
            {error && <span className="tag">Couldn't load skills</span>}
            {!loading &&
              !error &&
              skills.map((s) => (
                <span key={s.id} className="tag">
                  {s.name}
                </span>
              ))}
          </div>
        </div>

        <div className="about-terminal">
          <SkillsTerminal />
        </div>
      </div>
    </section>
  );
}