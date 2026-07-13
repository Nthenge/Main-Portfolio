import { useState, useEffect } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useSectionNav } from "../context/SectionContext";
import PrivacyModal from "./PrivacyModal";
import TermsModal from "./Termsmodal";
import "./Contact.css";
import { API_BASE_URL } from "../config/api";

const CONTACT_ENDPOINT = `${API_BASE_URL}/api/contact`;

function useLocalTime(timeZone = "Africa/Nairobi") {
  const [time, setTime] = useState(() => formatTime(timeZone));

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(timeZone)), 1000);
    return () => clearInterval(id);
  }, [timeZone]);

  return time;
}

function formatTime(timeZone) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

export default function Contact() {
  const { registerSection } = useSectionNav();
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [privacyModalReadOnly, setPrivacyModalReadOnly] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const localTime = useLocalTime();

  const handleCheckboxClick = (e) => {
    if (!agreed) {
      e.preventDefault();
      setPrivacyModalReadOnly(false);
      setShowPrivacyModal(true);
    }
  };

  const handleCheckboxChange = (e) => {
    setAgreed(e.target.checked);
  };

  const handleAgree = () => {
    setAgreed(true);
    setShowPrivacyModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreed) {
      setStatus("error");
      setErrorMessage("Please agree to the Privacy Policy first.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name")?.trim(),
      email: formData.get("email")?.trim(),
      budget: formData.get("budget") || null,
      service: formData.get("service") || null,
      description: formData.get("desc")?.trim(),
    };

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message =
          body?.message ||
          (body?.errors && Object.values(body.errors)[0]) ||
          "Something went wrong. Please try again.";
        throw new Error(message);
      }

      setStatus("success");
      form.reset();
      setAgreed(false);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  const isLoading = status === "loading";

  return (
    <section id="contact" className="contact" ref={registerSection("contact")}>
      <div className="contact-left">
        <div className="contact-left-inner">
          <span className="eyebrow">Contact</span>
          <h2 className="section-title">
            Want to work with me?
            <br />
            I'd love to hear from you!
          </h2>
          <p className="contact-left-desc">
            Whether it's a full backend build, an architecture review, or
            just a question about your stack. Tell me what you're working
            on and I'll get back to you.
          </p>
        </div>

        <div className="contact-note">
          <p>
            Ask me about the cache that kept serving stale data long after the database had moved on without it. <br/><br/>
            Ask me about the transaction that committed twice. <br/><br/>
            Ask me about the semicolon that a firewall mistook for an attack.
          </p>
        </div>

        <div className="contact-time">
          <span className="contact-time-label">Local time:</span>
          <span className="contact-time-value">{localTime}, EAT</span>
        </div>
      </div>

      <div className="contact-right">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Abraham Dev"
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-field">
              <label htmlFor="email">E-Mail</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="abraham@company.com"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="budget">Budget Range</label>
              <select id="budget" name="budget" defaultValue="" disabled={isLoading}>
                <option value="" disabled>Select a range</option>
                <option>Under 10,000 KSH</option>
                <option>10,000 - 50,000 KSH</option>
                <option>50,000 - 200,000 KSH</option>
                <option>200,000+ KSH</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="service">Services</label>
              <select id="service" name="service" defaultValue="" disabled={isLoading}>
                <option value="" disabled>Select a service</option>
                <option>Backend Development</option>
                <option>API Consulting</option>
                <option>System Design</option>
                <option>Ongoing Support</option>
              </select>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="desc">Project description</label>
            <textarea
              id="desc"
              name="desc"
              rows={4}
              placeholder="Hello Abraham, can you help me with... my goals and timeline are... and this is my project link..."
              required
              disabled={isLoading}
            />
          </div>

          <label className="form-checkbox">
            <input
              type="checkbox"
              checked={agreed}
              onClick={handleCheckboxClick}
              onChange={handleCheckboxChange}
              disabled={isLoading}
            />
            <span>
              By submitting this form, you agree to the{" "}
              <a
                href="#privacy"
                onClick={(e) => {
                  e.preventDefault();
                  setPrivacyModalReadOnly(false);
                  setShowPrivacyModal(true);
                }}
              >
                Privacy Policy
              </a>
            </span>
          </label>

          {status === "error" && (
            <p className="form-status form-status-error">{errorMessage}</p>
          )}
          {status === "success" && (
            <p className="form-status form-status-success">
              Thanks! Your message has been sent — I'll get back to you soon.
            </p>
          )}

        <div className="form-footer">
          <div className="form-footer-row">
            <button type="submit" className="btn btn-primary focusable" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={16} className="spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="form-alt-contact">
              <span>Hate contact forms?</span>
              <a href="mailto:nthengesj@gmail.com" target="_blank" rel="noreferrer">
                Send Email Directly
              </a>
            </div>
          </div>

          <a
            href="https://wa.me/254768830097?text=Hi%20Abraham%2C%20I%27d%20like%20to%20discuss%20a%20project"
            target="_blank"
            rel="noreferrer"
            className="whatsapp-btn"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.39a9.86 9.86 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91S17.5 2 12.04 2Zm5.83 14.03c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.13.11-1.83-.12-.42-.13-.96-.32-1.65-.62-2.9-1.25-4.8-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.27-.29.58-.36.78-.36.19 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .89 2.15.07.15.12.32.02.51-.1.19-.15.31-.29.48-.14.16-.3.36-.42.49-.14.15-.29.31-.13.6.17.29.75 1.24 1.61 2 1.11.99 2.04 1.3 2.33 1.44.29.15.46.13.63-.07.17-.2.71-.83.9-1.11.19-.29.38-.24.63-.15.26.1 1.65.78 1.93.92.28.14.47.22.54.33.07.12.07.68-.17 1.36Z"/>
            </svg>
            Chat on WhatsApp
          </a>
        </div>
        </form>
      </div>

      <footer className="contact-footer">
        <div className="footer-note-col">
          <p className="footer-note">
            This site is built with React on the frontend and a Java Spring
            Boot backend, deployed as part of the same microservices approach
            I use for production systems — payments, auth, and notifications
            included.
          </p>
        </div>

        <div className="footer-right-col">
          <div className="footer-current">
            <p className="footer-current-text">
              Nairobi-based backend developer, mostly living inside Java Spring Boot microservices — payments, auth, and the occasional M-Pesa integration that fights back. Most nights I'm still wondering if that transaction really rolled back correctly.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-links-group">
              <span className="footer-links-heading">Follow</span>
              <a href="https://github.com/Nthenge" target="_blank">GitHub</a>
              <a href="https://www.linkedin.com/in/nthenge" target="_blank">LinkedIn</a>
            </div>
            <div className="footer-links-group">
              <span className="footer-links-heading">Legal</span>
              <a
                href="#terms"
                onClick={(e) => {
                  e.preventDefault();
                  setShowTermsModal(true);
                }}
              >
                Terms
              </a>
              <a
                href="#privacy"
                onClick={(e) => {
                  e.preventDefault();
                  setPrivacyModalReadOnly(true);
                  setShowPrivacyModal(true);
                }}
              >
                Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>

      {showPrivacyModal && (
        <PrivacyModal
          onAgree={privacyModalReadOnly ? undefined : handleAgree}
          onClose={() => setShowPrivacyModal(false)}
        />
      )}

      {showTermsModal && (
        <TermsModal onClose={() => setShowTermsModal(false)} />
      )}
    </section>
  );
}