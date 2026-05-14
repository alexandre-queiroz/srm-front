"use client";

import React, { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from "@/components/ui/modal";
import type { Currency } from "@/types";

const columns = [
  {
    id: "code",
    header: "Código",
    enableColumnFilter: true,
    cell: ({ row }: { row: Currency }) => row.code,
  },
  {
    id: "name",
    header: "Nome",
    enableColumnFilter: true,
    cell: ({ row }: { row: Currency }) => row.name,
  },
  {
    id: "symbol",
    header: "Símbolo",
    cell: ({ row }: { row: Currency }) => row.symbol,
  },
  {
    id: "is_base",
    header: "Moeda Base",
    cell: ({ row }: { row: Currency }) =>
      row.is_base ? (
        <Badge color="success" size="sm">
          SIM
        </Badge>
      ) : null,
  },
  {
    id: "is_active",
    header: "Status",
    cell: ({ row }: { row: Currency }) => (
      <Badge color={row.is_active ? "success" : "neutral"} size="sm" className="font-bold">
        {row.is_active ? "ATIVO" : "INATIVO"}
      </Badge>
    ),
  },
  {
    id: "created_at",
    header: "Cadastrado em",
    cell: ({ row }: { row: Currency }) => new Date(row.created_at).toLocaleDateString("pt-BR"),
  },
];

interface Props {
  initialData: Currency[];
  fetchCurrencies: (params?: { code?: string; code_op?: string; name?: string; name_op?: string }) => Promise<Currency[]>;
  addCurrency: (payload: { code: string; name: string; symbol: string; is_base: boolean }) => Promise<Currency>;
}

export function MoedasView({ initialData, fetchCurrencies, addCurrency }: Props) {
  const [data, setData] = useState(initialData);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ code: "", name: "", symbol: "", is_base: false });

  const loadData = (nextFilters: Record<string, string> = filters) => {
    startTransition(async () => {
      const result = await fetchCurrencies({
        code: nextFilters.code,
        code_op: nextFilters.code_op,
        name: nextFilters.name,
        name_op: nextFilters.name_op,
      });
      setData(result);
    });
  };

  const handleFilterChange = (columnId: string, value: string, operator?: string) => {
    const nextFilters = { ...filters, [columnId]: value };
    if (!value) {
      delete nextFilters[columnId];
      delete nextFilters[`${columnId}_op`];
    } else if (operator) {
      nextFilters[`${columnId}_op`] = operator;
    }
    setFilters(nextFilters);
    loadData(nextFilters);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.name || !form.symbol) return;
    setIsSubmitting(true);
    try {
      const created = await addCurrency(form);
      setData((prev) => [...prev, created].sort((a, b) => a.code.localeCompare(b.code)));
      toast.success(`Moeda ${created.code} cadastrada com sucesso.`);
      setModalOpen(false);
      setForm({ code: "", name: "", symbol: "", is_base: false });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao cadastrar moeda.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex shrink-0 items-end justify-between">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="t-h3 text-fg-1 !text-2xl tracking-tight">Moedas</h1>
          <p className="t-body !text-fg-3 mt-0.5">Moedas suportadas para emissão e liquidação de recebíveis.</p>
        </motion.div>

        <Button className="shadow-brand-blue-500/10 h-9 px-4 text-xs font-bold shadow-md" icon="plus" onClick={() => setModalOpen(true)}>
          Cadastrar
        </Button>
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

      <Modal open={modalOpen} onOpenChange={() => setModalOpen(false)}>
        <ModalContent onClose={() => setModalOpen(false)}>
          <ModalHeader>
            <ModalTitle>Cadastrar Moeda</ModalTitle>
            <ModalDescription>Adicione uma nova moeda ao sistema (ISO 4217).</ModalDescription>
          </ModalHeader>

          <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-fg-1 mb-1.5 block text-[13px] font-medium">Código ISO</label>
                <input
                  className="border-border-default bg-surface focus:ring-brand-blue-300 w-full rounded-xl border px-3 py-2 font-mono text-sm uppercase focus:ring-2 focus:outline-none"
                  placeholder="BRL"
                  maxLength={3}
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                  required
                />
              </div>
              <div>
                <label className="text-fg-1 mb-1.5 block text-[13px] font-medium">Símbolo</label>
                <input
                  className="border-border-default bg-surface focus:ring-brand-blue-300 w-full rounded-xl border px-3 py-2 font-mono text-sm focus:ring-2 focus:outline-none"
                  placeholder="R$"
                  maxLength={10}
                  value={form.symbol}
                  onChange={(e) => setForm((f) => ({ ...f, symbol: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-fg-1 mb-1.5 block text-[13px] font-medium">Nome completo</label>
              <input
                className="border-border-default bg-surface focus:ring-brand-blue-300 w-full rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                placeholder="Real Brasileiro"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="rounded"
                checked={form.is_base}
                onChange={(e) => setForm((f) => ({ ...f, is_base: e.target.checked }))}
              />
              <span className="text-fg-2 text-sm">Moeda base (liquidação)</span>
            </label>

            <ModalFooter className="-mx-6 mt-4">
              <Button variant="outline" color="neutral" type="button" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" isLoading={isSubmitting} icon="plus">
                Cadastrar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
}
