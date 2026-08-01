"use client";

import { type ReactNode, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ChevronLeft, ChevronRight, Inbox, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export interface Column<T> {
  key: string;
  header: ReactNode;
  cell: (item: T) => ReactNode;
  className?: string;
  sortable?: boolean;
}

function SafeCell({ render }: { render: () => ReactNode }) {
  try {
    return <>{render()}</>;
  } catch {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-slate-400" title="Could not render this value">
        <AlertTriangle className="h-3.5 w-3.5" /> N/A
      </span>
    );
  }
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  limit?: number;
  selected?: string[];
  onSelectChange?: (ids: string[]) => void;
  rowKey: (item: T) => string;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  toolbar?: ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  loading,
  page = 1,
  totalPages = 1,
  onPageChange,
  onLimitChange,
  limit = 10,
  selected,
  onSelectChange,
  rowKey,
  emptyMessage = "No records found",
  onRowClick,
  toolbar,
}: DataTableProps<T>) {
  const [allChecked, setAllChecked] = useState(false);

  useEffect(() => {
    if (!selected?.length) setAllChecked(false);
  }, [selected]);

  const toggleAll = () => {
    if (!onSelectChange) return;
    if (allChecked) {
      onSelectChange([]);
      setAllChecked(false);
    } else {
      onSelectChange(data.map((item) => rowKey(item)));
      setAllChecked(true);
    }
  };

  const toggleOne = (id: string) => {
    if (!onSelectChange) return;
    if (selected?.includes(id)) {
      onSelectChange(selected.filter((s) => s !== id));
    } else {
      onSelectChange([...(selected || []), id]);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0f101a]">
      {toolbar && <div className="border-b border-slate-200 p-4 dark:border-slate-800">{toolbar}</div>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/60">
              {onSelectChange && (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    className="h-4 w-4 cursor-pointer rounded accent-brand-600"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn("whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400", col.className)}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800/60">
                  {onSelectChange && (
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-4" />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onSelectChange ? 1 : 0)}>
                  <div className="flex flex-col items-center gap-3 py-16 text-center">
                    <SearchX className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={rowKey(item)}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    "border-b border-slate-100 transition-colors last:border-0 dark:border-slate-800/60",
                    onRowClick && "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  )}
                >
                  {onSelectChange && (
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected?.includes(rowKey(item))}
                        onChange={() => toggleOne(rowKey(item))}
                        className="h-4 w-4 cursor-pointer rounded accent-brand-600"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-4 py-3", col.className)}>
                      <SafeCell render={() => col.cell(item)} />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {(onPageChange || onLimitChange) && (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 p-4 sm:flex-row dark:border-slate-800">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            {onLimitChange && (
              <Select
                value={limit}
                onChange={(e) => onLimitChange(Number(e.target.value))}
                className="h-9 w-20"
                options={[
                  { value: "10", label: "10" },
                  { value: "25", label: "25" },
                  { value: "50", label: "50" },
                  { value: "100", label: "100" },
                ]}
              />
            )}
            <span>rows per page</span>
          </div>
          {onPageChange && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-[90px] text-center text-sm text-slate-600 dark:text-slate-300">
                Page {page} / {totalPages || 1}
              </span>
              <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10">
          {icon || <Inbox className="h-8 w-8 text-brand-500" />}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
          {message && <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">{message}</p>}
        </div>
        {action}
      </motion.div>
    </AnimatePresence>
  );
}
