import { createResourceHook } from "./createResourceHook";

const { useResource, refresh } = createResourceHook("/api/skills");

export function useSkills() {
  const { data, loading, error } = useResource();
  return { skills: data, loading, error };
}

export const refreshSkills = refresh;