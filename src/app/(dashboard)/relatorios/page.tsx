"use client";

import React from "react";
import { motion } from "framer-motion";
import Icon from "@/components/ui/icon";
import Button from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

const reportsData = [
  { id: "REP-001", name: "Fechamento Mensal - Maio", type: "Financeiro", data: "01/05/2026", status: "Concluído" },
  { id: "REP-002", name: "Relatório de Inadimplência Q1", type: "Risco", data: "15/04/2026", status: "Concluído" },
  { id: "REP-003", name: "Performance de Cedentes", type: "Comercial", data: "10/05/2026", status: "Em processamento" },
];

const columns = [
  { id: "id", header: "ID" },
  { id: "name", header: "Nome do Relatório", cell: ({ row }: any) => <span className="font-bold">{row.name}</span> },
  { id: "type", header: "Tipo" },
  { id: "data", header: "Data de Geração" },
  { id: "status", header: "Status" },
  {
    id: "actions",
    header: "Ações",
    cell: () => (
      <div className="flex items-center gap-1">
        <button className="p-2 hover:bg-brand-blue-50 text-brand-blue-600 rounded-lg transition-colors cursor-pointer">
          <Icon name="download" size={16} />
        </button>
        <button className="p-2 hover:bg-srm-danger-50 text-srm-danger-600 rounded-lg transition-colors cursor-pointer">
          <Icon name="trash" size={16} />
        </button>
      </div>
    )
  }
];

export default function RelatoriosPage() {
  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-end justify-between shrink-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="t-h3 !text-2xl text-fg-1 tracking-tight">Relatórios</h1>
          <p className="t-body !text-fg-3 mt-0.5">Acesse e gere relatórios detalhados da sua operação.</p>
        </motion.div>

        <div className="flex items-center gap-2">
          <Button className="h-9 px-4 text-xs font-bold shadow-md shadow-brand-blue-500/10" icon="plus">
            Gerar Relatório
          </Button>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={reportsData} 
        totalItems={reportsData.length} 
        pageSize={10} 
        pageIndex={0} 
        onPageChange={() => {}} 
        onPageSizeChange={() => {}} 
        onFilterChange={() => {}} 
      />
    </div>
  );
}
