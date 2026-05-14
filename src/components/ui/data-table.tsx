"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDebounce } from "@/hooks/use-debounce";
import Button from "@/components/ui/button";
import Icon from "@/components/ui/icon";

export interface ColumnDef<TData> {
  id: string;
  header: string | React.ReactNode;
  cell?: (props: { row: TData }) => React.ReactNode;
  enableColumnFilter?: boolean;
  filterType?: "text" | "number" | "enum" | "date";
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  totalItems: number;
  pageSize: number;
  pageIndex: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onFilterChange: (columnId: string, value: string, operator?: string) => void;
  onRowClick?: (row: TData) => void;
  minWidth?: string;
}

export type FilterOperator = "contains" | "startswith" | "endswith" | "equal" | "different";

const operatorLabels: Record<FilterOperator, string> = {
  contains: "Contém",
  startswith: "Começa com",
  endswith: "Termina com",
  equal: "Igual",
  different: "Diferente",
};

const operatorIcons: Record<FilterOperator, string> = {
  contains: "textSearch",
  startswith: "alignLeft",
  endswith: "alignRight",
  equal: "equal",
  different: "notEqual",
};

function FilterInput({
  columnId,
  label,
  filterType = "text",
  onFilterChange,
}: {
  columnId: string;
  label: string;
  filterType?: "text" | "number" | "enum" | "date";
  onFilterChange: (id: string, val: string, op?: string) => void;
}) {
  const [value, setValue] = useState("");
  const [operator, setOperator] = useState<FilterOperator>("contains");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const debouncedValue = useDebounce(value, 400);

  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      setIsDropdownOpen(false);
    }
    function handleScroll() {
      setIsDropdownOpen(false);
    }

    if (isDropdownOpen) {
      // Small timeout to prevent immediate closing from the click that opened it
      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScroll, true);
      }, 10);
      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handleClickOutside);
        window.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, [isDropdownOpen]);

  useEffect(() => {
    onFilterChange(columnId, debouncedValue, operator);
  }, [debouncedValue, operator, columnId]); // onFilterChange omitido intencionalmente — deve ser memoizado no pai com useCallback

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 4,
        left: rect.left,
      });
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="relative h-full w-full font-normal">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        className="text-fg-3 hover:bg-surface-alt hover:text-fg-1 absolute top-1/2 left-1.5 z-10 flex -translate-y-1/2 cursor-pointer items-center gap-0.5 rounded p-1 transition-colors"
        title={`Operador atual: ${operatorLabels[operator]}`}
      >
        <Icon name={operatorIcons[operator]} size={13} stroke={2.5} />
        <Icon name="chevronDown" size={10} stroke={2} className="opacity-50" />
      </button>

      {isDropdownOpen &&
        filterType === "text" &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className="border-border-subtle fixed z-[9999] flex min-w-[170px] flex-col rounded-xl border-[0.5px] bg-white py-1.5 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.12)]"
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="text-fg-3 px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase">Operador de Busca</div>
            {(Object.keys(operatorLabels) as FilterOperator[]).map((op) => (
              <button
                key={op}
                onClick={() => {
                  setOperator(op);
                  setIsDropdownOpen(false);
                }}
                className={`hover:bg-surface-alt flex cursor-pointer items-center justify-between px-3 py-1.5 text-left text-[13px] transition-colors ${operator === op ? "text-brand-blue-600 bg-surface-alt/50 font-medium" : "text-fg-2"}`}
              >
                <div className="flex items-center gap-2">
                  <Icon name={operatorIcons[op]} size={14} stroke={2} className={operator === op ? "text-brand-blue-500" : "text-fg-3"} />
                  {operatorLabels[op]}
                </div>
                {operator === op && <Icon name="check" size={12} stroke={2.5} />}
              </button>
            ))}
          </div>,
          document.body,
        )}

      <input
        placeholder={`Filtrar...`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="text-fg-1 placeholder:text-fg-disabled hover:bg-surface-alt/30 focus:bg-surface-alt/30 h-[34px] w-full bg-transparent pr-4 pl-[52px] text-[13px] transition-colors outline-none focus:shadow-[inset_0_-1.5px_0_0_var(--srm-blue-500)]"
      />
    </div>
  );
}

