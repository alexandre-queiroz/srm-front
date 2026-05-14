"use client";

import React, { useState, useTransition } from "react";
import { motion } from "framer-motion";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Icon from "@/components/ui/icon";
import type { Company } from "@/types";

const columns = [
  {
    id: "name",
    header: "Razão Social",
    enableColumnFilter: true,
    cell: ({ row }: { row: Company }) => row.social_reason,
  },
  {
    id: "fantasy_name",
    header: "Nome Fantasia",
    enableColumnFilter: true,
    cell: ({ row }: { row: Company }) => row.fantasy_name ?? "—",
  },
  {
    id: "cnpj",
    header: "CNPJ",
    enableColumnFilter: true,
    cell: ({ row }: { row: Company }) =>
      row.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5"),
  },
  {
    id: "created_at",
    header: "Cadastrado em",
    cell: ({ row }: { row: Company }) => new Date(row.created_at).toLocaleDateString("pt-BR"),
  },
  {
    id: "status",
    header: "Status",
    cell: () => (
      <Badge color="success" size="sm" className="font-bold">
        ATIVO
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Ações",
    cell: () => (
      <div className="flex items-center gap-1">
        <button
          className="p-1 hover:bg-brand-blue-50 text-brand-blue-600 rounded-lg transition-colors cursor-pointer"
          title="Editar"
        >
          <Icon name="edit" size={16} />
        </button>
      </div>
    ),
  },
];

interface Props {
  initialData: Company[];
  fetchCompanies: (params?: {
    social_reason?: string;
    social_reason_op?: string;
    fantasy_name?: string;
    fantasy_name_op?: string;
    cnpj?: string;
    cnpj_op?: string;
  }) => Promise<Company[]>;
}

export function CedentesView({ initialData, fetchCompanies }: Props) {
  const [data, setData] = useState(initialData);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const loadData = (nextFilters: Record<string, string>) => {
    startTransition(async () => {
      const result = await fetchCompanies({
        social_reason: nextFilters.social_reason,
        social_reason_op: nextFilters.social_reason_op,
        fantasy_name: nextFilters.fantasy_name,
        fantasy_name_op: nextFilters.fantasy_name_op,
        cnpj: nextFilters.cnpj,
        cnpj_op: nextFilters.cnpj_op,
      });
      setData(result);
    });
  };

  const handleFilterChange = (columnId: string, value: string, operator?: string) => {
    const key = columnId === "name" ? "social_reason" : columnId;
    const nextFilters = { ...filters, [key]: value };
    if (!value) {
      delete nextFilters[key];
      delete nextFilters[`${key}_op`];
    } else if (operator) {
      nextFilters[`${key}_op`] = operator;
    }
    setFilters(nextFilters);
    loadData(nextFilters);
  };

  return (
    <div className="h-full flex flex-col gap-6">
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
          <Button
            variant="outline"
            color="neutral"
            className="h-9 px-4 text-xs font-bold"
            icon="refresh-cw"
            onClick={() => loadData(filters)}
            isLoading={isPending}
          >
            Atualizar
          </Button>
          <Button className="h-9 px-4 text-xs font-bold shadow-md shadow-brand-blue-500/10" icon="plus">
            Cadastrar
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
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}
