"use client";

import React, { useState, useCallback, useTransition, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import Icon from "@/components/ui/icon";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from "@/components/ui/modal";
import type { Batch, BatchDetail, BatchPreview, BatchPreviewItem, Company, Receivable, ExchangeRate } from "@/types";

// ─── Preview item card ────────────────────────────────────────────────────────

interface PreviewItemCardProps {
  item: BatchPreviewItem;
  face: number;
  present: number;
  discount: number;
  baseDaily: number | null;
  spreadDaily: number | null;
  totalDaily: number | null;
  fmtPct: (r: number) => string;
  formatCurrency: (v: string | number, currency: string) => string;
  exchangeRate?: number | null;
}

function PreviewItemCard({ item, face, present, discount, baseDaily, spreadDaily, totalDaily, fmtPct, formatCurrency, exchangeRate }: PreviewItemCardProps) {
  // 1. Normalize values. In approved batches, 'present' might already be in BRL 
  // while 'face' is in the original currency (e.g. USD).
  const nFace = Number(face);
  let nPresent = Number(present);
  const nExchange = Number(exchangeRate || 1);

  // Heuristic: if present value is much larger than face value and we have an exchange rate,
  // it means 'present' is likely the BRL settlement value.
  const isPresentAlreadyBRL = item.currency_code !== "BRL" && nPresent > nFace * 1.5;
  
  if (isPresentAlreadyBRL && nExchange > 0) {
    nPresent = nPresent / nExchange;
  }

  const nDiscount = nFace - nPresent;

  // 2. Calculate proportional discounts based on daily rates
  const baseDiscount = totalDaily != null && totalDaily > 0 && baseDaily != null
    ? nDiscount * (baseDaily / totalDaily) : 0;
  const spreadDiscount = totalDaily != null && totalDaily > 0 && spreadDaily != null
    ? nDiscount * (spreadDaily / totalDaily) : 0;

  const rows: { label: string; sub?: string; value: string; muted?: boolean; danger?: boolean; bold?: boolean; highlight?: boolean }[] = [
    { label: "Valor Bruto", value: formatCurrency(nFace, item.currency_code), bold: true },
  ];

  if (item.currency_code !== "BRL" && nExchange > 1) {
    rows.push({
      label: "Câmbio",
      sub: `@ ${nExchange.toFixed(4)}`,
      value: formatCurrency(nFace * nExchange, "BRL"),
      highlight: true,
    });
  }

  rows.push(
    { 
      label: "Taxa Base", 
      sub: baseDaily != null ? `${fmtPct(baseDaily)}/d` : undefined, 
      value: `- ${formatCurrency(Math.abs(baseDiscount), item.currency_code)}`, 
      danger: true 
    },
    { 
      label: "Spread", 
      sub: spreadDaily != null ? `${fmtPct(spreadDaily)}/d` : undefined, 
      value: `- ${formatCurrency(Math.abs(spreadDiscount), item.currency_code)}`, 
      danger: true 
    },
    { 
      label: "Desconto Total", 
      sub: totalDaily != null ? `${fmtPct(totalDaily)}/d` : undefined, 
      value: `- ${formatCurrency(Math.abs(nDiscount), item.currency_code)}`, 
      danger: true, 
      muted: true 
    },
  );

  return (
    <div className="border border-border-default rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="px-4 py-3 border-b border-border-subtle bg-surface-alt/10 flex justify-between items-start">
        <div className="min-w-0">
          <p className="text-sm font-bold text-fg-1 truncate">{item.drawee.social_reason}</p>
          <p className="text-[10px] text-fg-3 uppercase tracking-wider font-semibold">
            Parcela {item.installment_number} · {item.term_days} dias
          </p>
        </div>
        <Badge variant="outline" color="neutral" className="font-mono text-[9px] px-1.5">{item.invoice_key.slice(-8)}</Badge>
      </div>

      <div className="px-4 py-3 space-y-2">
        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          {rows.map(({ label, sub, value, danger, muted, bold, highlight }) => (
            <React.Fragment key={label}>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-[11px] ${bold ? "font-bold text-fg-1" : "text-fg-3"}`}>{label}</span>
                {sub && <span className="text-[9px] text-fg-4 font-mono">{sub}</span>}
              </div>
              <div className="text-right">
                <span className={`text-[11px] font-semibold tabular-nums ${danger ? "text-srm-danger-600" : highlight ? "text-brand-blue-600" : "text-fg-1"}`}>
                  {value}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="mt-2 pt-2 border-t border-border-subtle flex justify-between items-center">
          <span className="text-xs font-bold text-fg-1">Líquido a Receber</span>
          <div className="text-right">
            <p className="text-sm font-bold text-brand-blue-700 tabular-nums">
              {formatCurrency(nPresent, item.currency_code)}
            </p>
            {item.currency_code !== "BRL" && nExchange > 1 && (
              <p className="text-[10px] font-bold text-brand-blue-500/80">
                {formatCurrency(nPresent * nExchange, "BRL")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Wizard stepper ───────────────────────────────────────────────────────────

type WizardStep = "assignor" | "receivables" | "preview" | "success";

const WIZARD_STEPS: { id: WizardStep; label: string }[] = [
  { id: "assignor", label: "Cedente" },
  { id: "receivables", label: "Recebíveis" },
  { id: "preview", label: "Simulação" },
];

function WizardStepper({ step }: { step: WizardStep }) {
  const currentIndex = WIZARD_STEPS.findIndex((s) => s.id === step);
  return (
    <div className="flex items-center px-6 pt-14 pb-1">
      {WIZARD_STEPS.map((s, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <React.Fragment key={s.id}>
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                  ${done ? "bg-brand-blue-500 text-white" : active ? "bg-brand-blue-50 text-brand-blue-600 ring-2 ring-brand-blue-200" : "bg-surface-alt text-fg-disabled"}`}
              >
                {done ? <Icon name="check" size={12} stroke={2.5} /> : i + 1}
              </div>
              <span className={`text-sm font-medium transition-colors ${active ? "text-fg-1" : done ? "text-brand-blue-500" : "text-fg-disabled"}`}>
                {s.label}
              </span>
            </div>
            {i < WIZARD_STEPS.length - 1 && (
              <div className={`flex-1 mx-3 h-px transition-colors ${i < currentIndex ? "bg-brand-blue-300" : "bg-border-default"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Assignor card ────────────────────────────────────────────────────────────

function AssignorCard({ company, selected, onClick }: { company: Company; selected: boolean; onClick: () => void }) {
  const cnpj = company.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  const count = company.available_receivables_count;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all cursor-pointer
        ${selected
          ? "border-brand-blue-400 bg-brand-blue-50/60 ring-2 ring-brand-blue-200"
          : "border-border-subtle hover:border-border-strong hover:bg-surface-alt/40"}`}
    >
      <div className="min-w-0">
        <p className={`text-sm font-semibold truncate ${selected ? "text-brand-blue-700" : "text-fg-1"}`}>
          {company.fantasy_name ?? company.social_reason}
        </p>
        {company.fantasy_name && (
          <p className="text-xs text-fg-3 truncate">{company.social_reason}</p>
        )}
        <p className="text-xs text-fg-3 mt-0.5">{cnpj}</p>
      </div>
      <div className="ml-4 shrink-0">
        <Badge color={count > 0 ? "brand" : "neutral"} size="sm">
          {count} {count === 1 ? "título" : "títulos"}
        </Badge>
      </div>
    </button>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BATCH_STATUS_COLOR: Record<string, "success" | "warning" | "danger" | "neutral" | "brand"> = {
  approved: "success",
  queued: "warning",
  pending: "brand",
  rejected: "danger",
};

const BATCH_STATUS_LABEL: Record<string, string> = {
  approved: "Aprovado",
  queued: "Na Fila",
  pending: "Pendente",
  rejected: "Rejeitado",
};

const batchColumns = [
  { id: "id", header: "ID", cell: ({ row }: { row: Batch }) => row.id },
  { id: "assignor", header: "Cedente", enableColumnFilter: true, cell: ({ row }: { row: Batch }) => row.assignor.social_reason },
  { id: "total_receivables", header: "Títulos", cell: ({ row }: { row: Batch }) => row.total_receivables },
  {
    id: "total_face_value_brl",
    header: "Vlr. Bruto (BRL)",
    cell: ({ row }: { row: Batch }) => {
      const val = Number(row.total_face_value_brl);
      return isNaN(val) || val === 0 ? "—" : `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    },
  },
  {
    id: "total_present_value_brl",
    header: "Vlr. Líquido (BRL)",
    cell: ({ row }: { row: Batch }) => {
      const val = Number(row.total_present_value_brl);
      return val > 0 && !isNaN(val)
        ? `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
        : "—";
    },
  },
  {
    id: "taxa",
    header: "Taxa",
    cell: ({ row }: { row: Batch }) => {
      const face = Number(row.total_face_value_brl);
      const present = Number(row.total_present_value_brl);
      if (!face || !present || isNaN(face) || isNaN(present)) return "—";
      return `${(((face - present) / face) * 100).toFixed(2)}%`;
    },
  },
  {
    id: "desconto",
    header: "Desconto (BRL)",
    cell: ({ row }: { row: Batch }) => {
      const face = Number(row.total_face_value_brl);
      const present = Number(row.total_present_value_brl);
      if (!face || !present || isNaN(face) || isNaN(present)) return "—";
      const discount = face - present;
      return `- R$ ${discount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    },
  },
  {
    id: "status",
    header: "Status",
    enableColumnFilter: true,
    cell: ({ row }: { row: Batch }) => (
      <Badge color={BATCH_STATUS_COLOR[row.status] ?? "neutral"} size="sm">
        {BATCH_STATUS_LABEL[row.status] ?? row.status}
      </Badge>
    ),
  },
  {
    id: "created_at",
    header: "Criado em",
    cell: ({ row }: { row: Batch }) =>
      new Date(row.created_at).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
  },
  {
    id: "processed_at",
    header: "Processado em",
    cell: ({ row }: { row: Batch }) =>
      row.status === "approved"
        ? new Date(row.updated_at).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
        : "—",
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  initialData: Batch[];
  fetchBatches: (params: { page: number; pageSize: number; status?: string; assignor_id?: string }) => Promise<Batch[]>;
  fetchBatchDetail: (batchId: string) => Promise<BatchDetail>;
  fetchCompanies: (query?: string) => Promise<Company[]>;
  fetchReceivablesByAssignor: (assignorId: string, page: number, pageSize: number) => Promise<Receivable[]>;
  simulateBatch: (assignorId: string, receivableIds: string[]) => Promise<BatchPreview>;
  createAndQueueBatch: (assignorId: string, receivableIds: string[]) => Promise<Batch>;
  queueBatchAction: (batchId: string, expectedVersion: number) => Promise<Batch>;
  fetchCurrentRate: () => Promise<ExchangeRate>;
}

// ─── Main view ────────────────────────────────────────────────────────────────

export function LotesView({
  initialData,
  fetchBatches,
  fetchBatchDetail,
  fetchCompanies,
  fetchReceivablesByAssignor,
  simulateBatch,
  createAndQueueBatch,
  queueBatchAction,
  fetchCurrentRate,
}: Props) {
  const [data, setData] = useState(initialData);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [tableFilters, setTableFilters] = useState<Record<string, string>>({});
  const [, startTransition] = useTransition();

  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchCurrentRate()
      .then(rate => {
        if (mounted && rate?.rate) {
          console.log("Exchange rate loaded:", rate.rate);
          setExchangeRate(Number(rate.rate));
        }
      })
      .catch((err) => console.error("Failed to fetch exchange rate:", err));
    return () => { mounted = false; };
  }, [fetchCurrentRate]);

  // Wizard state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [step, setStep] = useState<WizardStep>("assignor");
  const [assignorSearch, setAssignorSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Company[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAssignorId, setSelectedAssignorId] = useState("");
  const [availableReceivables, setAvailableReceivables] = useState<Receivable[]>([]);
  const [selectedReceivableIds, setSelectedReceivableIds] = useState<Set<string>>(new Set());
  const [isLoadingReceivables, setIsLoadingReceivables] = useState(false);
  const [preview, setPreview] = useState<BatchPreview | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isQueuing, setIsQueuing] = useState(false);

  // Detail modal state
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailBatch, setDetailBatch] = useState<BatchDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isQueuingDetail, setIsQueuingDetail] = useState(false);

  // Server-side search com debounce
  const debouncedSearch = useDebounce(assignorSearch, 350);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setSearchResults([]);
      return;
    }
    let cancelled = false;
    setIsSearching(true);
    fetchCompanies(debouncedSearch)
      .then((res) => { if (!cancelled) setSearchResults(res); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setIsSearching(false); });
    return () => { cancelled = true; };
  }, [debouncedSearch, fetchCompanies]);

  const formatCurrency = (v: string | number, currency: string) => {
    const symbols: Record<string, string> = {
      BRL: "R$",
      USD: "US$",
      EUR: "€",
      GBP: "£",
    };
    const symbol = symbols[currency] || currency;
    return `${symbol} ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  };

  // ── Page / table logic ──────────────────────────────────────────────────────

  const displayData = tableFilters.assignor
    ? data.filter((b) => b.assignor.social_reason.toLowerCase().includes(tableFilters.assignor.toLowerCase()))
    : data;

  const totalItems =
    displayData.length === pageSize
      ? (pageIndex + 1) * pageSize + 1
      : pageIndex * pageSize + displayData.length;

  const loadPage = useCallback(
    (nextPage: number, nextSize: number, nextFilters: Record<string, string> = tableFilters) => {
      startTransition(async () => {
        const result = await fetchBatches({
          page: nextPage + 1,
          pageSize: nextSize,
          status: nextFilters.status || undefined,
        });
        setData(result);
      });
    },
    [fetchBatches, tableFilters],
  );

  const handlePageChange = (page: number) => { setPageIndex(page); loadPage(page, pageSize); };
  const handlePageSizeChange = (size: number) => { setPageSize(size); setPageIndex(0); loadPage(0, size); };

  const handleFilterChange = useCallback((columnId: string, value: string) => {
    const nextFilters = { ...tableFilters, [columnId]: value };
    if (!value) delete nextFilters[columnId];
    setTableFilters(nextFilters);
    setPageIndex(0);
    loadPage(0, pageSize, nextFilters);
  }, [tableFilters, pageSize, loadPage]);

  // ── Detail modal ────────────────────────────────────────────────────────────

  const handleRowClick = async (row: Batch) => {
    setDetailOpen(true);
    setDetailBatch(null);
    setIsLoadingDetail(true);
    try {
      setDetailBatch(await fetchBatchDetail(row.id));
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao carregar detalhe do lote.");
      setDetailOpen(false);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleQueueFromDetail = async () => {
    if (!detailBatch) return;
    setIsQueuingDetail(true);
    try {
      await queueBatchAction(detailBatch.id, detailBatch.version);
      setDetailOpen(false);
      loadPage(0, pageSize);
      setPageIndex(0);
      toast.success("Lote enviado para a fila.");
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao solicitar antecipação.");
    } finally {
      setIsQueuingDetail(false);
    }
  };

  // ── Wizard logic ────────────────────────────────────────────────────────────

  const resetWizard = () => {
    setStep("assignor");
    setAssignorSearch("");
    setSearchResults([]);
    setSelectedAssignorId("");
    setAvailableReceivables([]);
    setSelectedReceivableIds(new Set());
    setPreview(null);
  };

  const handleCloseWizard = () => { setWizardOpen(false); resetWizard(); };

  const handleAssignorNext = async () => {
    if (!selectedAssignorId) return;
    setIsLoadingReceivables(true);
    try {
      const receivables = await fetchReceivablesByAssignor(selectedAssignorId, 1, 100);
      setAvailableReceivables(receivables.filter((r) => r.status === "available"));
      setStep("receivables");
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao carregar recebíveis.");
    } finally {
      setIsLoadingReceivables(false);
    }
  };

  const toggleReceivable = (id: string) => {
    setSelectedReceivableIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedReceivableIds(
      selectedReceivableIds.size === availableReceivables.length && availableReceivables.length > 0
        ? new Set()
        : new Set(availableReceivables.map((r) => r.id)),
    );
  };

  const handleSimulate = async () => {
    if (selectedReceivableIds.size === 0) return;
    setIsCreating(true);
    try {
      setPreview(await simulateBatch(selectedAssignorId, Array.from(selectedReceivableIds)));
      setStep("preview");
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao simular lote.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleQueue = async () => {
    if (selectedReceivableIds.size === 0) return;
    setIsQueuing(true);
    try {
      await createAndQueueBatch(selectedAssignorId, Array.from(selectedReceivableIds));
      setStep("success");
      loadPage(0, pageSize);
      setPageIndex(0);
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao solicitar antecipação.");
    } finally {
      setIsQueuing(false);
    }
  };

  // ── Detail panel helpers ────────────────────────────────────────────────────

  function buildRatePanel(items: BatchPreviewItem[]) {
    const firstItem = items[0];
    const baseRateAnnual = Number(firstItem?.base_rate_annual ?? 0);
    const spreadAnnual = Number(firstItem?.spread_annual ?? 0);
    const baseRateDaily = baseRateAnnual > 0 ? Math.pow(1 + baseRateAnnual, 1 / 365) - 1 : 0;
    const spreadDaily = spreadAnnual > 0 ? Math.pow(1 + spreadAnnual, 1 / 365) - 1 : 0;
    const totalRateDaily = baseRateDaily + spreadDaily;
    const fmtPct = (r: number) => (isNaN(r) ? "—" : `${(r * 100).toFixed(6)}%`);
    const fmtPctAnnual = (r: number) => (isNaN(r) ? "—" : `${(r * 100).toFixed(4)}% a.a.`);
    return { baseRateAnnual, spreadAnnual, baseRateDaily, spreadDaily, totalRateDaily, fmtPct, fmtPctAnnual };
  }

  function RatePanel({
    items,
    totalFace: _unusedTotalFace,
    totalPresent: _unusedTotalPresent,
    totalReceivables,
    exchangeRate,
  }: {
    items: BatchPreviewItem[];
    totalFace: number;
    totalPresent: number;
    totalReceivables: number;
    exchangeRate: number | null;
  }) {
    const { baseRateAnnual, spreadAnnual, baseRateDaily, spreadDaily, totalRateDaily, fmtPct, fmtPctAnnual } =
      buildRatePanel(items);

    const nExchange = Number(exchangeRate || 1);

    // Calculate totals in BRL locally to ensure correct multi-currency sum
    const totalFaceBRL = items.reduce((sum, item) => {
      const value = Number(item.face_value);
      return sum + (item.currency_code === "BRL" ? value : value * nExchange);
    }, 0);

    const totalPresentBRL = items.reduce((sum, item) => {
      const face = Number(item.face_value);
      let present = Number(item.present_value);
      
      // Normalization: if present is already in BRL (for approved batches), don't convert again
      const isAlreadyBRL = item.currency_code !== "BRL" && present > face * 1.5;
      
      const valueBRL = (isAlreadyBRL || item.currency_code === "BRL") 
        ? present 
        : present * nExchange;
        
      return sum + valueBRL;
    }, 0);

    const totalDiscountBRL = totalFaceBRL - totalPresentBRL;

    return (
      <div className="rounded-2xl bg-brand-blue-950 text-white p-5 space-y-4 sticky top-0">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-blue-300 mb-3">Composição das Taxas</p>
          <div className="space-y-2.5">
            {[
              { label: "Taxa Base", daily: baseRateDaily, annual: baseRateAnnual },
              { label: "Spread", daily: spreadDaily, annual: spreadAnnual },
            ].map(({ label, daily, annual }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-brand-blue-300">{label}</span>
                <div className="text-right">
                  <span className="text-sm font-semibold">{fmtPct(daily)}<span className="text-brand-blue-400 font-normal text-xs"> /d</span></span>
                  <p className="text-[10px] text-brand-blue-400">{fmtPctAnnual(annual)}</p>
                </div>
              </div>
            ))}
            <div className="border-t border-white/10 pt-2.5 flex items-center justify-between">
              <span className="text-xs font-bold text-white">Taxa Total</span>
              <div className="text-right">
                <span className="text-sm font-bold text-brand-blue-200">{fmtPct(totalRateDaily)}<span className="text-brand-blue-400 font-normal text-xs"> /d</span></span>
                <p className="text-[10px] text-brand-blue-400">{fmtPctAnnual(baseRateAnnual + spreadAnnual)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-4 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-blue-300">Resumo (Total em BRL)</p>
          {[
            { label: "Títulos", value: String(totalReceivables) },
            { label: "Valor de Face", value: formatCurrency(totalFaceBRL, "BRL") },
            { label: "Desconto Total", value: `- ${formatCurrency(totalDiscountBRL, "BRL")}`, danger: true },
          ].map(({ label, value, danger }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-xs text-brand-blue-300">{label}</span>
              <span className={`text-sm font-semibold ${danger ? "text-srm-danger-400" : "text-white"}`}>{value}</span>
            </div>
          ))}
          <div className="border-t border-white/10 pt-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-blue-300 mb-1">Valor Líquido Total</p>
            <p className="text-2xl font-bold text-brand-blue-200">{formatCurrency(totalPresentBRL, "BRL")}</p>
            {items.some(i => i.currency_code !== "BRL") && (
              <p className="text-[10px] text-brand-blue-400 mt-1 italic">
                * Valores convertidos usando a taxa de câmbio atual.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-end justify-between shrink-0">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="t-h3 !text-2xl text-fg-1 tracking-tight">Lotes</h1>
          <p className="t-body !text-fg-3 mt-0.5">Agrupamentos de recebíveis para antecipação.</p>
        </motion.div>
        <Button
          className="h-9 px-4 text-xs font-bold shadow-md shadow-brand-blue-500/10"
          icon="plus"
          onClick={() => setWizardOpen(true)}
        >
          Novo Lote
        </Button>
      </div>

      <DataTable
        columns={batchColumns}
        data={displayData}
        totalItems={totalItems}
        pageSize={pageSize}
        pageIndex={pageIndex}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onFilterChange={handleFilterChange}
        onRowClick={handleRowClick}
      />

      {/* ── Detail modal ──────────────────────────────────────────────────── */}
      <Modal open={detailOpen} onOpenChange={setDetailOpen} size="xl">
        <ModalContent onClose={() => setDetailOpen(false)}>
          {isLoadingDetail || !detailBatch ? (
            <div className="flex items-center justify-center py-20">
              <Icon name="loader" size={28} className="text-brand-blue-400 animate-spin" />
            </div>
          ) : (() => {
            const totalFace = detailBatch.items.reduce((s, i) => s + Number(i.face_value), 0);
            const totalPresent = detailBatch.items.reduce((s, i) => s + Number(i.present_value), 0);
            const { fmtPct } = buildRatePanel(detailBatch.items);
            return (
              <>
                <ModalHeader>
                  <div className="flex items-center gap-3">
                    <ModalTitle>Lote {detailBatch.id}</ModalTitle>
                    <Badge color={BATCH_STATUS_COLOR[detailBatch.status] ?? "neutral"} size="sm">
                      {BATCH_STATUS_LABEL[detailBatch.status] ?? detailBatch.status}
                    </Badge>
                  </div>
                  <ModalDescription>
                    {detailBatch.assignor.fantasy_name ?? detailBatch.assignor.social_reason} · {detailBatch.total_receivables} título(s)
                  </ModalDescription>
                </ModalHeader>
                <div className="px-6 pb-2">
                  <div className="flex gap-5 items-start">
                    <div className="flex-[3] min-w-0 space-y-2 max-h-[480px] overflow-y-auto pr-1">
                      {detailBatch.items.map((item) => {
                        const face = Number(item.face_value);
                        const present = Number(item.present_value);
                        const iBase = item.base_rate_annual != null ? Number(item.base_rate_annual) : null;
                        const iSpread = item.spread_annual != null ? Number(item.spread_annual) : null;
                        const iBaseDaily = iBase != null && iBase > 0 ? Math.pow(1 + iBase, 1 / 365) - 1 : null;
                        const iSpreadDaily = iSpread != null && iSpread > 0 ? Math.pow(1 + iSpread, 1 / 365) - 1 : null;
                        const iTotalDaily = iBaseDaily != null && iSpreadDaily != null ? iBaseDaily + iSpreadDaily : null;
                        return (
                          <PreviewItemCard
                            key={item.receivable_id}
                            item={item}
                            face={face}
                            present={present}
                            discount={face - present}
                            baseDaily={iBaseDaily}
                            spreadDaily={iSpreadDaily}
                            totalDaily={iTotalDaily}
                            fmtPct={fmtPct}
                            formatCurrency={formatCurrency}
                            exchangeRate={exchangeRate}
                          />
                        );
                      })}
                    </div>
                    <div className="flex-[2] min-w-0">
                      <RatePanel
                        items={detailBatch.items}
                        totalFace={totalFace}
                        totalPresent={totalPresent}
                        totalReceivables={detailBatch.total_receivables}
                        exchangeRate={exchangeRate}
                      />
                    </div>
                  </div>
                </div>
                <ModalFooter>
                  <Button variant="outline" color="neutral" onClick={() => setDetailOpen(false)}>Fechar</Button>
                  {detailBatch.status === "pending" && (
                    <Button onClick={handleQueueFromDetail} isLoading={isQueuingDetail} icon="send">
                      Solicitar Antecipação
                    </Button>
                  )}
                </ModalFooter>
              </>
            );
          })()}
        </ModalContent>
      </Modal>

      {/* ── Wizard modal ──────────────────────────────────────────────────── */}
      <Modal open={wizardOpen} onOpenChange={handleCloseWizard} size="xl">
        <ModalContent onClose={handleCloseWizard} className="h-[90vh]">

          {/* Stepper — hidden on success */}
          {step !== "success" && <WizardStepper step={step} />}

          {/* ── Step 1: Cedente ─────────────────────────────────────────── */}
          {step === "assignor" && (
            <>
              <ModalHeader>
                <ModalTitle>Selecionar Cedente</ModalTitle>
                <ModalDescription>
                  Escolha a empresa titular dos recebíveis que serão antecipados. Apenas empresas com títulos disponíveis podem ter lotes criados.
                </ModalDescription>
              </ModalHeader>

              {/* Search */}
              <div className="px-6 pb-3">
                <div className="relative">
                  <Icon name="search" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou CNPJ…"
                    value={assignorSearch}
                    onChange={(e) => setAssignorSearch(e.target.value)}
                    className="w-full h-10 rounded-xl border-[0.5px] border-border-default bg-surface pl-9 pr-4 text-[13px] text-fg-1 placeholder:text-fg-disabled outline-none focus:border-brand-blue-400 focus:ring-2 focus:ring-brand-blue-100 transition-all"
                  />
                </div>
              </div>

              {/* Company list */}
              <div className="px-6 pt-1 pb-3 space-y-2 flex-1 overflow-y-auto">
                {!assignorSearch.trim() ? (
                  <div className="flex flex-col items-center gap-2 py-8 text-center">
                    <Icon name="search" size={20} className="text-fg-disabled" />
                    <p className="text-sm text-fg-3">Digite o nome ou CNPJ para buscar cedentes.</p>
                  </div>
                ) : isSearching ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-5 h-5 rounded-full border-2 border-border-default border-t-brand-blue-400 animate-spin" />
                  </div>
                ) : searchResults.length === 0 ? (
                  <p className="text-sm text-fg-3 text-center py-6">Nenhuma empresa encontrada.</p>
                ) : (
                  searchResults.map((company) => (
                    <AssignorCard
                      key={company.id}
                      company={company}
                      selected={selectedAssignorId === company.id}
                      onClick={() => setSelectedAssignorId(company.id)}
                    />
                  ))
                )}
              </div>

              <ModalFooter>
                <Button variant="outline" color="neutral" onClick={handleCloseWizard}>Cancelar</Button>
                <Button
                  onClick={handleAssignorNext}
                  disabled={!selectedAssignorId}
                  isLoading={isLoadingReceivables}
                  iconRight="arrowRight"
                >
                  Próximo
                </Button>
              </ModalFooter>
            </>
          )}

          {/* ── Step 2: Recebíveis ──────────────────────────────────────── */}
          {step === "receivables" && (
            <>
              <ModalHeader>
                <ModalTitle>Selecionar Recebíveis</ModalTitle>
                <ModalDescription>
                  Selecione os títulos disponíveis que farão parte deste lote. Você pode incluir todos ou escolher individualmente. O valor líquido será calculado na próxima etapa.
                </ModalDescription>
              </ModalHeader>

              <div className="px-6 pb-3 flex-1 overflow-y-auto space-y-1">
                {availableReceivables.length === 0 ? (
                  <p className="text-sm text-fg-3 py-8 text-center">Nenhum recebível disponível para este cedente.</p>
                ) : (
                  <>
                    <div className="flex items-center justify-between py-2.5 border-b border-border-subtle mb-1 sticky top-0 bg-white z-10">
                      <Checkbox
                        label="Selecionar todos"
                        checked={selectedReceivableIds.size === availableReceivables.length && availableReceivables.length > 0}
                        onChange={toggleAll}
                      />
                      <span className="text-xs text-fg-3">
                        {selectedReceivableIds.size} de {availableReceivables.length} · {formatCurrency(
                          availableReceivables
                            .filter((r) => selectedReceivableIds.has(r.id))
                            .reduce((s, r) => s + Number(r.face_value), 0),
                          "BRL"
                        )}
                      </span>
                    </div>
                    {availableReceivables.map((r) => (
                      <div
                        key={r.id}
                        className={`flex items-center justify-between rounded-xl px-3 py-3 cursor-pointer transition-colors
                          ${selectedReceivableIds.has(r.id) ? "bg-brand-blue-50/60" : "hover:bg-surface-alt/50"}`}
                        onClick={() => toggleReceivable(r.id)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Checkbox checked={selectedReceivableIds.has(r.id)} onChange={() => toggleReceivable(r.id)} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-fg-1 truncate">{r.drawee.social_reason}</p>
                              <Badge color="neutral" size="sm">{r.product_type.name}</Badge>
                            </div>
                            <p className="text-xs text-fg-3">
                              Venc. {new Date(r.due_date + "T00:00:00").toLocaleDateString("pt-BR")} · Spread {(Number(r.product_type.spread) * 100).toFixed(2)}% a.a. · {r.invoice_key.slice(0, 16)}…
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-fg-1 whitespace-nowrap ml-4">
                          {formatCurrency(r.face_value, r.currency_code)}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>

              <ModalFooter>
                <Button variant="outline" color="neutral" onClick={() => setStep("assignor")}>Voltar</Button>
                <Button
                  onClick={handleSimulate}
                  disabled={selectedReceivableIds.size === 0}
                  isLoading={isCreating}
                  icon="calculator"
                >
                  Simular
                </Button>
              </ModalFooter>
            </>
          )}

          {/* ── Step 3: Preview ─────────────────────────────────────────── */}
          {step === "preview" && preview && (() => {
            const totalFace = Number(preview.total_face_value);
            const totalPresent = Number(preview.total_present_value);
            const { fmtPct } = buildRatePanel(preview.items);

            return (
              <>
                <ModalHeader>
                  <ModalTitle>Simulação do Lote</ModalTitle>
                  <ModalDescription>
                    Confira os valores calculados. As taxas são apuradas com base na Selic atual mais o spread operacional. Após confirmar, o lote entra na fila de processamento.
                  </ModalDescription>
                </ModalHeader>

                <div className="px-6 pb-2 flex-1 overflow-hidden">
                  <div className="flex gap-5 h-full">
                    <div className="flex-[3] min-w-0 space-y-2 overflow-y-auto pr-1">
                      {preview.items.map((item) => {
                        const face = Number(item.face_value);
                        const present = Number(item.present_value);
                        const iBase = item.base_rate_annual != null ? Number(item.base_rate_annual) : null;
                        const iSpread = item.spread_annual != null ? Number(item.spread_annual) : null;
                        const iBaseDaily = iBase != null && iBase > 0 ? Math.pow(1 + iBase, 1 / 365) - 1 : null;
                        const iSpreadDaily = iSpread != null && iSpread > 0 ? Math.pow(1 + iSpread, 1 / 365) - 1 : null;
                        const iTotalDaily = iBaseDaily != null && iSpreadDaily != null ? iBaseDaily + iSpreadDaily : null;
                        return (
                          <PreviewItemCard
                            key={item.receivable_id}
                            item={item}
                            face={face}
                            present={present}
                            discount={face - present}
                            baseDaily={iBaseDaily}
                            spreadDaily={iSpreadDaily}
                            totalDaily={iTotalDaily}
                            fmtPct={fmtPct}
                            formatCurrency={formatCurrency}
                            exchangeRate={exchangeRate}
                          />
                        );
                      })}
                    </div>
                    <div className="flex-[2] min-w-0 overflow-y-auto">
                      <RatePanel
                        items={preview.items}
                        totalFace={totalFace}
                        totalPresent={totalPresent}
                        totalReceivables={preview.total_receivables}
                        exchangeRate={exchangeRate}
                      />
                    </div>
                  </div>
                </div>

                <ModalFooter>
                  <Button variant="outline" color="neutral" onClick={() => setStep("receivables")}>Voltar</Button>
                  <Button onClick={handleQueue} isLoading={isQueuing} icon="send">Solicitar Antecipação</Button>
                </ModalFooter>
              </>
            );
          })()}

          {/* ── Step 4: Success ─────────────────────────────────────────── */}
          {step === "success" && (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 px-6 pb-6">
              <div className="w-16 h-16 rounded-full bg-srm-success-50 border border-srm-success-100 flex items-center justify-center">
                <Icon name="checkCircle" size={32} className="text-srm-success-500" />
              </div>
              <div>
                <p className="text-lg font-semibold text-fg-1">Solicitação Enviada</p>
                <p className="text-sm text-fg-3 mt-1">
                  O lote foi enfileirado e será processado em breve. Acompanhe o status na listagem.
                </p>
              </div>
              <Button onClick={handleCloseWizard}>Concluir</Button>
            </div>
          )}

        </ModalContent>
      </Modal>
    </div>
  );
}
