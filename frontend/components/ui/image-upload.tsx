"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, RefreshCw, Trash2, UploadCloud, Loader2, FileText } from "lucide-react";
import { motion } from "framer-motion";
import api, { getErrorMessage } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { cn, fileToDataUrl, formatBytes, isValidImageType, MAX_IMAGE_SIZE } from "@/lib/utils";
import type { ApiResponse, ImageRef } from "@/types";

interface ImageUploadProps {
  value?: string | ImageRef | null;
  onChange: (ref: ImageRef | null) => void;
  label?: string;
  className?: string;
  aspect?: string;
}

function toUrl(value?: string | ImageRef | null): string {
  if (!value) return "";
  return typeof value === "string" ? value : value.url || "";
}

export function ImageUpload({ value, onChange, label, className, aspect = "aspect-video" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const { error: errorToast } = useToast();

  const handleFile = async (file: File) => {
    if (!isValidImageType(file)) {
      errorToast("Invalid file type", "Please upload PNG, JPG, JPEG, WEBP or SVG.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      errorToast("File too large", "Maximum file size is 5MB.");
      return;
    }
    setPreview(await fileToDataUrl(file));
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await api.post<ApiResponse<{ url: string; publicId: string }>>("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange({ url: response.data.data.url, publicId: response.data.data.publicId });
    } catch (err) {
      errorToast("Upload failed", getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const shownImage = toUrl(value) || preview;

  return (
    <div className={cn("space-y-2", className)}>
      {label && <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</p>}
      <div className={cn("group relative w-full overflow-hidden rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700", aspect)}>
        {shownImage ? (
          <>
            <Image
              src={shownImage}
              alt={label || "Upload preview"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
            />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-white transition hover:bg-white/30"
                title="Replace"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setPreview("");
                  if (inputRef.current) inputRef.current.value = "";
                }}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/80 text-white transition hover:bg-red-500"
                title="Delete"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400 transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
          >
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
            ) : (
              <>
                <UploadCloud className="h-8 w-8 text-brand-500" />
                <span className="text-sm font-medium">Click to upload</span>
                <span className="text-xs text-slate-400">PNG, JPG, JPEG, WEBP, SVG</span>
              </>
            )}
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
      {uploading && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 text-xs text-brand-500">
          <Loader2 className="h-3 w-3 animate-spin" /> Uploading...
        </motion.p>
      )}
    </div>
  );
}

interface ResumeUploadProps {
  value?: string;
  onChange: (url: string, publicId?: string) => void;
  label?: string;
  className?: string;
}

export function ResumeUpload({ value, onChange, label, className }: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const { error: errorToast } = useToast();

  const handleFile = async (file: File) => {
    const okTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!okTypes.includes(file.type)) {
      errorToast("Invalid file type", "Please upload a PDF, DOC or DOCX resume.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      errorToast("File too large", "Maximum file size is 10MB.");
      return;
    }
    setFileName(file.name);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const response = await api.post<ApiResponse<{ url: string; publicId: string }>>("/upload/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(response.data.data.url, response.data.data.publicId);
    } catch (err) {
      errorToast("Upload failed", getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 transition hover:border-brand-500 hover:text-brand-500 dark:border-slate-700"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          {value ? "Replace resume" : "Upload resume"}
        </button>
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sm text-brand-600 hover:underline dark:text-brand-400"
          >
            <FileText className="h-4 w-4" /> {fileName || "View file"}
          </a>
        )}
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf,application/msword,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {fileName && !uploading && (
        <p className="text-xs text-slate-400">
          {fileName} ({formatBytes(0)})
        </p>
      )}
    </div>
  );
}
