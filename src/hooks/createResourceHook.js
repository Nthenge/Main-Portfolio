import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";

export function createResourceHook(path) {
  let cache = null;
  let inFlight = null;
  const subscribers = new Set();

  function notify() {
    subscribers.forEach((setData) => setData(cache));
  }

  async function fetchData() {
    if (!inFlight) {
      inFlight = fetch(`${API_BASE_URL}${path}`)
        .then((res) => {
          if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
          return res.json();
        })
        .then((data) => {
          cache = data;
          notify();
          return data;
        })
        .finally(() => {
          inFlight = null;
        });
    }
    return inFlight;
  }

  function useResource() {
    const [data, setData] = useState(cache || []);
    const [loading, setLoading] = useState(!cache);
    const [error, setError] = useState(null);

    useEffect(() => {
      subscribers.add(setData);

      if (cache) {
        setData(cache);
        setLoading(false);
      } else {
        setLoading(true);
        fetchData()
          .then(() => setLoading(false))
          .catch((err) => {
            setError(err.message);
            setLoading(false);
          });
      }

      return () => subscribers.delete(setData);
    }, []);

    return { data, loading, error };
  }

  async function refresh() {
    cache = null;
    return fetchData();
  }

  return { useResource, refresh };
}