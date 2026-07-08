import { createResourceHook } from "./createResourceHook";

const { useResource, refresh } = createResourceHook("/api/projects");

export function useProjects() {
  const { data, loading, error } = useResource();
  return { projects: data, loading, error };
}

export const refreshProjects = refresh;