import { createContext, useContext, useRef, useCallback } from "react";

const SectionContext = createContext(null);

export function SectionProvider({ children }) {
  const sectionRefs = useRef({});

  const registerSection = useCallback(
    (id) => (el) => {
      sectionRefs.current[id] = el;
    },
    []
  );

  const scrollToSection = useCallback((id) => {
    const el = sectionRefs.current[id];
    if (!el) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    el.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }, []);

  return (
    <SectionContext.Provider value={{ registerSection, scrollToSection }}>
      {children}
    </SectionContext.Provider>
  );
}

export function useSectionNav() {
  const ctx = useContext(SectionContext);
  if (!ctx) {
    throw new Error("useSectionNav must be used within a SectionProvider");
  }
  return ctx;
}
