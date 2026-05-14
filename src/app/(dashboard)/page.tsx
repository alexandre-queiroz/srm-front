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
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalTitle, 
  ModalDescription, 
  ModalFooter 
} from "@/components/ui/modal";
import Input from "@/components/ui/input";
import Checkbox from "@/components/ui/checkbox";
import Select from "@/components/ui/select";
import { toast } from "sonner";

// Stable mock data for 30 days of anticipations to avoid hydration mismatch
const dailyAnticipations = [
  { label: "1", value: 450000 }, { label: "2", value: 520000 }, { label: "3", value: 480000 },
  { label: "4", value: 610000 }, { label: "5", value: 590000 }, { label: "6", value: 680000 },
  { label: "7", value: 720000 }, { label: "8", value: 650000 }, { label: "9", value: 580000 },
  { label: "10", value: 610000 }, { label: "11", value: 750000 }, { label: "12", value: 820000 },
  { label: "13", value: 780000 }, { label: "14", value: 850000 }, { label: "15", value: 920000 },
  { label: "16", value: 880000 }, { label: "17", value: 840000 }, { label: "18", value: 790000 },
  { label: "19", value: 820000 }, { label: "20", value: 950000 }, { label: "21", value: 1100000 },
  { label: "22", value: 1050000 }, { label: "23", value: 980000 }, { label: "24", value: 920000 },
  { label: "25", value: 880000 }, { label: "26", value: 850000 }, { label: "27", value: 910000 },
  { label: "28", value: 940000 }, { label: "29", value: 980000 }, { label: "30", value: 1020000 },
];

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
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [selectedCedente, setSelectedCedente] = React.useState("");
  const [selectedTitles, setSelectedTitles] = React.useState<string[]>([]);

  const handleNextStep = () => setStep((s) => Math.min(s + 1, 3));
  const handlePrevStep = () => setStep((s) => Math.max(s - 1, 1));
  const handleClose = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setStep(1);
      setSelectedCedente("");
      setSelectedTitles([]);
    }, 300);
  };

  const titles = [
    { id: "NF-2039", sacado: "Supermercados Extra", valor: 12500, vencimento: "20/06/2026" },
    { id: "NF-2040", sacado: "Lojas Americanas", valor: 8900, vencimento: "15/06/2026" },
    { id: "NF-2041", sacado: "Magazine Luiza", valor: 45200, vencimento: "25/06/2026" },
    { id: "NF-2042", sacado: "Carrefour S.A.", valor: 32000, vencimento: "30/06/2026" },
    { id: "NF-2043", sacado: "Mercado Livre", valor: 15600, vencimento: "18/06/2026" },
  ];

  const toggleTitle = (id: string) => {
    setSelectedTitles(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const totalValue = titles
    .filter(t => selectedTitles.includes(t.id))
    .reduce((acc, t) => acc + t.valor, 0);

  const discount = totalValue * 0.025; // 2.5% fixed for simulation
  const netValue = totalValue - discount;
  return (
    <div className="h-full overflow-y-auto"><div className="max-w-[1600px] mx-auto space-y-4 pb-12">
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
          <Button 
            className="h-9 px-4 text-xs shadow-md shadow-brand-blue-500/10" 
            icon="plus"
            onClick={() => setIsModalOpen(true)}
          >
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
      {/* Simulation Multi-Step Modal */}
      <Modal open={isModalOpen} onOpenChange={handleClose}>
        <ModalContent onClose={handleClose} className="max-w-xl">
          <ModalHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                step >= 1 ? "bg-brand-blue-500 text-white" : "bg-surface-alt text-fg-3"
              )}>1</div>
              <div className="h-px w-4 bg-border-subtle" />
              <div className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                step >= 2 ? "bg-brand-blue-500 text-white" : "bg-surface-alt text-fg-3"
              )}>2</div>
              <div className="h-px w-4 bg-border-subtle" />
              <div className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                step >= 3 ? "bg-brand-blue-500 text-white" : "bg-surface-alt text-fg-3"
              )}>3</div>
            </div>
            <ModalTitle>
              {step === 1 && "Selecionar Cedente"}
              {step === 2 && "Selecionar Títulos"}
              {step === 3 && "Resumo da Simulação"}
            </ModalTitle>
            <ModalDescription>
              {step === 1 && "Escolha a empresa que deseja realizar a antecipação."}
              {step === 2 && "Marque os títulos que farão parte desta operação."}
              {step === 3 && "Confira as taxas e valores finais projetados."}
            </ModalDescription>
          </ModalHeader>

          <div className="p-6 pt-2">
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Select 
                  label="Cedente" 
                  value={selectedCedente} 
                  onChange={(val) => setSelectedCedente(val)}
                  options={[
                    { label: "Selecione um cedente", value: "" },
                    { label: "Logística Alpha S.A.", value: "alpha" },
                    { label: "Tecnologia Beta Ltda.", value: "beta" },
                    { label: "Indústria Gamma", value: "gamma" },
                  ]}
                />
                <Input label="CNPJ (Auto-preenchimento)" disabled value={selectedCedente ? "12.345.678/0001-90" : ""} />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="rounded-xl border border-border-subtle overflow-hidden">
                  <div className="bg-surface-alt/50 px-4 py-2 border-b border-border-subtle flex justify-between items-center">
                    <span className="text-[11px] font-bold text-fg-3 uppercase tracking-wider">Título</span>
                    <span className="text-[11px] font-bold text-fg-3 uppercase tracking-wider">Valor</span>
                  </div>
                  <div className="divide-y divide-border-subtle max-h-[240px] overflow-auto">
                    {titles.map((t) => (
                      <div 
                        key={t.id} 
                        className={cn(
                          "flex items-center justify-between p-4 cursor-pointer transition-colors hover:bg-surface-alt/30",
                          selectedTitles.includes(t.id) && "bg-brand-blue-50/30"
                        )}
                        onClick={() => toggleTitle(t.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            checked={selectedTitles.includes(t.id)} 
                            onChange={() => toggleTitle(t.id)} 
                          />
                          <div>
                            <p className="text-sm font-bold text-fg-1">{t.id}</p>
                            <p className="text-xs text-fg-3">{t.sacado}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-fg-1">R$ {t.valor.toLocaleString('pt-BR')}</p>
                          <p className="text-[10px] text-fg-3">Vence em {t.vencimento}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center px-2">
                  <span className="text-xs text-fg-3">{selectedTitles.length} títulos selecionados</span>
                  <span className="text-sm font-bold text-brand-blue-600">Total: R$ {totalValue.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-surface-alt/50 border border-border-subtle">
                    <p className="text-[10px] font-bold text-fg-3 uppercase tracking-widest mb-1">Valor Bruto</p>
                    <p className="text-lg font-bold text-fg-1">R$ {totalValue.toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-brand-orange-50 border border-brand-orange-100">
                    <p className="text-[10px] font-bold text-brand-orange-700 uppercase tracking-widest mb-1">Desconto (Fees)</p>
                    <p className="text-lg font-bold text-brand-orange-600">- R$ {discount.toLocaleString('pt-BR')}</p>
                  </div>
                </div>
                
                <div className="p-5 rounded-2xl bg-brand-blue-500 text-white shadow-lg shadow-brand-blue-500/20">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-80 mb-1 text-center">Valor Líquido a Receber</p>
                  <p className="text-3xl font-bold text-center">R$ {netValue.toLocaleString('pt-BR')}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs py-1">
                    <span className="text-fg-3">Taxa de Desconto (Mensal)</span>
                    <span className="font-bold text-fg-1">2.15%</span>
                  </div>
                  <div className="flex justify-between text-xs py-1">
                    <span className="text-fg-3">Ad Valorem</span>
                    <span className="font-bold text-fg-1">0.35%</span>
                  </div>
                  <div className="flex justify-between text-xs py-1">
                    <span className="text-fg-3">IOF</span>
                    <span className="font-bold text-fg-1">R$ 42,30</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <ModalFooter>
            {step > 1 && (
              <Button variant="ghost" color="neutral" onClick={handlePrevStep}>
                Voltar
              </Button>
            )}
            <div className="flex-1" />
            <Button variant="soft" color="neutral" onClick={handleClose}>
              Cancelar
            </Button>
            {step < 3 ? (
              <Button 
                color="brand" 
                onClick={handleNextStep}
                disabled={step === 1 ? !selectedCedente : selectedTitles.length === 0}
                iconRight="arrowRight"
              >
                Continuar
              </Button>
            ) : (
              <Button 
                color="brand" 
                onClick={() => {
                  toast.success("Simulação enviada com sucesso!", {
                    description: "A operação foi criada e está aguardando aprovação."
                  });
                  handleClose();
                }}
                icon="check"
              >
                Confirmar Operação
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div></div>
  );
}
