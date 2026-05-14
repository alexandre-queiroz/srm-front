"use client";

import React, { useState, useTransition } from "react";
import { motion } from "framer-motion";
import Icon from "@/components/ui/icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { ExchangeRate } from "@/types";
import { toast } from "sonner";

const columns = [
  {
    id: "pair",
    header: "Par de Moedas",
    enableColumnFilter: true,
    cell: ({ row }: { row: ExchangeRate }) => (
      <span className="font-bold">
        {row.from_currency}/{row.to_currency}
      </span>
    ),
  },
  {
    id: "rate",
    header: "Taxa",
    cell: ({ row }: { row: ExchangeRate }) => Number(row.rate).toFixed(4),
  },
  {
    id: "source",
    header: "Fonte",
    cell: ({ row }: { row: ExchangeRate }) => (
      <Badge color="neutral" size="sm" variant="outline" className="capitalize">
        {row.source}
      </Badge>
    ),
  },
  {
    id: "collected_at",
    header: "Coletado em",
    cell: ({ row }: { row: ExchangeRate }) => new Date(row.collected_at).toLocaleString("pt-BR"),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }: { row: ExchangeRate }) => (
      <Badge color={row.is_stale ? "danger" : "success"} size="sm" className="font-bold">
        {row.is_stale ? "STALE" : "ATIVO"}
      </Badge>
    ),
  },
];

interface Props {
  initialData: ExchangeRate[];
  fetchRates: () => Promise<ExchangeRate[]>;
  triggerCollect: () => Promise<ExchangeRate>;
}

export function CambioView({ initialData, fetchRates, triggerCollect }: Props) {
  const [data, setData] = useState(initialData);
  const [pairFilter, setPairFilter] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isCollecting, setIsCollecting] = useState(false);

  const displayData = pairFilter
    ? data.filter((r) => `${r.from_currency}/${r.to_currency}`.toLowerCase().includes(pairFilter.toLowerCase()))
    : data;

  const handleRefresh = () => {
    startTransition(async () => {
      try {
        const result = await fetchRates();
        setData(result);
      } catch {
        toast.error("Erro ao atualizar taxas.");
      }
    });
  };

  const handleCollect = async () => {
    setIsCollecting(true);
    try {
      await triggerCollect();
      toast.success("Coleta de taxa disparada com sucesso.");
      handleRefresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao disparar coleta.");
    } finally {
      setIsCollecting(false);
    }
  };

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex shrink-0 items-end justify-between">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="t-h3 text-fg-1 !text-2xl tracking-tight">Câmbio</h1>
          <p className="t-body !text-fg-3 mt-0.5">Histórico de taxas de câmbio coletadas para operações multi-moedas.</p>
        </motion.div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            color="neutral"
            className="h-9 px-4 text-xs font-bold"
            icon="refresh-cw"
            onClick={handleRefresh}
            isLoading={isPending}
          >
            Atualizar Lista
          </Button>
          <Button
            className="shadow-brand-blue-500/10 h-9 px-4 text-xs font-bold shadow-md"
            icon="zap"
            onClick={handleCollect}
            isLoading={isCollecting}
          >
            Coletar Agora
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={displayData}
        totalItems={displayData.length}
        pageSize={50}
        pageIndex={0}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        onFilterChange={(_, value) => setPairFilter(value)}
      />
    </div>
  );
}
