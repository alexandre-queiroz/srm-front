import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Checkbox from "@/components/ui/checkbox";
import Icon from "@/components/ui/icon";
import Input from "@/components/ui/input";
import KPI from "@/components/ui/kpi";
import Radio from "@/components/ui/radio";
import Select from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";
import Progress from "@/components/ui/progress";
import Skeleton from "@/components/ui/skeleton";
import Avatar from "@/components/ui/avatar";

export default function ComponentGallery() {
  return (
    <main className="p-8 max-w-5xl mx-auto space-y-16 bg-surface-canvas min-h-screen pb-24">
      <header>
        <h1 className="t-h1">Galeria de Componentes</h1>
        <p className="t-body-lg text-fg-2">Biblioteca de componentes atômicos da SRM Asset.</p>
      </header>

      {/* Forms Section */}
      <section className="space-y-8">
        <h2 className="t-h3 border-b border-border-subtle pb-2">Controles de Formulário</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Input label="E-mail" placeholder="usuario@srm.com.br" />
            <Select label="Moeda de Liquidação">
              <option value="BRL">Real (BRL)</option>
              <option value="USD">Dólar (USD)</option>
            </Select>
            <div className="flex gap-8">
              <div className="space-y-4">
                <p className="text-xs font-medium text-fg-2 uppercase tracking-wider">Checkboxes</p>
                <Checkbox label="Lembrar acesso" />
                <Checkbox label="Aceitar termos" checked readOnly />
              </div>
              <div className="space-y-4">
                <p className="text-xs font-medium text-fg-2 uppercase tracking-wider">Radios</p>
                <Radio label="Opção A" name="demo-radio" value="a" defaultChecked />
                <Radio label="Opção B" name="demo-radio" value="b" />
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <Input 
              label="Valor" 
              prefixAddon="R$" 
              placeholder="0,00" 
              hint="Valor de face do título"
            />
            <Input 
              label="CNPJ do Cedente" 
              error="CNPJ inválido ou não cadastrado" 
              defaultValue="12.345.678/0001-90"
            />
          </div>
        </div>
      </section>

      {/* Buttons & Status Section */}
      <section className="space-y-8">
        <h2 className="t-h3 border-b border-border-subtle pb-2">Ações e Status</h2>
        
        <div className="space-y-8">
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary" iconRight="arrowRight">Novo Lote</Button>
            <Button variant="accent">Liquidar Agora</Button>
            <Button variant="secondary">Filtrar</Button>
            <Button variant="danger" icon="alertCircle">Excluir</Button>
            <Button variant="ghost" icon="wallet">Carteira</Button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Badge tone="success">Aprovado</Badge>
            <Badge tone="warning">Em Fila</Badge>
            <Badge tone="danger">Rejeitado</Badge>
            <Badge tone="info">Processando</Badge>
            <Badge tone="neutral">Pendente</Badge>
          </div>
        </div>
      </section>

      {/* Feedback & Loading Section */}
      <section className="space-y-8">
        <h2 className="t-h3 border-b border-border-subtle pb-2">Feedback e Carregamento</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <p className="text-xs font-medium text-fg-2 uppercase tracking-wider">Spinners e Progress</p>
            <div className="flex items-center gap-6">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </div>
            <div className="space-y-4 w-full max-w-sm">
              <Progress value={45} />
              <Progress value={80} variant="accent" />
            </div>
          </div>
          
          <div className="space-y-6">
            <p className="text-xs font-medium text-fg-2 uppercase tracking-wider">Skeletons e Avatares</p>
            <div className="flex items-center gap-4">
              <Avatar name="Alexandre Queiroz" size="lg" />
              <div className="space-y-2 flex-1">
                <Skeleton variant="text" className="w-32" />
                <Skeleton variant="text" className="w-48 opacity-60" />
              </div>
            </div>
            <Card padding={16} className="space-y-4">
               <div className="flex gap-4">
                 <Skeleton variant="circle" className="w-12 h-12" />
                 <div className="space-y-2 flex-1 pt-1">
                   <Skeleton variant="text" />
                   <Skeleton variant="text" className="w-1/2" />
                 </div>
               </div>
            </Card>
          </div>
        </div>
      </section>

      {/* KPI Section */}
      <section className="space-y-8">
        <h2 className="t-h3 border-b border-border-subtle pb-2">Indicadores (KPIs)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPI label="Patrimônio Líquido" value="R$ 2,4 Bi" delta="+4,2%" deltaTone="success" />
          <KPI label="Inadimplência" value="0,85%" delta="+0,02%" deltaTone="danger" />
          <KPI label="Operações Hoje" value="128" meta="Meta: 150" deltaTone="neutral" />
        </div>
      </section>
    </main>
  );
}
