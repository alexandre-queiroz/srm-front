"use client";

import React from "react";
import { motion } from "framer-motion";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Icon from "@/components/ui/icon";

const operationsData = [
  { id: "OP-9481", cedente: "Logística Alpha S.A.", status: "liquidado", data: "13/05/2026", valor: 125000, taxa: "2.4%" },
  { id: "OP-9482", cedente: "Tecnologia Beta Ltda.", status: "pendente", data: "13/05/2026", valor: 45200, taxa: "2.8%" },
  { id: "OP-9483", cedente: "Indústria Gamma", status: "liquidado", data: "12/05/2026", valor: 289000, taxa: "2.1%" },
  { id: "OP-9484", cedente: "Varejo Delta S.A.", status: "atrasado", data: "11/05/2026", valor: 12400, taxa: "3.2%" },
  { id: "OP-9485", cedente: "Construtora Epsilon", status: "liquidado", data: "10/05/2026", valor: 540000, taxa: "2.2%" },
];

const columns = [
  { id: "id", header: "ID", enableColumnFilter: true, cell: ({ row }: any) => <span className="font-bold text-brand-blue-600">{row.id}</span> },
  { id: "cedente", header: "Cedente", enableColumnFilter: true, cell: ({ row }: any) => <span className="font-medium">{row.cedente}</span> },
  { 
    id: "status", 
    header: "Status",
    enableColumnFilter: true,
    cell: ({ row }: any) => {
      const colors: any = { liquidado: "success", pendente: "warning", atrasado: "danger" };
      return <Badge color={colors[row.status]} size="sm" className="font-bold">{row.status.toUpperCase()}</Badge>;
    }
  },
  { id: "taxa", header: "Taxa" },
  { id: "data", header: "Data de Venc.", enableColumnFilter: true },
  { 
    id: "valor", 
    header: "Valor Líquido",
    cell: ({ row }: any) => `R$ ${row.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
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

export default function OperacoesPage() {
  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-end justify-between shrink-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="t-h3 !text-2xl text-fg-1 tracking-tight">Operações</h1>
          <p className="t-body !text-fg-3 mt-0.5">Listagem completa de antecipações e status financeiro.</p>
        </motion.div>

        <div className="flex items-center gap-2">
          <Button variant="outline" color="neutral" className="h-9 px-4 text-xs font-bold" icon="download">
            Exportar
          </Button>
          <Button className="h-9 px-4 text-xs font-bold shadow-md shadow-brand-blue-500/10" icon="plus">
            Cadastrar
          </Button>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={operationsData} 
        totalItems={operationsData.length} 
        pageSize={10} 
        pageIndex={0} 
        onPageChange={() => {}} 
        onPageSizeChange={() => {}} 
        onFilterChange={() => {}} 
      />
    </div>
  );
}
