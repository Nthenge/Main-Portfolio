import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useServices } from "../hooks/useServices";
import { useSectionNav } from "../context/SectionContext";
import { getServiceDetails } from "../data/serviceDetails";
import ServiceModal from "./ServiceModal";
import "./Services.css";

export default function Services() {
  const { registerSection } = useSectionNav();
  const { services, loading, error } = useServices();
  const [selectedService, setSelectedService] = useState(null);

  const openService = (service) => setSelectedService(service);
  const closeService = () => setSelectedService(null);

  const handleCardKeyDown = (e, service) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openService(service);
    }
  };

  return (
    <section
      id="services"
      className="section services"
      ref={registerSection("services")}
    >
      <div className="section-head">
        <span className="eyebrow">Services</span>
        <h2 className="section-title">Think. Build. Ship. Support.</h2>
        <p className="section-desc">
          From architecture decisions to production support — the full
          lifecycle of a backend that actually holds up.
        </p>
      </div>

      {loading && <p className="placeholder-note">Loading services...</p>}
      {error && (
        <p className="placeholder-note">
          Couldn't load services from the server.
        </p>
      )}

      {!loading && !error && (
        <div className="services-grid">
          {services.map((s) => {
            const details = getServiceDetails(s.title);
            return (
              <div
                key={s.id}
                className={`service-card${
                  s.wide ? " service-card-wide" : ""
                } focusable`}
                onClick={() => openService(s)}
                onKeyDown={(e) => handleCardKeyDown(e, s)}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
              >
                <div className="service-card-top">
                  <span className="service-number">{s.number}</span>
                  <div className="service-title">{s.title}</div>
                  <div className="service-subtitle">{s.subtitle}</div>
                </div>

                <p className="service-preview">{details.summary}</p>

                <div className="service-card-footer">
                  View details <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedService && (
        <ServiceModal service={selectedService} onClose={closeService} />
      )}
    </section>
  );
}