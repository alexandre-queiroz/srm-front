"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Icon from "@/components/ui/icon";
import Badge from "@/components/ui/badge";
import KPI from "@/components/ui/kpi";
import Card from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { SimpleBarChart } from "@/components/ui/chart";
import type { DashboardData, RecentBatch } from "@/types";

const ASSIGNOR_COLORS = ["bg-brand-blue-500", "bg-brand-blue-800", "bg-brand-orange-500", "bg-srm-success-500", "bg-srm-danger-500"];

const STATUS_BADGE_COLOR: Record<string, "neutral" | "brand" | "success" | "danger"> = {
  pending: "neutral",
  queued: "brand",
  approved: "success",
  rejected: "danger",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendente",
  queued: "Em fila",
  approved: "Aprovado",
  rejected: "Rejeitado",
};

function formatBRL(value: string): string {
  return Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

function formatRate(rate: string): string {
  return Number(rate).toFixed(2) + "%";
}

const recentBatchColumns = [
  {
    id: "id",
    header: "ID",
    cell: ({ row }: { row: RecentBatch }) => <span className="text-fg-2 font-mono text-xs">{row.id.slice(0, 8)}</span>,
  },
  {
    id: "assignor_name",
    header: "Cedente",
    cell: ({ row }: { row: RecentBatch }) => (
      <span className="text-fg-1 block max-w-[160px] truncate text-sm font-medium">{row.assignor_name}</span>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }: { row: RecentBatch }) => {
      const color = STATUS_BADGE_COLOR[row.status] ?? "neutral";
      const label = STATUS_LABEL[row.status] ?? row.status;
      return (
        <Badge color={color} size="sm" className="text-[10px] font-bold">
          {label.toUpperCase()}
        </Badge>
      );
    },
  },
  {
    id: "total_face_value_brl",
    header: "Vlr. Face",
    cell: ({ row }: { row: RecentBatch }) => (
      <span className="text-fg-1 text-xs tabular-nums">R$ {formatBRL(row.total_face_value_brl)}</span>
    ),
  },
  {
    id: "total_present_value_brl",
    header: "Vlr. Líquido",
    cell: ({ row }: { row: RecentBatch }) => (
      <span className="text-brand-blue-600 text-xs font-semibold tabular-nums">R$ {formatBRL(row.total_present_value_brl)}</span>
    ),
  },
  {
    id: "created_at",
    header: "Criado em",
    cell: ({ row }: { row: RecentBatch }) => (
      <span className="text-fg-3 text-xs">{new Date(row.created_at).toLocaleDateString("pt-BR")}</span>
    ),
  },
];

interface DashboardViewProps {
  data: DashboardData;
}

export default function DashboardView({ data }: DashboardViewProps) {
  const { kpis, daily_volume, top_assignors, recent_batches } = data;

  const chartData = daily_volume.map((d) => ({
    label: d.date,
    value: Number(d.volume_brl),
  }));

  const currentMonthLabel = new Date().toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="h-full overflow-x-hidden overflow-y-auto">
      <div className="mx-auto max-w-[1600px] space-y-4 px-1 pb-12">
        {/* Welcome Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="t-h3 text-fg-1 !text-2xl tracking-tight">Dashboard</h1>
            <p className="t-body !text-fg-3 mt-0.5">
              Resumo das operações de <span className="text-fg-2 font-bold capitalize">{currentMonthLabel}</span>.
            </p>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <KPI label="Total Antecipado (Mês)" value={`R$ ${formatBRL(kpis.total_anticipated_brl)}`} />
          <KPI label="Recebíveis Disponíveis" value={kpis.total_available_receivables.toLocaleString("pt-BR")} />
          <KPI label="Taxa Média" value={formatRate(kpis.average_rate_pct)} />
          <KPI label="Lotes Aprovados (Mês)" value={kpis.total_approved_batches.toLocaleString("pt-BR")} />
        </div>

        {/* Chart */}
        <Card className="p-6">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="t-h4 flex items-center gap-2">
              <Icon name="trending-up" size={18} className="text-brand-blue-500" />
              Volume de Antecipações (30 dias)
            </h3>
            <div className="text-fg-3 flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
              <span className="bg-brand-blue-500 h-2 w-2 rounded-full" />
              Valor presente (BRL)
            </div>
          </div>
          <SimpleBarChart data={chartData} className="h-44" />
        </Card>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
          {/* Recent Batches Table */}
          <div className="flex flex-col lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="t-h4 flex items-center gap-2">
                <Icon name="file-text" size={18} className="text-brand-blue-500" />
                Lotes Recentes
              </h3>
            </div>
            <div className="flex-1">
              <DataTable
                columns={recentBatchColumns}
                data={recent_batches}
                totalItems={recent_batches.length}
                pageSize={8}
                pageIndex={0}
                onPageChange={() => {}}
                onPageSizeChange={() => {}}
                onFilterChange={() => {}}
              />
            </div>
          </div>

          {/* Top Assignors Sidebar */}
          <div className="flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="t-h4 flex items-center gap-2">
                <Icon name="award" size={18} className="text-brand-blue-500" />
                Maiores Antecipadores
              </h3>
            </div>

            <div className="flex flex-1 flex-col">
              <Card className="divide-border-subtle flex-1 divide-y overflow-hidden">
                {top_assignors.length === 0 && (
                  <div className="flex h-full items-center justify-center p-8">
                    <p className="text-fg-3 text-xs">Sem dados disponíveis.</p>
                  </div>
                )}
                {top_assignors.map((assignor, index) => (
                  <div
                    key={assignor.assignor_name}
                    className="hover:bg-surface-alt/50 flex flex-col justify-center p-3.5 transition-colors"
                  >
                    <div className="mb-1.5 flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white shadow-sm",
                          ASSIGNOR_COLORS[index % ASSIGNOR_COLORS.length],
                        )}
                      >
                        {assignor.assignor_name.substring(0, 2).toUpperCase()}
                      </div>
                      <p className="text-fg-1 truncate text-sm font-bold">{assignor.assignor_name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pl-11">
                      <div className="flex flex-col">
                        <span className="text-fg-3 text-[8px] font-bold tracking-widest uppercase">Antecipado</span>
                        <span className="text-brand-blue-600 text-xs font-bold">R$ {formatBRL(assignor.total_anticipated_brl)}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-fg-3 text-[8px] font-bold tracking-widest uppercase">Lotes</span>
                        <span className="text-fg-1 text-xs font-bold">{assignor.total_batches}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </Card>
              {/* Spacer to match DataTable pagination height */}
              <div className="h-[52px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
