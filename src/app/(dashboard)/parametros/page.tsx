import { getAuthToken } from "@/lib/server-auth";
import { listSystemParams, updateSystemParam } from "@/repositories/product-type-repository";
import type { SystemParam } from "@/types";
import { ParametrosView } from "./_view";

async function fetchParams(): Promise<SystemParam[]> {
  "use server";
  const token = await getAuthToken();
  return listSystemParams(token);
}

async function handleUpdateParam(key: string, value: string): Promise<SystemParam> {
  "use server";
  const token = await getAuthToken();
  return updateSystemParam(token, key, value);
}

export default async function ParametrosPage() {
  let initialData: SystemParam[] = [];
  try {
    initialData = await fetchParams();
  } catch {
    // endpoint indisponível — renderiza a página com lista vazia
  }

  return (
    <ParametrosView
      initialParams={initialData}
      updateParam={handleUpdateParam}
    />
  );
}
