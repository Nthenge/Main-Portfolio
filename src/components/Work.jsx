import { ArrowRight, ExternalLink } from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { useSectionNav } from "../context/SectionContext";
import "./Work.css";

export default function Work() {
  const { registerSection } = useSectionNav();
  const { projects, loading, error } = useProjects();

  return (
    <section id="work" className="section work" ref={registerSection("work")}>
      <div className="section-head">
        <span className="eyebrow">Work</span>
        <h2 className="section-title">A few things I've shipped.</h2>
        <p className="section-desc">Real backends.</p>
      </div>

      {loading && <p className="placeholder-note">Loading projects...</p>}

      {error && (
        <p className="placeholder-note">
          Couldn't load projects from the server. Make sure the backend is
          running.
        </p>
      )}

      {!loading && !error && (
        <div className="work-grid">
          {projects.map((p, i) => {
            const stack = p.techStack
              ? p.techStack.split(",").map((t) => t.trim())
              : [];

            return (
              <div key={p.id} className="work-card">
                <div className="work-chrome">
                  <span className="work-dot" style={{ background: p.status === false ? '#ff5f57' : '#28c840' }} />
                  <span className="work-dot" style={{ background: p.status === false ? '#ff5f57' : '#28c840' }} />
                  <span className="work-dot" style={{ background: p.status === false ? '#ff5f57' : '#28c840' }} />
                  <span className="work-url">{p.domain}</span>
                </div>

                <div className={`work-preview work-preview-${(i % 4) + 1}`}>
                  <span
                    className="work-status"
                    style={{ color: p.status === false ? '#ff5f57' : '#28c840' }}
                  >
                    {p.status === false ? '503 Offline' : '200 OK'}
                  </span>
                  {p.highlight && (
                    <span className="work-highlight">{p.highlight}</span>
                  )}
                </div>

                <div className="work-content">
                  <div className="work-title">{p.name}</div>
                  <p className="work-desc">{p.description}</p>

                  {stack.length > 0 && (
                    <div className="work-stack">
                      {stack.map((tech) => (
                        <span key={tech} className="work-stack-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="work-footer">
                    {p.link ? (
                      <a href={p.link} target="_blank" rel="noreferrer">
                        View project <ArrowRight size={14} />
                      </a>
                    ) : (
                      <span className="work-footer-muted">
                        Coming soon
                      </span>
                    )}
                    {p.siteUrl && (
                      <a href={p.siteUrl} target="_blank" rel="noreferrer">
                        View site <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}