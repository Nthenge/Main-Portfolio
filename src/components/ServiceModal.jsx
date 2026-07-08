import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { getServiceDetails } from "../data/serviceDetails";
import "./ServiceModal.css";

export default function ServiceModal({ service, onClose }) {
  const closeButtonRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocused.current?.focus();
    };
  }, [onClose]);

  if (!service) return null;

  const details = getServiceDetails(service.title);

  return (
    <div
      className="service-modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="service-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="service-modal-header">
          <div>
            <span className="service-modal-number">{service.number}</span>
            <h3 id="service-modal-title" className="service-modal-title">
              {service.title}
            </h3>
          </div>
          <button
            ref={closeButtonRef}
            className="service-modal-close focusable"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <p className="service-modal-summary">{details.summary}</p>

        {details.sections.map((section, i) => (
          <div key={i} className="service-modal-section">
            <h4 className="service-modal-section-heading">
              {section.heading}
            </h4>

            {section.type === "text" && (
              <p className="service-modal-text">{section.content}</p>
            )}

            {(section.type === "list" || section.type === "steps") && (
              <ul className="service-modal-list">
                {section.items.map((item, j) => (
                  <li key={j}>
                    {section.type === "steps" && (
                      <span className="service-modal-step-num">
                        {j + 1}
                      </span>
                    )}
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {section.type === "tags" && (
              <div className="service-modal-tags">
                {section.items.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {section.type === "api" && (
              <div className="service-modal-api">
                <div className="service-modal-endpoint">
                  <span className="service-modal-method">
                    {section.method}
                  </span>
                  <span>{section.endpoint}</span>
                </div>
                <div className="service-modal-code-block">
                  <span className="service-modal-code-label">Request</span>
                  <pre>{section.request}</pre>
                </div>
                <div className="service-modal-code-block">
                  <span className="service-modal-code-label">Response</span>
                  <pre>{section.response}</pre>
                </div>
              </div>
            )}

            {section.type === "code" && (
              <div className="service-modal-code-block">
                <span className="service-modal-code-label">
                  {section.label}
                </span>
                <pre>{section.content}</pre>
              </div>
            )}

            {section.type === "table" && (
              <div className="service-modal-table">
                {section.items.map((row, j) => (
                  <div key={j} className="service-modal-table-row">
                    <span className="service-modal-table-label">
                      {row.label}
                    </span>
                    <span className="service-modal-table-value">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {section.type === "compare" && (
              <div className="service-modal-compare">
                <div className="service-modal-compare-col">
                  <span className="service-modal-compare-heading good">
                    Good fit if
                  </span>
                  <ul className="service-modal-list">
                    {section.good.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="service-modal-compare-col">
                  <span className="service-modal-compare-heading not-good">
                    Not a good fit if
                  </span>
                  <ul className="service-modal-list">
                    {section.notGood.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}