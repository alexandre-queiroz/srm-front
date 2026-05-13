"use client";

import React from "react";
import Icon from "@/components/ui/icon";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Select from "@/components/ui/select";

export default function ParametrosPage() {
  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="t-h1 text-fg-1">Parâmetros Gerais</h1>
        <p className="t-body text-fg-3">Configurações globais do sistema e regras de negócio da SRM.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Rules */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="settings" size={20} className="text-brand-blue-500" />
            <h2 className="t-h4">Regras de Operação</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-surface-alt/50 rounded-xl border border-border-subtle/50">
              <div>
                <p className="text-sm font-bold text-fg-1">Limite Automático de Risco</p>
                <p className="text-xs text-fg-3">Permitir aprovação automática para títulos até R$ 50k.</p>
              </div>
              <Switch defaultChecked color="brand" />
            </div>

            <div className="flex items-center justify-between p-4 bg-surface-alt/50 rounded-xl border border-border-subtle/50">
              <div>
                <p className="text-sm font-bold text-fg-1">Bloqueio de Cedentes Atrasados</p>
                <p className="text-xs text-fg-3">Impedir novas operações se houver pendência &gt; 5 dias.</p>
              </div>
              <Switch defaultChecked color="danger" />
            </div>

            <Input 
              label="Taxa de Ad Valorem Padrão (%)" 
              defaultValue="0.15" 
              icon="percent" 
              hint="Aplicada sobre o valor de face dos títulos."
            />
          </div>
        </Card>

        {/* Financial Config */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="dollar-sign" size={20} className="text-brand-blue-500" />
            <h2 className="t-h4">Configurações Financeiras</h2>
          </div>

          <div className="space-y-6">
            <Select label="Fundo Principal de Liquidação" icon="landmark">
              <option value="1">FIDC SRM I - 12.345/0001-90</option>
              <option value="2">FIDC SRM II - 98.765/0001-21</option>
            </Select>

            <Input 
              label="Horário Limite para TED (Cut-off)" 
              defaultValue="16:30" 
              icon="clock" 
              hint="Operações aprovadas após este horário serão liquidadas no D+1."
            />

            <div className="pt-4 flex justify-end gap-3">
              <Button variant="soft" color="neutral">Resetar Padrões</Button>
              <Button color="brand" icon="save">Salvar Alterações</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
