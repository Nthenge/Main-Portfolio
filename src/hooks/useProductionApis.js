import { createResourceHook } from "./createResourceHook";

const { useResource, refresh } = createResourceHook("/api/availability/production-apis", null);

export function useProductionApis() {
  const { data, loading, error } = useResource();
  return { productionApis: data, loading, error };
}

export const refreshProductionApis = refresh;