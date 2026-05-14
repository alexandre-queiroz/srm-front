import { getAuthToken } from "@/lib/server-auth";
import { safeCall } from "@/lib/safe-call";
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
  const initialData = await safeCall(() => fetchParams(), [] as SystemParam[]);

  return <ParametrosView initialParams={initialData} updateParam={handleUpdateParam} />;
}
