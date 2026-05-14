"use client";

import React, { useState, useTransition, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Icon from "@/components/ui/icon";
import Button from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Card from "@/components/ui/card";
import Kpi from "@/components/ui/kpi";
import Badge from "@/components/ui/badge";
import { useDebounce } from "@/hooks/use-debounce";
import type { SettlementBatchReport, SettlementBatchItem, SettlementTransactionItem, Company } from "@/types";
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
      <span className="text-fg-2 font-mono text-xs" title={row.invoice_key}>
        {row.invoice_key.slice(0, 22)}…
      </span>
    ),
  },
  {
    id: "installment_number",
    header: "Parcela",
    cell: ({ row }: { row: SettlementTransactionItem }) => <span className="font-medium">{row.installment_number}</span>,
  },
  {
    id: "drawee_name",
    header: "Sacado",
    cell: ({ row }: { row: SettlementTransactionItem }) => <span title={fmtCNPJ(row.drawee_cnpj)}>{row.drawee_name}</span>,
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
    cell: ({ row }: { row: SettlementTransactionItem }) => Number(row.face_value).toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
  },
  {
    id: "face_value_brl",
    header: "Vlr. Face BRL",
    cell: ({ row }: { row: SettlementTransactionItem }) => (row.instrument_currency !== "BRL" ? fmtBRL(row.face_value_brl) : "—"),
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
        className="hover:bg-surface-alt/40 flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-fg-1 truncate text-sm font-semibold">{batch.assignor_name}</span>
              <span className="text-fg-3 font-mono text-xs">{fmtCNPJ(batch.assignor_cnpj)}</span>
              <Badge color="success" variant="soft" size="sm" dot>
                LIQUIDADO
              </Badge>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              {chips.map((c) => (
                <span key={c.label} className="flex items-center gap-1 text-xs">
                  <span className="text-fg-3">{c.label}:</span>
                  <span className="text-fg-1 font-medium">{c.value}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-fg-3 text-xs">{fmtDate(batch.processed_at)}</span>
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
        <div className="border-border-default border-t px-5 pt-4 pb-5">
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
  fetchReport: (
    params?: Parameters<typeof import("@/repositories/report-repository").getSettlementBatchReport>[1],
  ) => Promise<SettlementBatchReport>;
  fetchCompanies: (social_reason?: string) => Promise<Company[]>;
}

export function RelatoriosView({ initialData, fetchReport, fetchCompanies }: Props) {
  const [data, setData] = useState<SettlementBatchReport>(initialData);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [assignorId, setAssignorId] = useState<string | undefined>();
  const [assignorName, setAssignorName] = useState("");
  const [assignorSearch, setAssignorSearch] = useState("");
  const [assignorResults, setAssignorResults] = useState<Company[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const assignorRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(assignorSearch, 300);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    if (!debouncedSearch.trim()) {
      Promise.resolve().then(() => {
        if (!cancelled) setAssignorResults([]);
      });
      return () => {
        cancelled = true;
      };
    }
    Promise.resolve().then(() => {
      if (cancelled) return;
      setIsSearching(true);
      fetchCompanies(debouncedSearch)
        .then((r) => {
          if (!cancelled) {
            setAssignorResults(r);
            setDropdownOpen(true);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (!cancelled) setIsSearching(false);
        });
    });
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, fetchCompanies]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (assignorRef.current && !assignorRef.current.contains(e.target as Node)) setDropdownOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const selectAssignor = (company: Company) => {
    setAssignorId(company.id);
    setAssignorName(company.social_reason);
    setAssignorSearch(company.social_reason);
    setDropdownOpen(false);
  };

  const clearAssignor = () => {
    setAssignorId(undefined);
    setAssignorName("");
    setAssignorSearch("");
    setAssignorResults([]);
  };

  const load = (params?: { page?: number; start_date?: string; end_date?: string; assignor_id?: string }) => {
    const resolvedStart = params?.start_date ?? (startDate || undefined);
    const resolvedEnd = params?.end_date ?? (endDate || undefined);
    const resolvedAssignorId = params?.assignor_id ?? (assignorId || undefined);
    startTransition(async () => {
      try {
        const result = await fetchReport({
          page: params?.page ?? 1,
          start_date: resolvedStart ? `${resolvedStart}T00:00:00` : undefined,
          end_date: resolvedEnd ? `${resolvedEnd}T23:59:59` : undefined,
          assignor_id: resolvedAssignorId,
        });
        setData(result);
      } catch {
        toast.error("Erro ao carregar relatório.");
      }
    });
  };

  const handleApply = () => load({ page: 1, start_date: startDate || undefined, end_date: endDate || undefined, assignor_id: assignorId });

  const handleExportCSV = () => {
    const rows: string[][] = [
      [
        "Lote",
        "Cedente",
        "CNPJ Cedente",
        "Processado em",
        "NF-e",
        "Parcela",
        "Sacado",
        "CNPJ Sacado",
        "Moeda",
        "Vlr. Face",
        "Vlr. Face BRL",
        "Vlr. Líquido",
        "Câmbio",
        "Prazo (d)",
        "Taxa Base",
        "Spread",
        "Liquidado em",
      ],
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
    <div className="h-full overflow-x-hidden overflow-y-auto">
      <div className="flex flex-col gap-6 pb-12">
        {/* Page header */}
        <div className="flex shrink-0 items-end justify-between">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="t-h3 text-fg-1 !text-2xl tracking-tight">Extrato de Liquidação</h1>
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
        <div className="flex shrink-0 items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-fg-3 text-[11px] font-semibold tracking-wider uppercase">De</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border-border-default text-fg-1 focus:border-brand-blue-500 h-9 rounded-xl border-[0.5px] bg-white px-3 text-[13px] shadow-xs transition-colors outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-fg-3 text-[11px] font-semibold tracking-wider uppercase">Até</label>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              className="border-border-default text-fg-1 focus:border-brand-blue-500 h-9 rounded-xl border-[0.5px] bg-white px-3 text-[13px] shadow-xs transition-colors outline-none"
            />
          </div>
          <div className="relative flex flex-col gap-1" ref={assignorRef}>
            <label className="text-fg-3 text-[11px] font-semibold tracking-wider uppercase">Cedente</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar cedente..."
                value={assignorSearch}
                onChange={(e) => {
                  setAssignorSearch(e.target.value);
                  if (!e.target.value) clearAssignor();
                }}
                onFocus={() => {
                  if (assignorResults.length > 0) setDropdownOpen(true);
                }}
                className="border-border-default text-fg-1 focus:border-brand-blue-500 h-9 w-52 rounded-xl border-[0.5px] bg-white pr-8 pl-3 text-[13px] shadow-xs transition-colors outline-none"
              />
              {isSearching ? (
                <Icon name="loader" size={14} className="text-fg-3 absolute top-1/2 right-2.5 -translate-y-1/2 animate-spin" />
              ) : assignorId ? (
                <button
                  type="button"
                  onClick={clearAssignor}
                  className="text-fg-3 hover:text-fg-1 absolute top-1/2 right-2.5 -translate-y-1/2"
                >
                  <Icon name="x" size={14} />
                </button>
              ) : null}
              {dropdownOpen && assignorResults.length > 0 && (
                <div className="border-border-default absolute top-full left-0 z-50 mt-1 w-72 overflow-hidden rounded-xl border-[0.5px] bg-white shadow-lg">
                  {assignorResults.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectAssignor(c)}
                      className="hover:bg-surface-alt flex w-full flex-col px-4 py-2.5 text-left text-sm transition-colors"
                    >
                      <span className="text-fg-1 truncate font-medium">{c.social_reason}</span>
                      <span className="text-fg-3 font-mono text-xs">
                        {c.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button onClick={handleApply} isLoading={isPending} icon="search" className="h-9 self-end px-4 text-xs font-bold">
            Filtrar
          </Button>
          {(startDate || endDate || assignorId) && (
            <Button
              variant="outline"
              color="neutral"
              className="h-9 self-end px-3 text-xs"
              onClick={() => {
                setStartDate("");
                setEndDate("");
                clearAssignor();
                load({ page: 1, start_date: undefined, end_date: undefined, assignor_id: undefined });
              }}
            >
              Limpar
            </Button>
          )}
        </div>

        {/* KPI cards */}
        <div className="grid shrink-0 grid-cols-1 gap-4 md:grid-cols-4">
          {kpis.map((k) => (
            <Kpi key={k.label} label={k.label} value={k.value} />
          ))}
        </div>

        {/* Batch list */}
        <div className="flex flex-1 flex-col gap-3">
          {items.length === 0 ? (
            <Card padding={32} className="text-fg-3 items-center justify-center text-sm">
              Nenhum lote liquidado encontrado.
            </Card>
          ) : (
            items.map((batch, idx) => <BatchCard key={batch.batch_id} batch={batch} defaultOpen={idx === 0} />)
          )}
        </div>

        {/* Batch-level pagination */}
        {total_pages > 1 && (
          <div className="flex shrink-0 items-center justify-end gap-2 pt-1">
            <Button
              variant="outline"
              color="neutral"
              onClick={() => load({ page: page - 1 })}
              disabled={page <= 1 || isPending}
              className="h-8 w-8 min-w-0 rounded-full p-0"
            >
              <Icon name="arrowLeft" size={14} />
            </Button>
            <span className="text-fg-1 px-3 text-[13px] font-medium">
              Página {page} de {total_pages}
            </span>
            <Button
              variant="outline"
              color="neutral"
              onClick={() => load({ page: page + 1 })}
              disabled={page >= total_pages || isPending}
              className="h-8 w-8 min-w-0 rounded-full p-0"
            >
              <Icon name="arrowRight" size={14} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
