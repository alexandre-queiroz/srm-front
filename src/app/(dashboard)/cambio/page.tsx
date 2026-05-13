"use client";

import React from "react";
import { motion } from "framer-motion";
import Icon from "@/components/ui/icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

const ratesData = [
  { pair: "USD/BRL", bid: 5.1245, ask: 5.1482, change: "+0.45%", status: "Ativo" },
  { pair: "EUR/BRL", bid: 5.5412, ask: 5.5690, change: "-0.12%", status: "Ativo" },
  { pair: "GBP/BRL", bid: 6.4230, ask: 6.4580, change: "+0.22%", status: "Ativo" },
];

const columns = [
  { id: "pair", header: "Par de Moedas", enableColumnFilter: true, cell: ({ row }: any) => <span className="font-bold">{row.pair}</span> },
  { id: "bid", header: "Compra", cell: ({ row }: any) => row.bid.toFixed(4) },
  { id: "ask", header: "Venda", cell: ({ row }: any) => row.ask.toFixed(4) },
  { 
    id: "change", 
    header: "Variação", 
    cell: ({ row }: any) => (
      <span className={row.change.startsWith('+') ? "text-srm-success-600 font-bold" : "text-srm-danger-600 font-bold"}>
        {row.change}
      </span>
    )
  },
  { 
    id: "status", 
    header: "Status",
    cell: ({ row }: any) => <Badge color="success" size="sm" className="font-bold">{row.status.toUpperCase()}</Badge>
  },
  {
    id: "actions",
    header: "Ações",
    cell: () => (
      <div className="flex items-center gap-1">
        <button className="p-2 hover:bg-brand-blue-50 text-brand-blue-600 rounded-lg transition-colors cursor-pointer" title="Configurar Alertas">
          <Icon name="bell" size={16} />
        </button>
        <button className="p-2 hover:bg-brand-blue-50 text-brand-blue-600 rounded-lg transition-colors cursor-pointer" title="Histórico">
          <Icon name="activity" size={16} />
        </button>
      </div>
    )
  }
];

export default function CambioPage() {
  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-end justify-between shrink-0">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="t-h3 !text-2xl text-fg-1 tracking-tight">Câmbio</h1>
          <p className="t-body !text-fg-3 mt-0.5">Acompanhamento de taxas em tempo real para operações internacionais.</p>
        </motion.div>
        <div className="flex items-center gap-2">
          <Button variant="outline" color="neutral" className="h-9 px-4 text-xs font-bold" icon="refresh-cw">Atualizar Taxas</Button>
        </div>
      </div>
      <DataTable columns={columns} data={ratesData} totalItems={ratesData.length} pageSize={10} pageIndex={0} onPageChange={() => {}} onPageSizeChange={() => {}} onFilterChange={() => {}} />
    </div>
  );
}
