import { createResourceHook } from "./createResourceHook";

const { useResource, refresh } = createResourceHook("/api/availability/yop", null);

export function useYearsOfExperience() {
  const { data, loading, error } = useResource();
  return { yop: data, loading, error };
}

export const refreshYearsOfExperience = refresh;