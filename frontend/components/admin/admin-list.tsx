"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, RefreshCw, Search, Trash2, Pencil, Power, ArrowLeft, AlertTriangle } from "lucide-react";
import { useAdminList } from "@/services/queries";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { PageLoader } from "@/components/ui/skeleton";
import api, { getErrorMessage } from "@/lib/api";

interface AdminListProps<T> {
  resource: string;
  columns: Column<T>[];
  rowKey?: (item: T) => string;
  searchPlaceholder?: string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onToggle?: (item: T) => void;
  header?: ReactNode;
  emptyMessage?: string;
  limit?: number;
}

export function AdminList<T>({
  resource,
  columns,
  rowKey = (item) => (item as { _id: string })._id,
  searchPlaceholder = "Search...",
  onEdit,
  onDelete,
  onToggle,
  header,
  emptyMessage = "No records found",
  limit: initialLimit = 10,
}: AdminListProps<T>) {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  const params = useMemo(
    () => ({ page, limit, ...(search.trim() ? { search } : {}) }),
    [page, limit, search]
  );

  const { data, isLoading, isError, error: queryError, refetch } = useAdminList<T>(resource, params);
  const items = data?.items || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const reload = () => queryClient.invalidateQueries({ queryKey: ["admin", resource] });

  const bulkDelete = async () => {
    setBulkLoading(true);
    try {
      await api.delete(`/${resource}/bulk-delete`, { data: { ids: selected } });
      success(`Deleted ${selected.length} item(s)`);
      setSelected([]);
      setBulkOpen(false);
      reload();
    } catch (err) {
      error(getErrorMessage(err));
    } finally {
      setBulkLoading(false);
    }
  };

  const allColumns: Column<T>[] = [
    ...columns,
    ...((onEdit || onDelete || onToggle) ? [{
      key: "actions",
      header: "",
      className: "w-28 text-right",
      cell: (item: T) => (
        <div className="flex items-center justify-end gap-1">
          {onToggle && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggle(item); }}
              title="Toggle status"
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-brand-500 dark:hover:bg-slate-800"
            >
              <Power className="h-4 w-4" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(item); }}
              title="Edit"
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-sky-500 dark:hover:bg-slate-800"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(item); }}
              title="Delete"
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    }] : []),
  ];

  return (
    <div className="space-y-5">
      {header}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder={searchPlaceholder}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {selected.length > 0 && (
            <>
              <Button variant="danger" size="sm" onClick={() => setBulkOpen(true)}>
                <Trash2 className="h-4 w-4" /> Delete ({selected.length})
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelected([])}>
                Clear
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" onClick={reload}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      {isError ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-red-300 bg-red-50/50 py-14 text-center dark:border-red-800 dark:bg-red-950/20">
          <AlertTriangle className="h-10 w-10 text-red-400" />
          <div>
            <p className="text-sm font-medium text-red-600 dark:text-red-400">Failed to load {resource}</p>
            <p className="mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400">
              {(queryError as Error)?.message || "Something went wrong. Please try again."}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" /> Try again
          </Button>
        </div>
      ) : (
        <DataTable
          columns={allColumns}
          data={items}
          loading={isLoading}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          limit={limit}
          onLimitChange={(l) => { setLimit(l); setPage(1); }}
          selected={selected}
          onSelectChange={setSelected}
          rowKey={rowKey}
          emptyMessage={emptyMessage}
        />
      )}

      <ConfirmDialog
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        onConfirm={bulkDelete}
        loading={bulkLoading}
        title={`Delete ${selected.length} item(s)?`}
        message="This action cannot be undone."
        confirmLabel="Delete all"
      />
    </div>
  );
}

interface AdminModalProps<TForm> {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode | ((form: TForm) => ReactNode);
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function AdminModal<TForm>({ open, onClose, title, description, children, footer, size = "lg" }: AdminModalProps<TForm>) {
  return (
    <Modal open={open} onClose={onClose} title={title} description={description} size={size} footer={footer}>
      {children as ReactNode}
    </Modal>
  );
}

export function useAdminResource<T extends { _id: string }>(resource: string) {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const [editing, setEditing] = useState<T | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const reload = () => queryClient.invalidateQueries({ queryKey: ["admin", resource] });

  const openEdit = (item: T) => setEditing(item);

  const handleToggle = async (item: T) => {
    try {
      await api.patch(`/${resource}/${item._id}/toggle-status`);
      success("Status updated");
      reload();
    } catch (err) {
      error(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/${resource}/${deleteTarget._id}`);
      success("Deleted successfully");
      setDeleteTarget(null);
      reload();
    } catch (err) {
      error(getErrorMessage(err));
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    editing,
    setEditing,
    deleteTarget,
    setDeleteTarget,
    deleteLoading,
    reload,
    openEdit,
    handleToggle,
    handleDelete,
  };
}

export function AdminPageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

export function LoadingState() {
  return <PageLoader label="Loading..." />;
}
