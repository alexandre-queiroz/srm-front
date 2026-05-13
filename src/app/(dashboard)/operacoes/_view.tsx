"use client";

import React, { useState, useCallback, useTransition, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Icon from "@/components/ui/icon";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from "@/components/ui/modal";
import Select from "@/components/ui/select";
import type { Receivable, ProductType, ReceivableUploadResult } from "@/types";

const STATUS_COLOR: Record<string, "success" | "warning" | "danger" | "neutral"> = {
  available: "success",
  batched: "warning",
  settled: "neutral",
};

const STATUS_LABEL: Record<string, string> = {
  available: "Disponível",
  batched: "Em Lote",
  settled: "Liquidado",
};

const columns = [
  {
    id: "invoice_key",
    header: "Chave NF-e",
    enableColumnFilter: true,
    cell: ({ row }: { row: Receivable }) => (
      <span className="font-mono text-xs text-fg-2 truncate max-w-[260px] block">{row.invoice_key}</span>
    ),
  },
  {
    id: "assignor",
    header: "Cedente",
    enableColumnFilter: true,
    cell: ({ row }: { row: Receivable }) => <span className="font-medium">{row.assignor.name}</span>,
  },
  {
    id: "drawee",
    header: "Sacado",
    enableColumnFilter: true,
    cell: ({ row }: { row: Receivable }) => <span>{row.drawee.name}</span>,
  },
  {
    id: "due_date",
    header: "Vencimento",
    cell: ({ row }: { row: Receivable }) =>
      new Date(row.due_date + "T00:00:00").toLocaleDateString("pt-BR"),
  },
  {
    id: "face_value",
    header: "Valor de Face",
    cell: ({ row }: { row: Receivable }) =>
      `${row.currency_code} ${Number(row.face_value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }: { row: Receivable }) => (
      <Badge color={STATUS_COLOR[row.status] ?? "neutral"} size="sm">
        {STATUS_LABEL[row.status] ?? row.status}
      </Badge>
    ),
  },
];

interface Props {
  initialData: Receivable[];
  productTypes: ProductType[];
  fetchReceivables: (params: { page: number; pageSize: number; status?: string; invoice_key?: string; assignor_id?: string }) => Promise<Receivable[]>;
  uploadXml: (formData: FormData) => Promise<ReceivableUploadResult>;
}

export function OperacoesView({ initialData, productTypes, fetchReceivables, uploadXml }: Props) {
  const [data, setData] = useState(initialData);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isPending, startTransition] = useTransition();

  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadResult, setUploadResult] = useState<ReceivableUploadResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState("");
  const [currencyCode, setCurrencyCode] = useState("BRL");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const totalItems =
    data.length === pageSize
      ? (pageIndex + 1) * pageSize + 1
      : pageIndex * pageSize + data.length;

  const loadPage = useCallback(
    (nextPage: number, nextSize: number, nextFilters: any = filters) => {
      startTransition(async () => {
        const result = await fetchReceivables({
          page: nextPage + 1,
          pageSize: nextSize,
          ...nextFilters,
        });
        setData(result);
      });
    },
    [fetchReceivables, filters],
  );

  const handlePageChange = (page: number) => {
    setPageIndex(page);
    loadPage(page, pageSize);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPageIndex(0);
    loadPage(0, size);
  };

  const handleFilterChange = (columnId: string, value: string) => {
    const nextFilters = { ...filters, [columnId]: value };
    if (!value) delete nextFilters[columnId];
    setFilters(nextFilters);
    setPageIndex(0);
    loadPage(0, pageSize, nextFilters);
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (selectedProductType) formData.append("product_type_id", selectedProductType);
      formData.append("currency_code", currencyCode);

      const result = await uploadXml(formData);
      setUploadResult(result);
      loadPage(0, pageSize);
      toast.success(`${result.imported} recebível(is) importado(s) com sucesso.`);
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao importar XML.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseUpload = () => {
    setUploadOpen(false);
    setUploadResult(null);
    setSelectedProductType("");
    setCurrencyCode("BRL");
    setSelectedFileName(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const productTypeOptions = productTypes.map((p) => ({ value: p.id, label: p.name }));

  const currencyOptions = Array.from(
    new Set(["BRL", ...initialData.map((r) => r.currency_code)]),
  ).map((code) => ({ value: code, label: code }));

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-end justify-between shrink-0">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="t-h3 !text-2xl text-fg-1 tracking-tight">Recebíveis</h1>
          <p className="t-body !text-fg-3 mt-0.5">Títulos disponíveis para antecipação.</p>
        </motion.div>
        <Button
          className="h-9 px-4 text-xs font-bold shadow-md shadow-brand-blue-500/10"
          icon="upload"
          onClick={() => setUploadOpen(true)}
        >
          Importar XML
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        totalItems={totalItems}
        pageSize={pageSize}
        pageIndex={pageIndex}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onFilterChange={handleFilterChange}
      />

      <Modal open={uploadOpen} onOpenChange={handleCloseUpload}>
        <ModalContent onClose={handleCloseUpload}>
          <ModalHeader>
            <ModalTitle>Importar NF-e XML</ModalTitle>
            <ModalDescription>
              Selecione um arquivo XML de NF-e para importar os recebíveis.
            </ModalDescription>
          </ModalHeader>

          {uploadResult ? (
            <div className="px-6 pb-2 space-y-4">
              <div className="rounded-2xl bg-srm-success-50 border border-srm-success-100 p-4 flex items-start gap-3">
                <Icon name="checkCircle" size={20} className="text-srm-success-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-srm-success-700">Importação concluída</p>
                  <p className="text-sm text-srm-success-600 mt-0.5">
                    {uploadResult.imported} importado(s) · {uploadResult.skipped} ignorado(s) · {uploadResult.total} total
                  </p>
                </div>
              </div>
              {uploadResult.items.some((i) => !i.success) && (
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {uploadResult.items.filter((i) => !i.success).map((item, idx) => (
                    <div key={idx} className="text-xs text-srm-danger-600 bg-srm-danger-50 rounded-lg px-3 py-1.5">
                      {item.invoice_key} · {item.error}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleUpload} className="px-6 pb-2 space-y-4">
              <div>
                <label className="text-[13px] font-medium text-fg-1 mb-1.5 block">Arquivo XML</label>
                <div
                  className={`border-[0.5px] border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer ${selectedFileName ? "border-brand-blue-400 bg-brand-blue-50/40" : "border-border-strong hover:bg-surface-alt/30"}`}
                  onClick={() => fileRef.current?.click()}
                >
                  <Icon
                    name={selectedFileName ? "fileCheck" : "fileUp"}
                    size={24}
                    className={`mx-auto mb-2 ${selectedFileName ? "text-brand-blue-500" : "text-fg-3"}`}
                  />
                  {selectedFileName ? (
                    <>
                      <p className="text-sm text-brand-blue-700 font-semibold truncate max-w-xs mx-auto">{selectedFileName}</p>
                      <p className="text-xs text-brand-blue-400 mt-0.5">Clique para trocar</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-fg-2 font-medium">Clique para selecionar</p>
                      <p className="text-xs text-fg-3 mt-0.5">XML de NF-e · máx. 5 MB</p>
                    </>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".xml,application/xml,text/xml"
                    className="hidden"
                    onChange={(e) => setSelectedFileName(e.target.files?.[0]?.name ?? null)}
                  />
                </div>
              </div>

              <Select
                label="Tipo de Produto"
                placeholder="Selecione (opcional)"
                options={productTypeOptions}
                value={selectedProductType}
                onChange={setSelectedProductType}
              />

              <Select
                label="Moeda"
                placeholder="Selecione a moeda..."
                options={currencyOptions}
                value={currencyCode}
                onChange={setCurrencyCode}
              />

              <ModalFooter className="-mx-6 mt-4">
                <Button variant="outline" color="neutral" type="button" onClick={handleCloseUpload}>
                  Cancelar
                </Button>
                <Button type="submit" isLoading={isUploading} icon="upload">
                  Importar
                </Button>
              </ModalFooter>
            </form>
          )}

          {uploadResult && (
            <ModalFooter>
              <Button onClick={handleCloseUpload}>
                Fechar
              </Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
