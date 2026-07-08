import { createResourceHook } from "./createResourceHook";

const { useResource, refresh } = createResourceHook("/api/services");

export function useServices() {
  const { data, loading, error } = useResource();
  return { services: data, loading, error };
}

export const refreshServices = refresh;