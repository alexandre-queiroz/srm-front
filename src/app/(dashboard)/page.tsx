import { getAuthToken } from "@/lib/server-auth";
import { safeCall } from "@/lib/safe-call";
import { getDashboard } from "@/repositories/dashboard-repository";
import type { DashboardData } from "@/types";
import DashboardView from "./_view";

const EMPTY_DASHBOARD: DashboardData = {
  kpis: {
    total_anticipated_brl: "0",
    total_available_receivables: 0,
    average_rate_pct: "0",
    total_approved_batches: 0,
  },
  daily_volume: [],
  top_assignors: [],
  recent_batches: [],
};

export default async function DashboardPage() {
  const token = await getAuthToken();
  const data = await safeCall(() => getDashboard(token), EMPTY_DASHBOARD);

  return <DashboardView data={data} />;
}
