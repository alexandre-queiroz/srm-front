"use client";

import React, { useState, useTransition } from "react";
import { motion } from "framer-motion";
import Icon from "@/components/ui/icon";
import Button from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Card from "@/components/ui/card";
import Kpi from "@/components/ui/kpi";
import Badge from "@/components/ui/badge";
import type { SettlementBatchReport, SettlementBatchItem, SettlementTransactionItem } from "@/types";
import { toast } from "sonner";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtBRL(v: string | number): string {
  return `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtPct(v: string | number): string {
  return `${Number(v).toFixed(4)}%`;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR");
}

function fmtCNPJ(cnpj: string): string {
  // 00.000.000/0000-00
  const d = cnpj.replace(/\D/g, "");
  if (d.length !== 14) return cnpj;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

// ─── Transaction columns ──────────────────────────────────────────────────────

const txnColumns = [
  {
    id: "invoice_key",
    header: "Chave NF-e",
    cell: ({ row }: { row: SettlementTransactionItem }) => (
      <span className="font-mono text-xs text-fg-2" title={row.invoice_key}>
        {row.invoice_key.slice(0, 22)}…
      </span>
    ),
  },
  {
    id: "installment_number",
    header: "Parcela",
    cell: ({ row }: { row: SettlementTransactionItem }) => (
      <span className="font-medium">{row.installment_number}</span>
    ),
  },
  {
    id: "drawee_name",
    header: "Sacado",
    cell: ({ row }: { row: SettlementTransactionItem }) => (
      <span title={fmtCNPJ(row.drawee_cnpj)}>{row.drawee_name}</span>
    ),
  },
  {
    id: "instrument_currency",
    header: "Moeda",
    cell: ({ row }: { row: SettlementTransactionItem }) => (
      <Badge color="neutral" variant="soft" size="sm">
        {row.instrument_currency}
      </Badge>
    ),
  },
  {
    id: "face_value",
    header: "Vlr. Face",
    cell: ({ row }: { row: SettlementTransactionItem }) =>
      Number(row.face_value).toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
  },
  {
    id: "face_value_brl",
    header: "Vlr. Face BRL",
    cell: ({ row }: { row: SettlementTransactionItem }) =>
      row.instrument_currency !== "BRL" ? fmtBRL(row.face_value_brl) : "—",
  },
  {
    id: "present_value",
    header: "Vlr. Líquido",
    cell: ({ row }: { row: SettlementTransactionItem }) => fmtBRL(row.present_value),
  },
  {
    id: "exchange_rate_used",
    header: "Câmbio",
    cell: ({ row }: { row: SettlementTransactionItem }) =>
      row.exchange_rate_used != null ? Number(row.exchange_rate_used).toFixed(4) : "—",
  },
  {
    id: "term_days",
    header: "Prazo",
    cell: ({ row }: { row: SettlementTransactionItem }) => `${row.term_days}d`,
  },
  {
    id: "base_rate_used",
    header: "Taxa Base",
    cell: ({ row }: { row: SettlementTransactionItem }) => fmtPct(row.base_rate_used),
  },
  {
    id: "spread_used",
    header: "Spread",
    cell: ({ row }: { row: SettlementTransactionItem }) => fmtPct(row.spread_used),
  },
  {
    id: "liquidated_at",
    header: "Liquidado em",
    cell: ({ row }: { row: SettlementTransactionItem }) => fmtDate(row.liquidated_at),
  },
];

// ─── Batch Card ───────────────────────────────────────────────────────────────

interface BatchCardProps {
  batch: SettlementBatchItem;
  defaultOpen: boolean;
}

function BatchCard({ batch, defaultOpen }: BatchCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  const chips = [
    { label: "Títulos", value: String(batch.total_receivables) },
    { label: "Face BRL", value: fmtBRL(batch.total_face_brl) },
    { label: "Líquido BRL", value: fmtBRL(batch.total_present_brl) },
    { label: "Desconto", value: fmtBRL(batch.total_discount_brl) },
    { label: "Taxa Efetiva", value: fmtPct(batch.avg_rate_pct) },
  ];

  return (
    <Card className="overflow-hidden">
      {/* Batch header */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface-alt/40 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-fg-1 text-sm truncate">{batch.assignor_name}</span>
              <span className="text-fg-3 text-xs font-mono">{fmtCNPJ(batch.assignor_cnpj)}</span>
              <Badge color="success" variant="soft" size="sm" dot>
                LIQUIDADO
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              {chips.map((c) => (
                <span key={c.label} className="flex items-center gap-1 text-xs">
                  <span className="text-fg-3">{c.label}:</span>
                  <span className="font-medium text-fg-1">{c.value}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-fg-3">{fmtDate(batch.processed_at)}</span>
          <Icon
            name="chevronDown"
            size={16}
            stroke={2}
            className={`text-fg-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Collapsible transaction table */}
      {open && (
        <div className="border-t border-border-default px-5 pb-5 pt-4">
          <DataTable
            columns={txnColumns}
            data={batch.transactions}
            totalItems={batch.transactions.length}
            pageSize={batch.transactions.length || 1}
            pageIndex={0}
            onPageChange={() => {}}
            onPageSizeChange={() => {}}
            onFilterChange={() => {}}
            minWidth="min-w-[1100px]"
          />
        </div>
      )}
    </Card>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

interface Props {
  initialData: SettlementBatchReport;
  fetchReport: (params?: Parameters<typeof import("@/repositories/report-repository").getSettlementBatchReport>[1]) => Promise<SettlementBatchReport>;
}

