"use client";

import React from "react";
import { motion } from "framer-motion";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Icon from "@/components/ui/icon";

// Mock data for companies
const companiesData = [
  { id: "1", name: "Alpha Logística S.A.", cnpj: "12.345.678/0001-90", type: "Cedente", limit: 5000000, rating: "A+", status: "ativo" },
  { id: "2", name: "Beta Tech Solutions", cnpj: "98.765.432/0001-10", type: "Cedente", limit: 1200000, rating: "B", status: "ativo" },
  { id: "3", name: "Gamma Indústria Química", cnpj: "45.678.901/0001-22", type: "Sacado", limit: 8000000, rating: "A", status: "ativo" },
  { id: "4", name: "Delta Varejo Global", cnpj: "22.333.444/0001-55", type: "Cedente", limit: 500000, rating: "C", status: "revisao" },
  { id: "5", name: "Epsilon Construtora", cnpj: "11.222.333/0001-44", type: "Sacado", limit: 15000000, rating: "A-", status: "ativo" },
];

const columns = [
  { 
    id: "name", 
    header: "Nome", 
    enableColumnFilter: true,
    cell: ({ row }: any) => <span className="font-bold text-fg-1">{row.name}</span>
  },
  { 
    id: "cnpj", 
    header: "CNPJ", 
    enableColumnFilter: true,
    cell: ({ row }: any) => <span className="text-[11px] text-fg-3 font-mono">{row.cnpj}</span>
  },
  { 
    id: "type", 
    header: "Tipo",
    enableColumnFilter: true,
    cell: ({ row }: any) => (
      <Badge color={row.type === "Cedente" ? "brand" : "neutral"} size="sm" variant="outline" className="font-bold">
        {row.type}
      </Badge>
    )
  },
  { 
    id: "limit", 
    header: "Limite Total",
    cell: ({ row }: any) => `R$ ${row.limit.toLocaleString("pt-BR")}`
  },
  { 
    id: "rating", 
    header: "Rating",
    enableColumnFilter: true,
    cell: ({ row }: any) => (
      <span className="font-bold text-xs bg-surface-alt px-2 py-1 rounded">{row.rating}</span>
    )
  },
  { 
    id: "status", 
    header: "Status",
    enableColumnFilter: true,
    cell: ({ row }: any) => {
      const colors: any = { ativo: "success", revisao: "warning", bloqueado: "danger" };
      return <Badge color={colors[row.status]} size="sm" className="font-bold">{row.status.toUpperCase()}</Badge>;
    }
  },
  {
    id: "actions",
    header: "Ações",
    cell: () => (
      <div className="flex items-center gap-1">
        <button className="p-2 hover:bg-brand-blue-50 text-brand-blue-600 rounded-lg transition-colors cursor-pointer" title="Editar">
          <Icon name="edit" size={16} />
        </button>
        <button className="p-2 hover:bg-srm-danger-50 text-srm-danger-600 rounded-lg transition-colors cursor-pointer" title="Deletar">
          <Icon name="trash" size={16} />
        </button>
      </div>
    )
  }
];

export default function CedentesPage() {
  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header Padronizado */}
      <div className="flex items-end justify-between shrink-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="t-h3 !text-2xl text-fg-1 tracking-tight">Empresas</h1>
          <p className="t-body !text-fg-3 mt-0.5">Gestão de cedentes e sacados cadastrados no sistema.</p>
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

      {/* Tabela Padrão com Filtros por Coluna */}
      <DataTable 
        columns={columns} 
        data={companiesData} 
        totalItems={companiesData.length} 
        pageSize={10} 
        pageIndex={0} 
        onPageChange={() => {}} 
        onPageSizeChange={() => {}} 
        onFilterChange={() => {}} 
        minWidth="min-w-[1200px]"
      />
    </div>
  );
}
