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
  different: "Diferente"
};

const operatorIcons: Record<FilterOperator, string> = {
  contains: "textSearch",
  startswith: "alignLeft",
  endswith: "alignRight",
  equal: "equal",
  different: "notEqual"
};

function FilterInput({ columnId, label, filterType = "text", onFilterChange }: { columnId: string; label: string; filterType?: "text" | "number" | "enum" | "date"; onFilterChange: (id: string, val: string, op?: string) => void }) {
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="relative font-normal w-full h-full">
      <button 
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        className="absolute left-1.5 top-1/2 -translate-y-1/2 text-fg-3 hover:bg-surface-alt hover:text-fg-1 p-1 rounded transition-colors z-10 flex items-center gap-0.5 cursor-pointer"
        title={`Operador atual: ${operatorLabels[operator]}`}
      >
        <Icon name={operatorIcons[operator]} size={13} stroke={2.5} />
        <Icon name="chevronDown" size={10} stroke={2} className="opacity-50" />
      </button>

      {isDropdownOpen && filterType === "text" && typeof window !== "undefined" && createPortal(
        <div 
          className="fixed min-w-[170px] bg-white border-[0.5px] border-border-subtle rounded-xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.12)] z-[9999] flex flex-col py-1.5"
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
          onMouseDown={(e) => e.stopPropagation()}
        >
           <div className="px-3 py-1.5 text-[10px] font-bold text-fg-3 uppercase tracking-wider">Operador de Busca</div>
           {(Object.keys(operatorLabels) as FilterOperator[]).map(op => (
             <button
               key={op}
               onClick={() => { setOperator(op); setIsDropdownOpen(false); }}
               className={`text-left px-3 py-1.5 text-[13px] hover:bg-surface-alt transition-colors cursor-pointer flex items-center justify-between ${operator === op ? 'text-brand-blue-600 font-medium bg-surface-alt/50' : 'text-fg-2'}`}
             >
               <div className="flex items-center gap-2">
                 <Icon name={operatorIcons[op]} size={14} stroke={2} className={operator === op ? "text-brand-blue-500" : "text-fg-3"} />
                 {operatorLabels[op]}
               </div>
               {operator === op && <Icon name="check" size={12} stroke={2.5} />}
             </button>
           ))}
        </div>,
        document.body
      )}

      <input
        placeholder={`Filtrar...`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-[34px] w-full bg-transparent pl-[52px] pr-4 text-[13px] text-fg-1 outline-none transition-colors placeholder:text-fg-disabled hover:bg-surface-alt/30 focus:bg-surface-alt/30 focus:shadow-[inset_0_-1.5px_0_0_var(--srm-blue-500)]"
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
    <div className="flex flex-col flex-1 w-full h-full">
      <div className="rounded-2xl border-[0.5px] border-border-default shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] bg-white overflow-hidden flex flex-col flex-1 min-h-0">
        
        <div className="flex-1 overflow-auto">
          <Table className={minWidth}>
            <TableHeader>
              <TableRow className="bg-surface-alt/30 hover:bg-surface-alt/30 border-b-border-subtle">
                {columns.map((col) => (
                  <TableHead key={col.id} className="align-middle py-3 px-5">
                    <span className="text-[11.5px] uppercase tracking-wider text-fg-2 font-medium whitespace-nowrap">{col.header}</span>
                  </TableHead>
                ))}
              </TableRow>
              {filterableColumns.length > 0 && (
                <TableRow className="bg-white hover:bg-white border-b-border-default">
                  {columns.map((col) => (
                    <TableHead key={`filter-${col.id}`} className="p-0 border-r-[0.5px] border-border-subtle last:border-r-0 h-[34px]">
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
                  <TableCell colSpan={columns.length} className="h-32 text-center text-fg-3 text-sm">
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
                      <TableCell key={col.id} className="px-5 py-4 text-[13px] text-fg-1 whitespace-nowrap">
                        {col.cell ? col.cell({ row }) : (row as any)[col.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-1 pt-5 shrink-0">
        <div className="text-[13px] text-fg-3 flex items-center gap-4">
          <div>
            Mostrando <span className="font-medium text-fg-1">{startItem}</span> até{" "}
            <span className="font-medium text-fg-1">{endItem}</span> de{" "}
            <span className="font-medium text-fg-1">{totalItems}</span> registros
          </div>
          <div className="h-4 w-px bg-border-default hidden sm:block"></div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[13px] text-fg-3 whitespace-nowrap">Linhas por página:</span>
            <div className="relative">
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="h-8 appearance-none rounded-full border-[0.5px] border-border-default bg-white pl-3 pr-8 text-[13px] text-fg-1 font-medium outline-none transition-colors hover:border-border-strong focus:border-brand-blue-500 cursor-pointer shadow-xs"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <Icon name="chevronDown" size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-fg-3 pointer-events-none" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            color="neutral"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={pageIndex === 0}
            className="h-8 w-8 p-0 min-w-0 rounded-full"
          >
            <Icon name="arrowLeft" size={14} />
          </Button>
          <div className="text-[13px] font-medium text-fg-1 px-3">
            Página {pageIndex + 1} de {pageCount}
          </div>
          <Button
            variant="outline"
            color="neutral"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={pageIndex >= pageCount - 1}
            className="h-8 w-8 p-0 min-w-0 rounded-full"
          >
            <Icon name="arrowRight" size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
