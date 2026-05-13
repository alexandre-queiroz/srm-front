"use client";

import React, { useState, useTransition } from "react";
import { motion } from "framer-motion";
import Icon from "@/components/ui/icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { ProductType } from "@/types";
import { toast } from "sonner";

const columns = [
  { 
    id: "name", 
    header: "Produto", 
    enableColumnFilter: true, 
    cell: ({ row }: { row: ProductType }) => <span className="font-bold">{row.name}</span> 
  },
  { 
    id: "spread", 
    header: "Spread Médio (a.a.)",
    cell: ({ row }: { row: ProductType }) => `${(Number(row.spread) * 100).toFixed(2)}%`
  },
  { 
    id: "is_active", 
    header: "Status",
    cell: ({ row }: { row: ProductType }) => (
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
      </div>
    )
  }
];

interface Props {
  initialData: ProductType[];
  fetchProductTypes: () => Promise<ProductType[]>;
}

export function ProdutosView({ initialData, fetchProductTypes }: Props) {
  const [data, setData] = useState(initialData);
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(async () => {
      try {
        const result = await fetchProductTypes();
        setData(result);
      } catch (err: any) {
        toast.error("Erro ao carregar produtos.");
      }
    });
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-end justify-between shrink-0">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="t-h3 !text-2xl text-fg-1 tracking-tight">Produtos</h1>
          <p className="t-body !text-fg-3 mt-0.5">Configuração de tipos de recebíveis e spreads operacionais.</p>
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
            Atualizar
          </Button>
          <Button className="h-9 px-4 text-xs font-bold shadow-md shadow-brand-blue-500/10" icon="plus">
            Novo Produto
          </Button>
        </div>
      </div>
      <DataTable 
        columns={columns} 
        data={data} 
        totalItems={data.length} 
        pageSize={data.length} 
        pageIndex={0} 
        onPageChange={() => {}} 
        onPageSizeChange={() => {}} 
        onFilterChange={() => {}} 
      />
    </div>
  );
}