export function RelatoriosView({ initialData, fetchReport }: Props) {
  const [data, setData] = useState<SettlementBatchReport>(initialData);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isPending, startTransition] = useTransition();

  const load = (params?: { page?: number; start_date?: string; end_date?: string }) => {
    const resolvedStart = params?.start_date ?? (startDate || undefined);
    const resolvedEnd   = params?.end_date   ?? (endDate   || undefined);
    startTransition(async () => {
      try {
        const result = await fetchReport({
          page: params?.page ?? 1,
          start_date: resolvedStart ? `${resolvedStart}T00:00:00` : undefined,
          end_date:   resolvedEnd   ? `${resolvedEnd}T23:59:59`   : undefined,
        });
        setData(result);
      } catch {
        toast.error("Erro ao carregar relatório.");
      }
    });
  };

  const handleApply = () => load({ page: 1, start_date: startDate || undefined, end_date: endDate || undefined });

  const handleExportCSV = () => {
    const rows: string[][] = [
      ["Lote", "Cedente", "CNPJ Cedente", "Processado em", "NF-e", "Parcela", "Sacado", "CNPJ Sacado",
       "Moeda", "Vlr. Face", "Vlr. Face BRL", "Vlr. Líquido", "Câmbio", "Prazo (d)", "Taxa Base", "Spread", "Liquidado em"],
    ];
    for (const batch of data.items) {
      for (const t of batch.transactions) {
        rows.push([
          batch.batch_id,
          batch.assignor_name,
          fmtCNPJ(batch.assignor_cnpj),
          fmtDate(batch.processed_at),
          t.invoice_key,
          t.installment_number,
          t.drawee_name,
          fmtCNPJ(t.drawee_cnpj),
          t.instrument_currency,
          t.face_value,
          t.face_value_brl,
          t.present_value,
          t.exchange_rate_used ?? "",
          String(t.term_days),
          t.base_rate_used,
          t.spread_used,
          fmtDate(t.liquidated_at),
        ]);
      }
    }
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `extrato_liquidacao${startDate ? `_${startDate}` : ""}${endDate ? `_${endDate}` : ""}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const { summary, items, page, total_pages } = data;

  const kpis = [
    { label: "Total Lotes", value: String(summary.total_batches) },
    { label: "Total Títulos", value: String(summary.total_receivables) },
    { label: "Total Face (BRL)", value: fmtBRL(summary.total_face_brl) },
    { label: "Total Líquido (BRL)", value: fmtBRL(summary.total_present_brl) },
  ];

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden">
    <div className="flex flex-col gap-6 pb-12">
      {/* Page header */}
      <div className="flex items-end justify-between shrink-0">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="t-h3 !text-2xl text-fg-1 tracking-tight">Extrato de Liquidação</h1>
          <p className="t-body !text-fg-3 mt-0.5">Lotes aprovados com seus títulos liquidados.</p>
        </motion.div>
        <div className="flex items-center gap-2">
          <Button variant="outline" color="neutral" icon="download" onClick={handleExportCSV} disabled={items.length === 0}>
            Exportar CSV
          </Button>
          <Button icon="refresh-cw" onClick={() => load({ page })} isLoading={isPending}>
            Atualizar
          </Button>
        </div>
      </div>

      {/* Date range filter */}
      <div className="flex items-end gap-3 shrink-0">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-fg-3 uppercase tracking-wider">De</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-9 rounded-xl border-[0.5px] border-border-default bg-white px-3 text-[13px] text-fg-1 outline-none focus:border-brand-blue-500 transition-colors shadow-xs"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-fg-3 uppercase tracking-wider">Até</label>
          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-9 rounded-xl border-[0.5px] border-border-default bg-white px-3 text-[13px] text-fg-1 outline-none focus:border-brand-blue-500 transition-colors shadow-xs"
          />
        </div>
        <Button onClick={handleApply} isLoading={isPending} icon="search" className="h-9 px-4 text-xs font-bold">
          Filtrar
        </Button>
        {(startDate || endDate) && (
          <Button
            variant="outline"
            color="neutral"
            className="h-9 px-3 text-xs"
            onClick={() => { setStartDate(""); setEndDate(""); load({ page: 1, start_date: undefined, end_date: undefined }); }}
          >
            Limpar
          </Button>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        {kpis.map((k) => (
          <Kpi key={k.label} label={k.label} value={k.value} />
        ))}
      </div>

      {/* Batch list */}
      <div className="flex flex-col gap-3 flex-1">
        {items.length === 0 ? (
          <Card padding={32} className="items-center justify-center text-fg-3 text-sm">
            Nenhum lote liquidado encontrado.
          </Card>
        ) : (
          items.map((batch, idx) => (
            <BatchCard key={batch.batch_id} batch={batch} defaultOpen={idx === 0} />
          ))
        )}
      </div>

      {/* Batch-level pagination */}
      {total_pages > 1 && (
        <div className="flex items-center justify-end gap-2 shrink-0 pt-1">
          <Button
            variant="outline"
            color="neutral"
            onClick={() => load({ page: page - 1 })}
            disabled={page <= 1 || isPending}
            className="h-8 w-8 p-0 min-w-0 rounded-full"
          >
            <Icon name="arrowLeft" size={14} />
          </Button>
          <span className="text-[13px] font-medium text-fg-1 px-3">
            Página {page} de {total_pages}
          </span>
          <Button
            variant="outline"
            color="neutral"
            onClick={() => load({ page: page + 1 })}
            disabled={page >= total_pages || isPending}
            className="h-8 w-8 p-0 min-w-0 rounded-full"
          >
            <Icon name="arrowRight" size={14} />
          </Button>
        </div>
      )}
    </div>
    </div>
  );
}
