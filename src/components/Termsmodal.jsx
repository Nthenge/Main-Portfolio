import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import "./TermsModal.css";

export default function TermsModal({ onClose }) {
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

  return (
    <div className="terms-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="terms-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="terms-modal-header">
          <h3 id="terms-modal-title" className="terms-modal-title">
            Terms of Use
          </h3>
          <button
            ref={closeButtonRef}
            className="terms-modal-close focusable"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="terms-modal-body">
          <p>
            This site is a personal portfolio. Content — project write-ups,
            code snippets, and case studies — is shared for the purpose of
            showcasing my work and may not be reproduced or republished
            without permission.
          </p>
          <p>
            Information you submit through the contact form is used solely
            to respond to your inquiry, as described in the Privacy Policy.
            Submitting the form doesn't create any contractual obligation
            on either side — it's simply a way to start a conversation.
          </p>
          <p>
            This site is provided as-is, without warranties of any kind. I
            make a reasonable effort to keep it accurate and available, but
            can't guarantee uninterrupted access or that every detail stays
            current.
          </p>
          <p>
            Links to external sites (GitHub, LinkedIn, Twitter, and similar)
            are provided for convenience. I'm not responsible for the
            content or practices of those third-party sites.
          </p>
          <p>
            These terms may be updated occasionally to reflect changes to
            the site. Continued use after an update means you accept the
            revised terms.
          </p>
        </div>
      </div>
    </div>
  );
}