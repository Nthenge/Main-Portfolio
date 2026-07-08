import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";

export function useAvailability() {
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE_URL}/api/availability`)
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setAvailable(data.available);
          setLoading(false);
        }
      })
      .catch(() => {
        // If the backend is unreachable, default to "open to work" —
        // failing toward optimism is the safer bug here.
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { available, loading };
}