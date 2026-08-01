"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  toast: (toast: { type: ToastType; title: string; message?: string }) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const icons: Record<ToastType, ReactNode> = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  info: <Info className="h-5 w-5 text-brand-500" />,
  warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const toast = useCallback(
    ({ type, title, message }: { type: ToastType; title: string; message?: string }) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, type, title, message }]);
      timers.current[id] = setTimeout(() => dismiss(id), 4500);
    },
    [dismiss]
  );

  const value: ToastContextValue = {
    toast,
    success: (title, message) => toast({ type: "success", title, message }),
    error: (title, message) => toast({ type: "error", title, message }),
    info: (title, message) => toast({ type: "info", title, message }),
    warning: (title, message) => toast({ type: "warning", title, message }),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[9999] flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border p-4 shadow-lg",
                "bg-white/90 backdrop-blur-xl dark:bg-[#0f101a]/90",
                t.type === "success" && "border-emerald-500/30",
                t.type === "error" && "border-red-500/30",
                t.type === "info" && "border-brand-500/30",
                t.type === "warning" && "border-amber-500/30"
              )}
            >
              <div className="mt-0.5 shrink-0">{icons[t.type]}</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.title}</p>
                {t.message && (
                  <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{t.message}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 rounded-md p-1 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