export function DataTable<TData>({
  columns,
  data,
  totalItems,
  pageSize,
  pageIndex,
  onPageChange,
  onPageSizeChange,
  onFilterChange,
  onRowClick,
  minWidth = "w-full",
}: DataTableProps<TData>) {
  const pageCount = Math.ceil(totalItems / pageSize) || 1;
  const startItem = totalItems === 0 ? 0 : pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalItems);

  const filterableColumns = columns.filter((c) => c.enableColumnFilter);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <div className="border-border-default flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border-[0.5px] bg-white shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)]">
        <div className="flex-1 overflow-auto">
          <Table className={minWidth}>
            <TableHeader className="sticky top-0 z-10 bg-white">
              <TableRow className="bg-surface-alt hover:bg-surface-alt border-b-border-subtle">
                {columns.map((col) => (
                  <TableHead key={col.id} className="px-5 py-3 align-middle">
                    <span className="text-fg-2 text-[11.5px] font-medium tracking-wider whitespace-nowrap uppercase">{col.header}</span>
                  </TableHead>
                ))}
              </TableRow>
              {filterableColumns.length > 0 && (
                <TableRow className="border-b-border-default bg-white hover:bg-white">
                  {columns.map((col) => (
                    <TableHead key={`filter-${col.id}`} className="border-border-subtle h-[34px] border-r-[0.5px] p-0 last:border-r-0">
                      {col.enableColumnFilter ? (
                        <FilterInput
                          columnId={col.id}
                          label={typeof col.header === "string" ? col.header : col.id}
                          filterType={col.filterType}
                          onFilterChange={onFilterChange}
                        />
                      ) : null}
                    </TableHead>
                  ))}
                </TableRow>
              )}
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-fg-3 h-32 text-center text-sm">
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, i) => (
                  <TableRow
                    key={i}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={onRowClick ? "cursor-pointer" : undefined}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.id} className="text-fg-1 px-5 py-4 text-[13px] whitespace-nowrap">
                        {col.cell ? col.cell({ row }) : String((row as Record<string, unknown>)[col.id] ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-center justify-between gap-6 px-1 pt-5 sm:flex-row">
        <div className="text-fg-3 flex items-center gap-4 text-[13px]">
          <div>
            Mostrando <span className="text-fg-1 font-medium">{startItem}</span> até{" "}
            <span className="text-fg-1 font-medium">{endItem}</span> de <span className="text-fg-1 font-medium">{totalItems}</span>{" "}
            registros
          </div>
          <div className="bg-border-default hidden h-4 w-px sm:block"></div>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-fg-3 text-[13px] whitespace-nowrap">Linhas por página:</span>
            <div className="relative">
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="border-border-default text-fg-1 hover:border-border-strong focus:border-brand-blue-500 h-8 cursor-pointer appearance-none rounded-full border-[0.5px] bg-white pr-8 pl-3 text-[13px] font-medium shadow-xs transition-colors outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <Icon name="chevronDown" size={14} className="text-fg-3 pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            color="neutral"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={pageIndex === 0}
            className="h-8 w-8 min-w-0 rounded-full p-0"
          >
            <Icon name="arrowLeft" size={14} />
          </Button>
          <div className="text-fg-1 px-3 text-[13px] font-medium">
            Página {pageIndex + 1} de {pageCount}
          </div>
          <Button
            variant="outline"
            color="neutral"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={pageIndex >= pageCount - 1}
            className="h-8 w-8 min-w-0 rounded-full p-0"
          >
            <Icon name="arrowRight" size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
