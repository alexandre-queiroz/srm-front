"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Icon from "@/components/ui/icon";
import Badge from "@/components/ui/badge";
import KPI from "@/components/ui/kpi";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { SimpleBarChart } from "@/components/ui/chart";

// Mock data for 30 days of anticipations
const dailyAnticipations = Array.from({ length: 30 }, (_, i) => ({
  label: (i + 1).toString(),
  value: Math.floor(Math.random() * 800000) + 400000,
}));

// Mock data for the table - current month focus
const currentMonthOperations = [
  { id: "OP-9481", cedente: "Logística Alpha S.A.", status: "liquidado", data: "13/05/2026", valor: 125000 },
  { id: "OP-9482", cedente: "Tecnologia Beta Ltda.", status: "pendente", data: "13/05/2026", valor: 45200 },
  { id: "OP-9483", cedente: "Indústria Gamma", status: "liquidado", data: "12/05/2026", valor: 289000 },
  { id: "OP-9484", cedente: "Varejo Delta S.A.", status: "atrasado", data: "11/05/2026", valor: 12400 },
  { id: "OP-9485", cedente: "Construtora Epsilon", status: "liquidado", data: "10/05/2026", valor: 540000 },
];

const columns = [
  { id: "id", header: "ID" },
  { id: "cedente", header: "Cedente" },
  { 
    id: "status", 
    header: "Status",
    cell: ({ row }: any) => {
      const status = row.status;
      const colors: any = {
        liquidado: "success",
        pendente: "warning",
        atrasado: "danger"
      };
      return <Badge color={colors[status]} size="sm" className="text-[10px] font-bold">{status.toUpperCase()}</Badge>;
    }
  },
  { id: "data", header: "Data" },
  { 
    id: "valor", 
    header: "Valor",
    cell: ({ row }: any) => `R$ ${row.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-[1600px] mx-auto space-y-4 pb-12">
      {/* Welcome Header */}
      <div className="flex items-end justify-between">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="t-h3 !text-2xl text-fg-1 tracking-tight">Olá, Alexandre</h1>
          <p className="t-body !text-fg-3 mt-0.5">Aqui está o resumo das operações de <span className="font-bold text-fg-2">Maio/2026</span>.</p>
        </motion.div>

        <div className="flex items-center gap-2">
          <Button variant="outline" color="neutral" className="h-9 px-4 text-xs" icon="download">
            Exportar
          </Button>
          <Button className="h-9 px-4 text-xs shadow-md shadow-brand-blue-500/10" icon="plus">
            Nova Operação
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI 
          label="Total Operado (Mês)" 
          value="R$ 12.4M" 
          delta="+12.5%" 
          deltaTone="success" 
        />
        <KPI 
          label="Limite Disponível" 
          value="R$ 4.2M" 
          delta="65% usado" 
          deltaTone="neutral" 
        />
        <KPI 
          label="Taxa Média" 
          value="2.45%" 
          delta="-0.2%" 
          deltaTone="success" 
        />
        <KPI 
          label="Inadimplência" 
          value="1.2%" 
          delta="+0.1%" 
          deltaTone="danger" 
        />
      </div>

      {/* Full Width Chart Row - 30 Days */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-8">
            <h3 className="t-h4 flex items-center gap-2">
              <Icon name="trending-up" size={18} className="text-brand-blue-500" />
              Volume de Antecipações (30 dias)
            </h3>
            <div className="flex items-center gap-2 text-xs text-fg-3 font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-brand-blue-500" />
              Mês de Maio
            </div>
        </div>
        <SimpleBarChart data={dailyAnticipations} className="h-44" />
      </Card>

      {/* Bottom Grid: Table & Sidebar - Synced Heights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        
        {/* Operations Table Column */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="t-h4 flex items-center gap-2">
              <Icon name="file-text" size={18} className="text-brand-blue-500" />
              Operações do Mês
            </h3>
            <button className="text-xs font-bold text-brand-blue-600 hover:underline">Ver todas</button>
          </div>
          
          <div className="flex-1">
            <DataTable 
              columns={columns} 
              data={currentMonthOperations} 
              totalItems={5} 
              pageSize={10} 
              pageIndex={0} 
              onPageChange={() => {}} 
              onPageSizeChange={() => {}} 
              onFilterChange={() => {}} 
            />
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="flex flex-col">
           <div className="flex items-center justify-between mb-4">
             <h3 className="t-h4 flex items-center gap-2">
                <Icon name="award" size={18} className="text-brand-blue-500" />
                Maiores Antecipadores
             </h3>
             <button className="text-xs font-bold text-brand-blue-600 hover:underline">Ver todos</button>
           </div>
           
           <div className="flex-1 flex flex-col">
              <Card className="flex-1 divide-y divide-border-subtle overflow-hidden">
                  {[
                    { name: "Alpha S.A.", advanced: "4.2M", available: "1.5M", growth: "+12%", color: "bg-brand-blue-500", usage: 74 },
                    { name: "Gamma Ind.", advanced: "3.8M", available: "500k", growth: "+5%", color: "bg-brand-blue-800", usage: 88 },
                    { name: "Beta Ltda.", advanced: "1.2M", available: "2.8M", growth: "0%", color: "bg-brand-orange-500", usage: 30 },
                    { name: "Sigma Co.", advanced: "950k", available: "1.1M", growth: "+18%", color: "bg-srm-success-500", usage: 45 },
                  ].map((cedente) => (
                    <div key={cedente.name} className="p-3.5 hover:bg-surface-alt/50 transition-colors cursor-pointer group flex flex-col justify-center h-1/4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shadow-sm", cedente.color)}>
                            {cedente.name.substring(0, 2).toUpperCase()}
                          </div>
                          <p className="text-sm font-bold text-fg-1 group-hover:text-brand-blue-600 transition-colors">{cedente.name}</p>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                          cedente.growth.startsWith('+') ? 'text-srm-success-600 bg-srm-success-50' : 'text-fg-3 bg-surface-alt'
                        }`}>
                          {cedente.growth}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 pl-11 mb-2">
                        <div className="flex flex-col">
                          <span className="text-[8px] text-fg-3 uppercase tracking-widest font-bold">Antecipado</span>
                          <span className="text-xs font-bold text-brand-blue-600">R$ {cedente.advanced}</span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-[8px] text-fg-3 uppercase tracking-widest font-bold">Lim. Disponível</span>
                          <span className="text-xs font-bold text-fg-1">R$ {cedente.available}</span>
                        </div>
                      </div>

                      <div className="pl-11 pr-2">
                        <div className="h-1 w-full bg-surface-alt rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full transition-all duration-500", 
                              cedente.usage > 80 ? "bg-srm-danger-500" : "bg-brand-blue-500"
                            )}
                            style={{ width: `${cedente.usage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </Card>
              {/* Spacer div to match DataTable pagination height */}
              <div className="h-[52px]" /> 
           </div>
        </div>
      </div>
    </div>
  );
}
