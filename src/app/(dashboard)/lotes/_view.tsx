"use client";

import React, { useState, useCallback, useTransition, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import Icon from "@/components/ui/icon";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from "@/components/ui/modal";
import Select from "@/components/ui/select";
import type { Batch, BatchDetail, BatchPreview, BatchPreviewItem, Company, Receivable } from "@/types";

interface PreviewItemCardProps {
  item: BatchPreviewItem;
  face: number;
  present: number;
  discount: number;
  baseDaily: number | null;
  spreadDaily: number | null;
  totalDaily: number | null;
  fmtPct: (r: number) => string;
  fmtBRL: (v: string | number) => string;
}

function PreviewItemCard({ item, face, present, discount, baseDaily, spreadDaily, totalDaily, fmtPct, fmtBRL }: PreviewItemCardProps) {
  const baseDiscount = totalDaily != null && totalDaily > 0 && baseDaily != null
    ? discount * (baseDaily / totalDaily) : null;
  const spreadDiscount = totalDaily != null && totalDaily > 0 && spreadDaily != null
    ? discount * (spreadDaily / totalDaily) : null;

  const rows: { label: string; sub?: string; value: string; muted?: boolean; danger?: boolean; bold?: boolean }[] = [
    { label: "Valor de Face", value: fmtBRL(face) },
    {
      label: "Taxa Base",
      sub: baseDaily != null ? `${fmtPct(baseDaily)}/d` : undefined,
      value: baseDiscount != null ? `- ${fmtBRL(baseDiscount)}` : "—",
      danger: true,
    },
    {
      label: "Spread",
      sub: spreadDaily != null ? `${fmtPct(spreadDaily)}/d` : undefined,
      value: spreadDiscount != null ? `- ${fmtBRL(spreadDiscount)}` : "—",
      danger: true,
    },
    {
      label: "Desconto Total",
      sub: totalDaily != null ? `${fmtPct(totalDaily)}/d` : undefined,
      value: `- ${fmtBRL(discount)}`,
      danger: true,
      muted: true,
    },
  ];

  return (
    <div className="border border-border-default rounded-xl overflow-hidden">
      <div className="px-4 py-3 space-y-1.5">
        <p className="text-sm font-semibold text-fg-1 leading-snug">{item.drawee.social_reason}</p>
        <p className="text-xs text-fg-3">Parcela {item.installment_number} · {item.term_days}d</p>
        <p className="font-mono text-[10px] text-fg-3 break-all leading-snug">{item.invoice_key}</p>
      </div>

      <div className="border-t border-border-subtle bg-surface-alt/30 px-4 py-3 space-y-2">
        {rows.map(({ label, sub, value, danger, muted }) => (
          <div key={label} className={`flex justify-between items-center ${muted ? "opacity-60" : ""}`}>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs text-fg-2">{label}</span>
              {sub && <span className="text-[10px] text-fg-3 font-mono">{sub}</span>}
            </div>
            <span className={`text-xs font-semibold tabular-nums ${danger ? "text-srm-danger-500" : "text-fg-1"}`}>
              {value}
            </span>
          </div>
        ))}
        <div className="border-t border-border-subtle pt-2 flex justify-between items-center">
          <span className="text-xs font-bold text-fg-1">Valor Líquido</span>
          <span className="text-sm font-bold text-brand-blue-600 tabular-nums">{fmtBRL(present)}</span>
        </div>
      </div>
    </div>
  );
}

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
  {
    id: "id",
    header: "ID",
    cell: ({ row }: { row: Batch }) => (
      <span className="font-mono text-xs text-fg-2 tracking-tight whitespace-nowrap">{row.id}</span>
    ),
  },
  {
    id: "assignor",
    header: "Cedente",
    cell: ({ row }: { row: Batch }) => <span className="font-medium">{row.assignor.social_reason}</span>,
  },
  {
    id: "total_receivables",
    header: "Qtd. Títulos",
    cell: ({ row }: { row: Batch }) => row.total_receivables,
  },
  {
    id: "status",
    header: "Status",
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
      new Date(row.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }),
  },
];

type WizardStep = "assignor" | "receivables" | "preview" | "success";

