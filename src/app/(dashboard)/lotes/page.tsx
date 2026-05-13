"use client";

import React from "react";
import { motion } from "framer-motion";
import Icon from "@/components/ui/icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

const batchesData = [
  { id: "LOT-001", description: "Lote de Duplicatas - Setor Têxtil", items: 24, totalValue: 850000, status: "Aprovado" },
  { id: "LOT-002", description: "Lote Agronegócio - Milho", items: 12, totalValue: 1240000, status: "Em Análise" },
  { id: "LOT-003", description: "Lote Serviços TI", items: 8, totalValue: 45000, status: "Pendente" },
];

const columns = [
  { id: "id", header: "ID", enableColumnFilter: true, cell: ({ row }: any) => <span className="font-bold text-brand-blue-600">{row.id}</span> },
  { id: "description", header: "Descrição", enableColumnFilter: true },
  { id: "items", header: "Qtd. Itens" },
  { id: "totalValue", header: "Valor Total", cell: ({ row }: any) => `R$ ${row.totalValue.toLocaleString("pt-BR")}` },
  { 
    id: "status", 
    header: "Status",
    enableColumnFilter: true,
    cell: ({ row }: any) => {
      const colors: any = { "Aprovado": "success", "Em Análise": "warning", "Pendente": "neutral" };
      return <Badge color={colors[row.status] || "neutral"} size="sm" className="font-bold">{row.status.toUpperCase()}</Badge>;
    }
  },
  {
    id: "actions",
    header: "Ações",
    cell: () => (
      <div className="flex items-center gap-1">
        <button className="p-2 hover:bg-brand-blue-50 text-brand-blue-600 rounded-lg transition-colors cursor-pointer">
          <Icon name="edit" size={16} />
        </button>
        <button className="p-2 hover:bg-srm-danger-50 text-srm-danger-600 rounded-lg transition-colors cursor-pointer">
          <Icon name="trash" size={16} />
        </button>
      </div>
    )
  }
];

export default function LotesPage() {
  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-end justify-between shrink-0">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="t-h3 !text-2xl text-fg-1 tracking-tight">Lotes</h1>
          <p className="t-body !text-fg-3 mt-0.5">Gerencie os agrupamentos de recebíveis para operação.</p>
        </motion.div>
        <div className="flex items-center gap-2">
          <Button variant="outline" color="neutral" className="h-9 px-4 text-xs font-bold" icon="download">Exportar</Button>
          <Button className="h-9 px-4 text-xs font-bold shadow-md shadow-brand-blue-500/10" icon="plus">Novo Lote</Button>
        </div>
      </div>
      <DataTable columns={columns} data={batchesData} totalItems={batchesData.length} pageSize={10} pageIndex={0} onPageChange={() => {}} onPageSizeChange={() => {}} onFilterChange={() => {}} />
    </div>
  );
}
