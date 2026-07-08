import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import "./PrivacyModal.css";

export default function PrivacyModal({ onAgree, onClose }) {
  const primaryButtonRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    primaryButtonRef.current?.focus();

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
    <div className="privacy-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="privacy-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="privacy-modal-header">
          <h3 id="privacy-modal-title" className="privacy-modal-title">
            Privacy Policy
          </h3>
          <button
            ref={onAgree ? null : primaryButtonRef}
            className="privacy-modal-close focusable"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="privacy-modal-body">
          <p>
            Information submitted through this form — your name, email, and
            project details — is used only to respond to your inquiry. It
            isn't sold, shared with third parties, or used for marketing.
          </p>
          <p>
            Your submission is stored so I can follow up and keep a record
            of past inquiries. You can request deletion of your data at any
            time by emailing me directly.
          </p>
          <p>
            A confirmation email is sent to the address you provide, and a
            notification is sent to me — this is the extent of automated
            processing your submission triggers.
          </p>
        </div>

        {onAgree && (
          <button
            ref={primaryButtonRef}
            className="btn btn-primary privacy-modal-agree focusable"
            onClick={onAgree}
          >
            Agree &amp; continue
          </button>
        )}
      </div>
    </div>
  );
}