interface Props {
  initialData: Batch[];
  companies: Company[];
  fetchBatches: (params: { page: number; pageSize: number; status?: string; assignor_id?: string }) => Promise<Batch[]>;
  fetchBatchDetail: (batchId: string) => Promise<BatchDetail>;
  fetchCompanies: (query?: string) => Promise<Company[]>;
  fetchReceivablesByAssignor: (assignorId: string, page: number, pageSize: number) => Promise<Receivable[]>;
  simulateBatch: (assignorId: string, receivableIds: string[]) => Promise<BatchPreview>;
  createAndQueueBatch: (assignorId: string, receivableIds: string[]) => Promise<Batch>;
  queueBatchAction: (batchId: string, expectedVersion: number) => Promise<Batch>;
}

export function LotesView({
  initialData,
  companies,
  fetchBatches,
  fetchBatchDetail,
  fetchCompanies,
  fetchReceivablesByAssignor,
  simulateBatch,
  createAndQueueBatch,
  queueBatchAction,
}: Props) {
  const [data, setData] = useState(initialData);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [isPending, startTransition] = useTransition();

  const [wizardOpen, setWizardOpen] = useState(false);
  const [step, setStep] = useState<WizardStep>("assignor");

  const [selectedAssignorId, setSelectedAssignorId] = useState("");
  const [availableReceivables, setAvailableReceivables] = useState<Receivable[]>([]);
  const [selectedReceivableIds, setSelectedReceivableIds] = useState<Set<string>>(new Set());
  const [isLoadingReceivables, setIsLoadingReceivables] = useState(false);

  const [preview, setPreview] = useState<BatchPreview | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isQueuing, setIsQueuing] = useState(false);
  const [isQueuingDetail, setIsQueuingDetail] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailBatch, setDetailBatch] = useState<BatchDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

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

  const handleRowClick = async (row: Batch) => {
    setDetailOpen(true);
    setDetailBatch(null);
    setIsLoadingDetail(true);
    try {
      const detail = await fetchBatchDetail(row.id);
      setDetailBatch(detail);
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao carregar detalhe do lote.");
      setDetailOpen(false);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const totalItems =
    data.length === pageSize
      ? (pageIndex + 1) * pageSize + 1
      : pageIndex * pageSize + data.length;

  const loadPage = useCallback(
    (nextPage: number, nextSize: number) => {
      startTransition(async () => {
        const result = await fetchBatches({ page: nextPage + 1, pageSize: nextSize });
        setData(result);
      });
    },
    [fetchBatches],
  );

  const handlePageChange = (page: number) => {
    setPageIndex(page);
    loadPage(page, pageSize);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPageIndex(0);
    loadPage(0, size);
  };

  const resetWizard = () => {
    setStep("assignor");
    setSelectedAssignorId("");
    setAvailableReceivables([]);
    setSelectedReceivableIds(new Set());
    setPreview(null);
  };

  const handleCloseWizard = () => {
    setWizardOpen(false);
    resetWizard();
  };

  const handleAssignorNext = async () => {
    if (!selectedAssignorId) return;
    setIsLoadingReceivables(true);
    try {
      const receivables = await fetchReceivablesByAssignor(selectedAssignorId, 1, 100);
      const available = receivables.filter((r) => r.status === "available");
      setAvailableReceivables(available);
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
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedReceivableIds.size === availableReceivables.length) {
      setSelectedReceivableIds(new Set());
    } else {
      setSelectedReceivableIds(new Set(availableReceivables.map((r) => r.id)));
    }
  };

  const handleSimulate = async () => {
    if (selectedReceivableIds.size === 0) return;
    setIsCreating(true);
    try {
      const result = await simulateBatch(
        selectedAssignorId,
        Array.from(selectedReceivableIds),
      );
      setPreview(result);
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

  const companyOptions = companies.map((c) => ({ value: c.id, label: c.fantasy_name ?? c.social_reason }));

  const fmtBRL = (v: string | number) =>
    `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

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
        data={data}
        totalItems={totalItems}
        pageSize={pageSize}
        pageIndex={pageIndex}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onFilterChange={() => {}}
        onRowClick={handleRowClick}
      />

      {/* Detail Modal */}
      <Modal open={detailOpen} onOpenChange={setDetailOpen} size="xl">
        <ModalContent onClose={() => setDetailOpen(false)}>
          {isLoadingDetail || !detailBatch ? (
            <div className="flex items-center justify-center py-20">
              <Icon name="loader" size={28} className="text-brand-blue-400 animate-spin" />
            </div>
          ) : (() => {
            const totalFace = detailBatch.items.reduce((s, i) => s + Number(i.face_value), 0);
            const totalPresent = detailBatch.items.reduce((s, i) => s + Number(i.present_value), 0);
            const totalDiscount = totalFace - totalPresent;

            const firstItem = detailBatch.items[0];
            const baseRateAnnual = Number(firstItem?.base_rate_annual ?? 0);
            const spreadAnnual = Number(firstItem?.spread_annual ?? 0);
            const baseRateDaily = baseRateAnnual > 0 ? Math.pow(1 + baseRateAnnual, 1 / 365) - 1 : 0;
            const spreadDaily = spreadAnnual > 0 ? Math.pow(1 + spreadAnnual, 1 / 365) - 1 : 0;
            const totalRateDaily = baseRateDaily + spreadDaily;

            const fmtPct = (r: number) => isNaN(r) ? "—" : `${(r * 100).toFixed(6)}%`;
            const fmtPctAnnual = (r: number) => isNaN(r) ? "—" : `${(r * 100).toFixed(4)}% a.a.`;

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
                        const discount = face - present;
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
                            discount={discount}
                            baseDaily={iBaseDaily}
                            spreadDaily={iSpreadDaily}
                            totalDaily={iTotalDaily}
                            fmtPct={fmtPct}
                            fmtBRL={fmtBRL}
                          />
                        );
                      })}
                    </div>

                    <div className="flex-[2] min-w-0 rounded-2xl bg-brand-blue-950 text-white p-5 space-y-4 sticky top-0">
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
                        <p className="text-[10px] font-bold uppercase tracking-widest text-brand-blue-300">Resumo</p>
                        {[
                          { label: "Títulos", value: String(detailBatch.total_receivables) },
                          { label: "Valor de Face", value: fmtBRL(totalFace) },
                          { label: "Desconto Total", value: `- ${fmtBRL(totalDiscount)}`, danger: true },
                        ].map(({ label, value, danger }) => (
                          <div key={label} className="flex items-center justify-between">
                            <span className="text-xs text-brand-blue-300">{label}</span>
                            <span className={`text-sm font-semibold ${danger ? "text-srm-danger-400" : "text-white"}`}>{value}</span>
                          </div>
                        ))}
                        <div className="border-t border-white/10 pt-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-blue-300 mb-1">Valor Líquido</p>
                          <p className="text-2xl font-bold text-brand-blue-200">{fmtBRL(totalPresent)}</p>
                        </div>
                      </div>
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

      {/* Wizard Modal */}
      <Modal open={wizardOpen} onOpenChange={handleCloseWizard} size={step === "preview" ? "xl" : "md"}>
        <ModalContent onClose={handleCloseWizard}>

          {/* Step: Assignor */}
          {step === "assignor" && (
            <>
              <ModalHeader>
                <ModalTitle>Novo Lote — Cedente</ModalTitle>
                <ModalDescription>Selecione o cedente cujos recebíveis serão antecipados.</ModalDescription>
              </ModalHeader>
              <div className="px-6 pb-2">
                <Select
                  label="Cedente"
                  placeholder="Selecione uma empresa..."
                  options={companyOptions}
                  value={selectedAssignorId}
                  onChange={setSelectedAssignorId}
                  icon="building2"
                />
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

          {/* Step: Receivables */}
          {step === "receivables" && (
            <>
              <ModalHeader>
                <ModalTitle>Selecionar Recebíveis</ModalTitle>
                <ModalDescription>
                  {availableReceivables.length} título(s) disponível(is) ·{" "}
                  {selectedReceivableIds.size} selecionado(s)
                </ModalDescription>
              </ModalHeader>
              <div className="px-6 pb-2 max-h-96 overflow-y-auto space-y-1">
                {availableReceivables.length === 0 ? (
                  <p className="text-sm text-fg-3 py-8 text-center">Nenhum recebível disponível para este cedente.</p>
                ) : (
                  <>
                    <div className="flex items-center justify-between py-2 border-b border-border-subtle mb-2">
                      <Checkbox
                        label="Selecionar todos"
                        checked={selectedReceivableIds.size === availableReceivables.length && availableReceivables.length > 0}
                        onChange={toggleAll}
                      />
                      <span className="text-xs text-fg-3">
                        Total: {fmtBRL(availableReceivables.filter(r => selectedReceivableIds.has(r.id)).reduce((s, r) => s + Number(r.face_value), 0))}
                      </span>
                    </div>
                    {availableReceivables.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-surface-alt/50 cursor-pointer transition-colors"
                        onClick={() => toggleReceivable(r.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox checked={selectedReceivableIds.has(r.id)} onChange={() => toggleReceivable(r.id)} />
                          <div>
                            <p className="text-sm font-medium text-fg-1">{r.drawee.social_reason}</p>
                            <p className="text-xs text-fg-3">
                              Venc. {new Date(r.due_date + "T00:00:00").toLocaleDateString("pt-BR")} · {r.invoice_key.slice(0, 16)}…
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-fg-1 whitespace-nowrap ml-4">
                          {fmtBRL(r.face_value)}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
              <ModalFooter>
                <Button variant="outline" color="neutral" onClick={() => setStep("assignor")}>
                  Voltar
                </Button>
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

          {/* Step: Preview */}
          {step === "preview" && preview && (() => {
            const totalFace = Number(preview.total_face_value);
            const totalPresent = Number(preview.total_present_value);
            const totalDiscount = totalFace - totalPresent;

            const firstItem = preview.items[0];
            const baseRateAnnual = Number(firstItem?.base_rate_annual ?? 0);
            const spreadAnnual = Number(firstItem?.spread_annual ?? 0);
            const baseRateDaily = baseRateAnnual > 0 ? Math.pow(1 + baseRateAnnual, 1 / 365) - 1 : 0;
            const spreadDaily = spreadAnnual > 0 ? Math.pow(1 + spreadAnnual, 1 / 365) - 1 : 0;
            const totalRateDaily = baseRateDaily + spreadDaily;

            const fmtPct = (r: number) => isNaN(r) ? "—" : `${(r * 100).toFixed(6)}%`;
            const fmtPctAnnual = (r: number) => isNaN(r) ? "—" : `${(r * 100).toFixed(4)}% a.a.`;

            return (
              <>
                <ModalHeader>
                  <ModalTitle>Simulação do Lote</ModalTitle>
                  <ModalDescription>Confira os valores e taxas antes de solicitar a antecipação.</ModalDescription>
                </ModalHeader>

                <div className="px-6 pb-2">
                  <div className="flex gap-5 items-start">

                    {/* Coluna esquerda — 60% — cards dos títulos */}
                    <div className="flex-[3] min-w-0 space-y-2 max-h-[480px] overflow-y-auto pr-1">
                      {preview.items.map((item) => {
                        const face = Number(item.face_value);
                        const present = Number(item.present_value);
                        const discount = face - present;
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
                            discount={discount}
                            baseDaily={iBaseDaily}
                            spreadDaily={iSpreadDaily}
                            totalDaily={iTotalDaily}
                            fmtPct={fmtPct}
                            fmtBRL={fmtBRL}
                          />
                        );
                      })}
                    </div>

                    {/* Coluna direita — 40% — canhoto */}
                    <div className="flex-[2] min-w-0 rounded-2xl bg-brand-blue-950 text-white p-5 space-y-4 sticky top-0">
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
                        <p className="text-[10px] font-bold uppercase tracking-widest text-brand-blue-300">Resumo</p>
                        {[
                          { label: "Títulos", value: String(preview.total_receivables), highlight: false },
                          { label: "Valor de Face", value: fmtBRL(totalFace), highlight: false },
                          { label: "Desconto Total", value: `- ${fmtBRL(totalDiscount)}`, highlight: false, danger: true },
                        ].map(({ label, value, danger }) => (
                          <div key={label} className="flex items-center justify-between">
                            <span className="text-xs text-brand-blue-300">{label}</span>
                            <span className={`text-sm font-semibold ${danger ? "text-srm-danger-400" : "text-white"}`}>{value}</span>
                          </div>
                        ))}
                        <div className="border-t border-white/10 pt-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-blue-300 mb-1">Valor Líquido</p>
                          <p className="text-2xl font-bold text-brand-blue-200">{fmtBRL(totalPresent)}</p>
                        </div>
                      </div>
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

          {/* Step: Success */}
          {step === "success" && (
            <>
              <ModalHeader>
                <ModalTitle>Solicitação Enviada</ModalTitle>
              </ModalHeader>
              <div className="px-6 pb-6 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-srm-success-50 border border-srm-success-100 flex items-center justify-center">
                  <Icon name="checkCircle" size={32} className="text-srm-success-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-fg-1">Lote enviado para processamento</p>
                  <p className="text-sm text-fg-3 mt-1">
                    O lote foi enfileirado e será processado em breve. Acompanhe o status na listagem.
                  </p>
                </div>
                <Button onClick={handleCloseWizard}>Concluir</Button>
              </div>
            </>
          )}

        </ModalContent>
      </Modal>
    </div>
  );
}
