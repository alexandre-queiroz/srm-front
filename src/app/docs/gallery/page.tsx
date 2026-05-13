"use client";

import { useState } from "react";

import Avatar from "@/components/ui/avatar";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleBarChart } from "@/components/ui/chart";
import Checkbox from "@/components/ui/checkbox";
import Icon from "@/components/ui/icon";
import Input from "@/components/ui/input";
import KPI from "@/components/ui/kpi";
import Progress from "@/components/ui/progress";
import Radio from "@/components/ui/radio";
import Select from "@/components/ui/select";
import Skeleton from "@/components/ui/skeleton";
import Spinner from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from "@/components/ui/modal";
import { DataTable, ColumnDef } from "@/components/ui/data-table";

export default function ComponentGallery() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // DataTable simulation state
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, { value: string; operator?: string }>>({});

  const allData = [
    { id: "OP-001", cedente: "Indústria XPTO Ltda", status: "Liquidado", data: "12/05/2026", valor: "R$ 250.000,00" },
    { id: "OP-002", cedente: "Comércio XYZ S/A", status: "Pendente", data: "13/05/2026", valor: "R$ 15.400,00" },
    { id: "OP-003", cedente: "Serviços ABC", status: "Rejeitado", data: "10/05/2026", valor: "R$ 8.900,00" },
    { id: "OP-004", cedente: "Tech Solutions", status: "Liquidado", data: "15/05/2026", valor: "R$ 42.000,00" },
    { id: "OP-005", cedente: "Agro Sul", status: "Pendente", data: "16/05/2026", valor: "R$ 1.250.000,00" },
    { id: "OP-006", cedente: "Construtora Alfa", status: "Liquidado", data: "18/05/2026", valor: "R$ 890.000,00" },
  ];

  // Simulating server side filtering & pagination
  const filteredData = allData.filter((row) => {
    return Object.entries(filters).every(([key, filterObj]) => {
      if (!filterObj || !filterObj.value) return true;
      
      const rowVal = String(row[key as keyof typeof row]).toLowerCase();
      const searchVal = filterObj.value.toLowerCase();
      
      if (filterObj.operator === "startswith") return rowVal.startsWith(searchVal);
      if (filterObj.operator === "endswith") return rowVal.endsWith(searchVal);
      if (filterObj.operator === "equal") return rowVal === searchVal;
      if (filterObj.operator === "different") return rowVal !== searchVal;
      return rowVal.includes(searchVal); // default contains
    });
  });
  
  const totalItems = filteredData.length;
  const paginatedData = filteredData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  const columns: ColumnDef<typeof allData[0]>[] = [
    {
      id: "id",
      header: "ID",
      enableColumnFilter: true,
      filterType: "text",
      cell: (row) => <span className="text-brand-blue-600 font-medium whitespace-nowrap">{row.id}</span>
    },
    {
      id: "cedente",
      header: "Cedente",
      enableColumnFilter: true,
      filterType: "text",
      cell: (row) => row.cedente
    },
    {
      id: "status",
      header: "Status",
      enableColumnFilter: true,
      filterType: "enum",
      cell: (row) => (
        <Badge color={row.status === "Liquidado" ? "success" : row.status === "Rejeitado" ? "danger" : "warning"}>
          {row.status}
        </Badge>
      )
    },
    {
      id: "data",
      header: "Data",
      enableColumnFilter: true,
      filterType: "date",
      cell: (row) => row.data
    },
    {
      id: "valor",
      header: "Valor",
      enableColumnFilter: true,
      filterType: "number",
      cell: (row) => <div className="font-medium">{row.valor}</div>
    }
  ];

  return (
    <main className="bg-surface-canvas mx-auto min-h-screen max-w-5xl space-y-16 p-8 pb-24">
      <header>
        <h1 className="t-h1">Galeria de Componentes</h1>
        <p className="t-body-lg text-fg-2">Biblioteca de componentes atômicos da SRM Asset.</p>
      </header>

      {/* Forms Section */}
      <section className="space-y-8">
        <h2 className="t-h3 border-border-subtle border-b pb-2">Controles de Formulário</h2>

        <div className="space-y-12">
          {/* Colors & States */}
          <div className="space-y-6">
            <h3 className="text-fg-2 font-medium">Inputs (Cores de Foco)</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Input label="Brand (Default)" color="brand" placeholder="Foco azul..." icon="user" />
              <Input label="Accent" color="accent" placeholder="Foco laranja..." icon="zap" />
              <Input label="Neutral" color="neutral" placeholder="Foco neutro..." icon="fileText" />
              <Input label="Success" color="success" placeholder="Sucesso..." icon="checkCircle" />
              <Input label="Warning" color="warning" placeholder="Atenção..." icon="alertTriangle" />
              <Input label="Danger" color="danger" placeholder="Erro..." error="Este campo é obrigatório" icon="alertCircle" />
            </div>
          </div>

          {/* Variações */}
          <div className="space-y-6">
            <h3 className="text-fg-2 font-medium">Variações e Tipos</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Input label="Senha" type="password" placeholder="••••••••" icon="lock" />
              <Input label="Número" type="number" placeholder="0" icon="hash" hint="Apenas números são permitidos" />
              <Input label="Com Máscara (Visual)" defaultValue="12.345.678/0001-90" icon="file" />
              <Input label="Valor" prefixAddon="R$" placeholder="0,00" />
              <Input label="Desabilitado" disabled defaultValue="Apenas leitura" icon="slash" />
              <Input label="Com Ícone à Direita" placeholder="Buscar..." iconRight="search" />
            </div>
          </div>

          {/* Selects */}
          <div className="space-y-6">
            <h3 className="text-fg-2 font-medium">Selects (Dropdown Customizado)</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Select
                label="Básico"
                options={[
                  { label: "Opção 1", value: "1" },
                  { label: "Opção 2", value: "2" },
                ]}
              />
              <Select
                label="Com Ícone"
                icon="wallet"
                color="brand"
                value="BRL"
                options={[
                  { label: "Real (BRL)", value: "BRL" },
                  { label: "Dólar (USD)", value: "USD" },
                ]}
              />
              <Select label="Desabilitado" icon="ban" disabled placeholder="Indisponível" />
            </div>
          </div>

          {/* Radios & Checkboxes */}
          <div className="border-border-subtle space-y-8 border-t pt-8">
            <h3 className="text-fg-2 font-medium">Checkboxes e Radios (Cores e Estados)</h3>

            <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
              {/* Checkboxes */}
              <div className="space-y-6">
                <p className="text-fg-2 text-xs font-medium tracking-wider uppercase">Checkboxes</p>
                <div className="grid grid-cols-2 gap-4">
                  <Checkbox label="Brand (Default)" defaultChecked color="brand" />
                  <Checkbox label="Accent" defaultChecked color="accent" />
                  <Checkbox label="Success" defaultChecked color="success" />
                  <Checkbox label="Warning" defaultChecked color="warning" />
                  <Checkbox label="Danger" defaultChecked color="danger" />
                  <Checkbox label="Neutral" defaultChecked color="neutral" />
                </div>
                <div className="border-border-subtle flex gap-8 border-t pt-4">
                  <Checkbox label="Desmarcado" />
                  <Checkbox label="Com Hint" hint="Detalhes extras" />
                  <Checkbox label="Desabilitado" disabled checked />
                </div>
              </div>

              {/* Radios */}
              <div className="space-y-6">
                <p className="text-fg-2 text-xs font-medium tracking-wider uppercase">Radios</p>
                <div className="grid grid-cols-2 gap-4">
                  <Radio label="Brand (Default)" name="color-brand" defaultChecked color="brand" />
                  <Radio label="Accent" name="color-accent" defaultChecked color="accent" />
                  <Radio label="Success" name="color-success" defaultChecked color="success" />
                  <Radio label="Warning" name="color-warning" defaultChecked color="warning" />
                  <Radio label="Danger" name="color-danger" defaultChecked color="danger" />
                  <Radio label="Neutral" name="color-neutral" defaultChecked color="neutral" />
                </div>
                <div className="border-border-subtle flex gap-8 border-t pt-4">
                  <Radio label="Desmarcado" name="estado-1" />
                  <Radio label="Com Hint" name="estado-2" hint="Exemplo de dica" />
                  <Radio label="Desabilitado" disabled checked name="estado-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Buttons & Status Section */}
      <section className="space-y-8">
        <h2 className="t-h3 border-border-subtle border-b pb-2">Ações e Status</h2>

        <div className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-fg-2 font-medium">Variantes e Cores</h3>
            <div className="grid grid-cols-1 gap-6">
              {/* Solid */}
              <div className="border-border-subtle space-y-3 rounded-2xl border bg-white p-5 shadow-xs">
                <p className="t-eyebrow mb-2">Solid</p>
                <div className="flex flex-row flex-wrap items-center gap-4">
                  <Button color="brand">Brand</Button>
                  <Button color="accent">Accent</Button>
                  <Button color="neutral">Neutral</Button>
                  <Button color="danger">Danger</Button>
                  <Button color="success">Success</Button>
                  <Button color="warning">Warning</Button>
                </div>
              </div>

              {/* Soft */}
              <div className="border-border-subtle space-y-3 rounded-2xl border bg-white p-5 shadow-xs">
                <p className="t-eyebrow mb-2">Soft</p>
                <div className="flex flex-row flex-wrap items-center gap-4">
                  <Button variant="soft" color="brand">
                    Brand
                  </Button>
                  <Button variant="soft" color="accent">
                    Accent
                  </Button>
                  <Button variant="soft" color="neutral">
                    Neutral
                  </Button>
                  <Button variant="soft" color="danger">
                    Danger
                  </Button>
                  <Button variant="soft" color="success">
                    Success
                  </Button>
                  <Button variant="soft" color="warning">
                    Warning
                  </Button>
                </div>
              </div>

              {/* Outline */}
              <div className="border-border-subtle space-y-3 rounded-2xl border bg-white p-5 shadow-xs">
                <p className="t-eyebrow mb-2">Outline</p>
                <div className="flex flex-row flex-wrap items-center gap-4">
                  <Button variant="outline" color="brand">
                    Brand
                  </Button>
                  <Button variant="outline" color="accent">
                    Accent
                  </Button>
                  <Button variant="outline" color="neutral">
                    Neutral
                  </Button>
                  <Button variant="outline" color="danger">
                    Danger
                  </Button>
                  <Button variant="outline" color="success">
                    Success
                  </Button>
                  <Button variant="outline" color="warning">
                    Warning
                  </Button>
                </div>
              </div>

              {/* Ghost */}
              <div className="border-border-subtle space-y-3 rounded-2xl border bg-white p-5 shadow-xs">
                <p className="t-eyebrow mb-2">Ghost</p>
                <div className="flex flex-row flex-wrap items-center gap-4">
                  <Button variant="ghost" color="brand">
                    Brand
                  </Button>
                  <Button variant="ghost" color="accent">
                    Accent
                  </Button>
                  <Button variant="ghost" color="neutral">
                    Neutral
                  </Button>
                  <Button variant="ghost" color="danger">
                    Danger
                  </Button>
                  <Button variant="ghost" color="success">
                    Success
                  </Button>
                  <Button variant="ghost" color="warning">
                    Warning
                  </Button>
                </div>
              </div>

              {/* Link */}
              <div className="border-border-subtle space-y-3 rounded-2xl border bg-white p-5 shadow-xs">
                <p className="t-eyebrow mb-2">Link</p>
                <div className="flex flex-row flex-wrap items-center gap-6 py-2">
                  <Button variant="link" color="brand">
                    Brand
                  </Button>
                  <Button variant="link" color="accent">
                    Accent
                  </Button>
                  <Button variant="link" color="neutral">
                    Neutral
                  </Button>
                  <Button variant="link" color="danger">
                    Danger
                  </Button>
                  <Button variant="link" color="success">
                    Success
                  </Button>
                  <Button variant="link" color="warning">
                    Warning
                  </Button>
                </div>
              </div>
            </div>

            <h3 className="text-fg-2 mt-8 font-medium">Tamanhos, Ícones e Estados</h3>
            <div className="border-border-subtle flex flex-wrap items-center gap-5 rounded-2xl border p-5 shadow-xs">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <div className="bg-border-subtle h-8 w-px"></div>
              <Button icon="plus">Com Ícone</Button>
              <Button variant="outline" iconRight="arrowRight" color="neutral">
                Ícone Direita
              </Button>
              <div className="bg-border-subtle h-8 w-px"></div>
              <Button disabled>Desabilitado</Button>
              <Button variant="outline" color="danger" disabled>
                Outline Off
              </Button>
            </div>
          </div>

          {/* Badges Section */}
          <div className="border-border-subtle space-y-6 border-t pt-8">
            <h3 className="text-fg-2 font-medium">Badges (Status e Etiquetas)</h3>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              {/* Cores (Soft default) */}
              <div className="space-y-4">
                <p className="text-fg-2 text-xs font-medium tracking-wider uppercase">Cores (Soft com Dot)</p>
                <div className="flex flex-wrap gap-3">
                  <Badge color="brand" dot>
                    Brand
                  </Badge>
                  <Badge color="accent" dot>
                    Accent
                  </Badge>
                  <Badge color="success" dot>
                    Success
                  </Badge>
                  <Badge color="warning" dot>
                    Warning
                  </Badge>
                  <Badge color="danger" dot>
                    Danger
                  </Badge>
                  <Badge color="neutral" dot>
                    Neutral
                  </Badge>
                </div>
              </div>

              {/* Variantes (Solid) */}
              <div className="space-y-4">
                <p className="text-fg-2 text-xs font-medium tracking-wider uppercase">Variante Solid</p>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="solid" color="brand" dot>
                    Brand
                  </Badge>
                  <Badge variant="solid" color="accent" dot>
                    Accent
                  </Badge>
                  <Badge variant="solid" color="success" dot>
                    Success
                  </Badge>
                  <Badge variant="solid" color="warning" dot>
                    Warning
                  </Badge>
                  <Badge variant="solid" color="danger" dot>
                    Danger
                  </Badge>
                  <Badge variant="solid" color="neutral" dot>
                    Neutral
                  </Badge>
                </div>
              </div>

              {/* Variantes (Outline) */}
              <div className="space-y-4">
                <p className="text-fg-2 text-xs font-medium tracking-wider uppercase">Variante Outline</p>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="outline" color="brand" dot>
                    Brand
                  </Badge>
                  <Badge variant="outline" color="accent" dot>
                    Accent
                  </Badge>
                  <Badge variant="outline" color="success" dot>
                    Success
                  </Badge>
                  <Badge variant="outline" color="warning" dot>
                    Warning
                  </Badge>
                  <Badge variant="outline" color="danger" dot>
                    Danger
                  </Badge>
                  <Badge variant="outline" color="neutral" dot>
                    Neutral
                  </Badge>
                </div>
              </div>

              {/* Tamanhos e Estados */}
              <div className="space-y-4">
                <p className="text-fg-2 text-xs font-medium tracking-wider uppercase">Tamanhos e Estados</p>
                <div className="flex flex-wrap items-end gap-3">
                  <Badge size="sm">Small (SM)</Badge>
                  <Badge size="md">Medium (MD)</Badge>
                  <Badge size="lg">Large (LG)</Badge>
                  <div className="bg-border-subtle mx-2 h-6 w-px" />
                  <Badge color="brand" isLoading>
                    Processando
                  </Badge>
                  <Badge variant="solid" color="success" isLoading>
                    Validando
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback & Loading Section */}
      <section className="space-y-8">
        <h2 className="t-h3 border-border-subtle border-b pb-2">Feedback e Carregamento</h2>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <p className="text-fg-2 text-xs font-medium tracking-wider uppercase">Spinners</p>
            <div className="flex flex-wrap items-end gap-6">
              <Spinner size="sm" color="brand" />
              <Spinner size="md" color="accent" />
              <Spinner size="lg" color="success" />
              <Spinner size="lg" color="warning" />
              <Spinner size="lg" color="danger" />
              <div className="bg-surface-sunken p-2 rounded-md border border-border-subtle">
                <Spinner size="md" color="neutral" />
              </div>
            </div>
            
            <p className="text-fg-2 text-xs font-medium tracking-wider uppercase pt-4">Progress Bars</p>
            <div className="w-full max-w-sm space-y-5">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-fg-3"><span className="font-medium">Processando Dados (SM)</span><span>35%</span></div>
                <Progress value={35} size="sm" color="brand" />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-fg-3"><span className="font-medium">Upload de Arquivo (MD)</span><span>60%</span></div>
                <Progress value={60} size="md" color="accent" />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-fg-3"><span className="font-medium">Concluído (LG)</span><span>100%</span></div>
                <Progress value={100} size="lg" color="success" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-fg-2 text-xs font-medium tracking-wider uppercase">Skeletons e Avatares</p>
            <div className="flex items-center gap-4">
              <Avatar name="Alexandre Queiroz" size="lg" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" className="w-32" />
                <Skeleton variant="text" className="w-48 opacity-60" />
              </div>
            </div>
            <Card className="space-y-4 p-4">
              <div className="flex gap-4">
                <Skeleton variant="circle" className="h-12 w-12" />
                <div className="flex-1 space-y-2 pt-1">
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
        <h2 className="t-h3 border-border-subtle border-b pb-2">Indicadores (KPIs)</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <KPI label="Patrimônio Líquido" value="R$ 2,4 Bi" delta="+4,2%" deltaTone="success" />
          <KPI label="Inadimplência" value="0,85%" delta="+0,02%" deltaTone="danger" />
          <KPI label="Operações Hoje" value="128" meta="Meta: 150" deltaTone="neutral" />
        </div>
      </section>

      {/* Data & Cards Section */}
      <section className="space-y-8">
        <h2 className="t-h3 border-border-subtle border-b pb-2">Visualização e Dados (Table & Charts)</h2>

        {/* DataTable */}
        <div className="space-y-4">
          <p className="text-fg-2 text-xs font-medium tracking-wider uppercase">Data Table (Server-Side Simulado)</p>
          <DataTable
            columns={columns}
            data={paginatedData}
            totalItems={totalItems}
            pageSize={pageSize}
            pageIndex={pageIndex}
            onPageChange={(page) => setPageIndex(page)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPageIndex(0);
            }}
            onFilterChange={(colId, val, op) => {
              setFilters(prev => ({ ...prev, [colId]: { value: val, operator: op } }));
              setPageIndex(0); // reset page on filter
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Chart Card */}
          <Card>
            <CardHeader>
              <CardTitle>Volume Operado</CardTitle>
              <CardDescription>Média semanal de cessões de crédito</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleBarChart
                data={[
                  { label: "Seg", value: 450000 },
                  { label: "Ter", value: 380000 },
                  { label: "Qua", value: 620000 },
                  { label: "Qui", value: 540000 },
                  { label: "Sex", value: 890000 },
                ]}
              />
            </CardContent>
          </Card>

          {/* Action Card */}
          <Card>
            <CardHeader>
              <CardTitle>Nova Operação</CardTitle>
              <CardDescription>Inicie uma nova análise de risco para antecipação.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="CNPJ do Cedente" placeholder="00.000.000/0001-00" />
              <Select
                label="Fundo de Destino"
                options={[
                  { label: "FIDC SRM I", value: "1" },
                  { label: "FIDC SRM II", value: "2" },
                ]}
              />
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="soft" color="neutral">
                Cancelar
              </Button>
              <Button onClick={() => toast.success("Simulação criada com sucesso! Verifique a tabela.")}>Simular Antecipação</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Advanced UI Section */}
      <section className="space-y-8">
        <h2 className="t-h3 border-border-subtle border-b pb-2">Componentes Avançados</h2>
        
        <div className="grid grid-cols-1 gap-12">
          {/* Tabs Showcase */}
          <div className="space-y-6">
            <p className="text-fg-2 text-xs font-medium tracking-wider uppercase">Navegação (Tabs) - Cores Semânticas</p>
            <div className="flex flex-wrap gap-6 items-start bg-white border-[0.5px] border-border-default shadow-xs p-6 rounded-2xl">
              <Tabs defaultValue="t1" color="brand" className="w-auto">
                <TabsList>
                  <TabsTrigger value="t1">
                    <Icon name="user" size={16} /> Perfil
                  </TabsTrigger>
                  <TabsTrigger value="t2">
                    <Icon name="settings" size={16} /> Sistema
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Tabs defaultValue="t1" color="accent" className="w-auto">
                <TabsList>
                  <TabsTrigger value="t1">Accent</TabsTrigger>
                  <TabsTrigger value="t2">Inativo</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Tabs defaultValue="t1" color="success" className="w-auto">
                <TabsList>
                  <TabsTrigger value="t1">Success</TabsTrigger>
                  <TabsTrigger value="t2">Inativo</TabsTrigger>
                </TabsList>
              </Tabs>

              <Tabs defaultValue="t1" color="warning" className="w-auto">
                <TabsList>
                  <TabsTrigger value="t1">Warning</TabsTrigger>
                  <TabsTrigger value="t2">Inativo</TabsTrigger>
                </TabsList>
              </Tabs>

              <Tabs defaultValue="t1" color="danger" className="w-auto">
                <TabsList>
                  <TabsTrigger value="t1">Danger</TabsTrigger>
                  <TabsTrigger value="t2">Inativo</TabsTrigger>
                </TabsList>
              </Tabs>

              <Tabs defaultValue="t1" color="neutral" className="w-auto">
                <TabsList>
                  <TabsTrigger value="t1">Neutral</TabsTrigger>
                  <TabsTrigger value="t2">Inativo</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Switch Showcase */}
            <div className="space-y-6">
              <p className="text-fg-2 text-xs font-medium tracking-wider uppercase">Switches (Toggles) - Cores</p>
              <div className="bg-white border-[0.5px] border-border-default shadow-xs p-6 rounded-2xl grid grid-cols-2 gap-y-6 gap-x-4">
                <Switch defaultChecked color="brand" label="Brand" />
                <Switch defaultChecked color="accent" label="Accent" />
                <Switch defaultChecked color="success" label="Success" />
                <Switch defaultChecked color="warning" label="Warning" />
                <Switch defaultChecked color="danger" label="Danger" />
                <Switch defaultChecked color="neutral" label="Neutral" />
              </div>
            </div>

            {/* Toasts Showcase */}
            <div className="space-y-6">
              <p className="text-fg-2 text-xs font-medium tracking-wider uppercase">Notificações (Toasts via Sonner)</p>
              <div className="bg-white border-[0.5px] border-border-default shadow-xs p-6 rounded-2xl flex flex-wrap gap-4 items-center h-fit">
                <Button variant="soft" color="brand" onClick={() => toast.info("Sistema atualizado", { description: "Uma nova versão está disponível."})}>Toast de Info</Button>
                <Button variant="soft" color="success" onClick={() => toast.success("Operação concluída", { description: "Os fundos foram transferidos."})}>Toast de Sucesso</Button>
                <Button variant="soft" color="warning" onClick={() => toast.warning("Atenção necessária", { description: "O limite de crédito está próximo."})}>Toast de Aviso</Button>
                <Button variant="soft" color="danger" onClick={() => toast.error("Falha na liquidação", { description: "Verifique os dados da conta bancária."})}>Toast de Erro</Button>
                <Button variant="outline" color="neutral" onClick={() => toast("Rascunho salvo", { action: { label: "Desfazer", onClick: () => console.log("undo") }})}>Toast Neutro c/ Ação</Button>
              </div>
            </div>

            {/* Modal Showcase */}
            <div className="space-y-6 md:col-span-2 mt-4">
              <p className="text-fg-2 text-xs font-medium tracking-wider uppercase">Sobreposição (Modal / Dialog)</p>
              <div className="bg-white border-[0.5px] border-border-default shadow-xs p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-fg-1">Modal de Confirmação Premium</h4>
                  <p className="text-sm text-fg-3">Animações framer-motion, backdrop-blur azul e bloqueio de scroll nativo.</p>
                </div>
                <Button color="brand" onClick={() => setIsModalOpen(true)}>Abrir Modal Premium</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals Portals */}
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent onClose={() => setIsModalOpen(false)}>
          <ModalHeader>
            <ModalTitle>Antecipar Recebíveis</ModalTitle>
            <ModalDescription>Você está prestes a enviar os títulos para análise de risco. Esta ação não pode ser desfeita.</ModalDescription>
          </ModalHeader>
          <div className="p-6 pt-0 space-y-4">
            <div className="rounded-xl bg-surface-alt p-4 flex gap-4 items-center">
              <div className="h-10 w-10 rounded-full bg-brand-blue-500/10 flex items-center justify-center text-brand-blue-600">
                <Icon name="file-text" size={20} stroke={2} />
              </div>
              <div>
                <p className="text-sm font-medium text-fg-1">R$ 250.000,00</p>
                <p className="text-xs text-fg-3">Valor total bruto (14 títulos)</p>
              </div>
            </div>
          </div>
          <ModalFooter>
            <Button variant="soft" color="neutral" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button color="brand" onClick={() => {
              setIsModalOpen(false);
              toast.success("Antecipação solicitada com sucesso!");
            }}>Confirmar Solicitação</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </main>
  );
}
