"use client";

import React from "react";
import { motion } from "framer-motion";
import Icon from "@/components/ui/icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

const productsData = [
  { id: "PRD-01", name: "Antecipação de Duplicatas", code: "DUP", spread: "2.5%", is_active: true },
  { id: "PRD-02", name: "Crédito com Garantia Imobiliária", code: "CGI", spread: "1.8%", is_active: true },
  { id: "PRD-03", name: "Capital de Giro", code: "CPG", spread: "3.2%", is_active: false },
];

const columns = [
  { id: "name", header: "Produto", enableColumnFilter: true, cell: ({ row }: any) => <span className="font-bold">{row.name}</span> },
  { id: "code", header: "Código", enableColumnFilter: true },
  { id: "spread", header: "Spread Médio" },
  { 
    id: "is_active", 
    header: "Status",
    cell: ({ row }: any) => (
      <Badge color={row.is_active ? "success" : "neutral"} size="sm" className="font-bold">
        {row.is_active ? "ATIVO" : "INATIVO"}
      </Badge>
    )
  },
  {
    id: "actions",
    header: "Ações",
    cell: () => (
      <div className="flex items-center gap-1">
        <button className="p-2 hover:bg-brand-blue-50 text-brand-blue-600 rounded-lg transition-colors cursor-pointer" title="Editar">
          <Icon name="edit" size={16} />
        </button>
        <button className="p-2 hover:bg-srm-danger-50 text-srm-danger-600 rounded-lg transition-colors cursor-pointer" title="Desativar">
          <Icon name="slash" size={16} />
        </button>
      </div>
    )
  }
];

export default function ProdutosPage() {
  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-end justify-between shrink-0">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="t-h3 !text-2xl text-fg-1 tracking-tight">Produtos</h1>
          <p className="t-body !text-fg-3 mt-0.5">Configuração de tipos de recebíveis e spreads operacionais.</p>
        </motion.div>
        <div className="flex items-center gap-2">
          <Button className="h-9 px-4 text-xs font-bold shadow-md shadow-brand-blue-500/10" icon="plus">Novo Produto</Button>
        </div>
      </div>
      <DataTable columns={columns} data={productsData} totalItems={productsData.length} pageSize={10} pageIndex={0} onPageChange={() => {}} onPageSizeChange={() => {}} onFilterChange={() => {}} />
    </div>
  );
}
