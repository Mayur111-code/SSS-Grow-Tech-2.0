import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  loading,
}: ConfirmDialogProps) {
  const [closing, setClosing] = useState(false);

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/15">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{message}</p>
        </div>
        <div className="flex w-full gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            loading={loading}
            onClick={() => {
              onConfirm();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
