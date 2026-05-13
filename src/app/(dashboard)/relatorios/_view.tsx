"use client";

import React, { useState, useTransition } from "react";
import { motion } from "framer-motion";
import Icon from "@/components/ui/icon";
import Button from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Card from "@/components/ui/card";
import Kpi from "@/components/ui/kpi";
import type { SettlementReportResponse, SettlementReportItem } from "@/repositories/report-repository";
import { toast } from "sonner";

const columns = [
  { 
    id: "settled_at", 
    header: "Liquidação",
    cell: ({ row }: { row: SettlementReportItem }) => 
      new Date(row.settled_at).toLocaleDateString("pt-BR")
  },
  { id: "assignor_name", header: "Cedente", cell: ({ row }: { row: SettlementReportItem }) => <span className="font-bold">{row.assignor_name}</span> },
  { id: "invoice_key", header: "Chave NF-e", cell: ({ row }: { row: SettlementReportItem }) => <span className="font-mono text-xs">{row.invoice_key.slice(0, 20)}...</span> },
  { 
    id: "face_value_brl", 
    header: "Valor Face (BRL)", 
    cell: ({ row }: { row: SettlementReportItem }) => 
      `R$ ${Number(row.face_value_brl).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` 
  },
  { 
    id: "present_value_brl", 
    header: "Valor Líquido (BRL)", 
    cell: ({ row }: { row: SettlementReportItem }) => 
      `R$ ${Number(row.present_value_brl).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` 
  },
  { 
    id: "rate", 
    header: "Câmbio", 
    cell: ({ row }: { row: SettlementReportItem }) => 
      row.currency_code === "BRL" ? "—" : Number(row.rate).toFixed(4)
  },
];

interface Props {
  initialData: SettlementReportResponse;
  fetchReport: (params?: any) => Promise<SettlementReportResponse>;
}

export function RelatoriosView({ initialData, fetchReport }: Props) {
  const [data, setData] = useState(initialData);
  const [isPending, startTransition] = useTransition();

  const handleRefresh = (params?: any) => {
    startTransition(async () => {
      try {
        const result = await fetchReport(params);
        setData(result);
      } catch (err: any) {
        toast.error("Erro ao carregar relatório.");
      }
    });
  };

  const fmtBRL = (v: string | number) => 
    `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-end justify-between shrink-0">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="t-h3 !text-2xl text-fg-1 tracking-tight">Extrato de Liquidação</h1>
          <p className="t-body !text-fg-3 mt-0.5">Histórico analítico de títulos liquidados no período.</p>
        </motion.div>

        <div className="flex items-center gap-2">
          <Button variant="outline" color="neutral" icon="download">Exportar CSV</Button>
          <Button icon="refresh-cw" onClick={() => handleRefresh()} isLoading={isPending}>Atualizar</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Kpi label="Títulos Liquidados" value={data.summary.total_count} icon="file-text" color="brand" />
        <Kpi label="Total Face" value={fmtBRL(data.summary.total_face_value_brl)} icon="dollar-sign" color="neutral" />
        <Kpi label="Total Líquido" value={fmtBRL(data.summary.total_present_value_brl)} icon="trending-up" color="success" />
        <Kpi label="Spread Médio" value={`${(Number(data.summary.average_spread) * 100).toFixed(4)}%`} icon="percent" color="warning" />
      </div>

      <DataTable 
        columns={columns} 
        data={data.items} 
        totalItems={data.summary.total_count} 
        pageSize={data.page_size} 
        pageIndex={data.page - 1} 
        onPageChange={(page) => handleRefresh({ page: page + 1 })} 
        onPageSizeChange={(size) => handleRefresh({ page_size: size })} 
        onFilterChange={() => {}} 
      />
    </div>
  );
}
