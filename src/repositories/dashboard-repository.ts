import { apiFetchJson } from "@/lib/api-client";
import type { DashboardData } from "@/types";

export async function getDashboard(token: string): Promise<DashboardData> {
  return apiFetchJson<DashboardData>("/v1/dashboard", {}, token);
}
