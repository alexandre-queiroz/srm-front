"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/ui/icon";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import Select from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { SystemParam } from "@/types";
import { toast } from "sonner";

interface Props {
  initialParams: SystemParam[];
  updateParam: (key: string, value: string) => Promise<SystemParam>;
}

export function ParametrosView({ initialParams, updateParam }: Props) {
  const [params, setParams] = useState(initialParams);
  const [isUpdating, setIsUpdating] = useState(false);

  const getParam = (key: string) => params.find((p) => p.key === key)?.value || "";

  const handleUpdate = async (key: string, value: string) => {
    setIsUpdating(true);
    try {
      const updated = await updateParam(key, value);
      setParams((prev) => prev.map((p) => (p.key === key ? updated : p)));
      toast.success("Parâmetro atualizado com sucesso.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar parâmetro.");
    } finally {
      setIsUpdating(false);
    }
  };

  const currencies = [
    { id: "BRL", name: "Real Brasileiro", symbol: "R$", status: "Principal" },
    { id: "USD", name: "Dólar Americano", symbol: "$", status: "Ativo" },
    { id: "EUR", name: "Euro", symbol: "€", status: "Ativo" },
    { id: "GBP", name: "Libra Esterlina", symbol: "£", status: "Inativo" },
  ];

  const exchangePairs = [
    { from: "USD", to: "BRL", source: "AwesomeAPI / BCB", status: "Ativo" },
    { from: "EUR", to: "BRL", source: "AwesomeAPI", status: "Inativo" },
  ];

  return (
    <div className="flex h-full flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="t-h3 text-fg-1 !text-2xl tracking-tight">Parâmetros Gerais</h1>
        <p className="t-body !text-fg-3 mt-0.5">Configurações globais do sistema e regras de negócio da SRM.</p>
      </motion.div>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="bg-surface-alt mb-6 rounded-xl p-1">
          <TabsTrigger value="geral" className="gap-2">
            <Icon name="settings" size={16} />
            Regras Gerais
          </TabsTrigger>
          <TabsTrigger value="moedas" className="gap-2">
            <Icon name="coins" size={16} />
            Moedas
          </TabsTrigger>
          <TabsTrigger value="cambio" className="gap-2">
            <Icon name="dollar-sign" size={16} />
            Câmbio
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          {/* Section: Geral */}
          <TabsContent value="geral">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <Card className="space-y-6 p-6">
                <div className="mb-2 flex items-center gap-2">
                  <Icon name="trending-up" size={20} className="text-brand-blue-500" />
                  <h2 className="t-h4">Taxas de Referência</h2>
                </div>

                <div className="space-y-6">
                  <Input
                    label="Taxa Selic / CDI Anual (%)"
                    value={(Number(getParam("base_rate_annual")) * 100).toFixed(2)}
                    onChange={(e) => {}} // TODO: local state for input
                    onBlur={(e) => handleUpdate("base_rate_annual", (Number(e.target.value) / 100).toString())}
                    icon="percent"
                    hint="Taxa base utilizada no cálculo de deságio."
                    disabled={isUpdating}
                  />

                  <div className="bg-surface-alt/50 border-border-subtle/50 flex items-center justify-between rounded-xl border p-4">
                    <div>
                      <p className="text-fg-1 text-sm font-bold">Aprovação Automática</p>
                      <p className="text-fg-3 text-xs">Permitir aprovação automática para títulos de baixo risco.</p>
                    </div>
                    <Switch defaultChecked color="brand" />
                  </div>
                </div>
              </Card>

              <Card className="space-y-6 p-6">
                <div className="mb-2 flex items-center gap-2">
                  <Icon name="clock" size={20} className="text-brand-blue-500" />
                  <h2 className="t-h4">Operacional</h2>
                </div>

                <div className="space-y-6">
                  <Input
                    label="Horário Limite para TED (Cut-off)"
                    defaultValue="16:30"
                    icon="clock"
                    hint="Horário máximo para liquidação no mesmo dia."
                  />
                  <Input label="Prazo Máximo de Antecipação (Dias)" defaultValue="180" icon="calendar" />
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Section: Moedas */}
          <TabsContent value="moedas">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {currencies.map((currency) => (
                <Card key={currency.id} className="group relative flex flex-col items-center space-y-3 overflow-hidden p-5 text-center">
                  <div className="bg-brand-blue-50 text-brand-blue-600 group-hover:bg-brand-blue-600 flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold transition-all duration-300 group-hover:text-white">
                    {currency.symbol}
                  </div>
                  <div>
                    <p className="text-fg-1 font-bold">{currency.id}</p>
                    <p className="text-fg-3 text-xs">{currency.name}</p>
                  </div>
                  <Badge
                    color={currency.status === "Inativo" ? "neutral" : currency.status === "Principal" ? "brand" : "success"}
                    size="sm"
                  >
                    {currency.status}
                  </Badge>
                  <button className="text-fg-3 hover:text-brand-blue-600 absolute top-2 right-2 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <Icon name="settings" size={14} />
                  </button>
                </Card>
              ))}
              <button className="border-border-subtle text-fg-disabled hover:border-brand-blue-400 hover:text-brand-blue-500 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-5 transition-all">
                <Icon name="plus" size={24} />
                <span className="text-xs font-bold tracking-widest uppercase">Nova Moeda</span>
              </button>
            </div>
          </TabsContent>

          {/* Section: Câmbio */}
          <TabsContent value="cambio">
            <Card className="overflow-hidden">
              <div className="border-border-subtle bg-surface-alt/30 flex items-center justify-between border-b p-6">
                <div>
                  <h3 className="text-fg-1 text-sm font-bold">Pares de Moedas Ativos</h3>
                  <p className="text-fg-3 text-xs">Configuração de fontes e pares para conversão.</p>
                </div>
                <Button size="sm" icon="plus">
                  Adicionar Par
                </Button>
              </div>
              <div className="divide-border-subtle divide-y">
                {exchangePairs.map((pair) => (
                  <div
                    key={`${pair.from}-${pair.to}`}
                    className="hover:bg-surface-alt/20 flex items-center justify-between p-6 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <div className="bg-brand-blue-100 text-brand-blue-700 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold">
                          {pair.from}
                        </div>
                        <div className="bg-surface-alt text-fg-3 -ml-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold">
                          {pair.to}
                        </div>
                      </div>
                      <div>
                        <p className="text-fg-1 text-sm font-bold">
                          {pair.from} para {pair.to}
                        </p>
                        <p className="text-fg-3 text-xs">Fonte: {pair.source}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-fg-disabled mb-1 text-[10px] font-bold uppercase">Status</p>
                        <Badge color={pair.status === "Ativo" ? "success" : "neutral"} size="sm">
                          {pair.status}
                        </Badge>
                      </div>
                      <Switch defaultChecked={pair.status === "Ativo"} color="brand" />
                      <button className="hover:bg-surface-alt text-fg-3 rounded-lg p-2">
                        <Icon name="settings" size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
