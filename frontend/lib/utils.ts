import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const SITE_NAME = "SSS Grow Tech";

export const DEFAULT_LOGO = "/sssgrow.jpg";

export function formatDate(date?: string | Date | null): string {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date?: string | Date | null): string {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getInitials(name?: string): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function truncate(text?: string, length = 120): string {
  if (!text) return "";
  return text.length > length ? `${text.slice(0, length)}...` : text;
}

export function resolveImageUrl(url?: string, fallback = "/sssgrow.jpg"): string {
  if (!url) return fallback;
  if (url.startsWith("http") || url.startsWith("/")) return url;
  return `${API_URL.replace("/api/v1", "")}${url}`;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function isValidImageType(file: File): boolean {
  return ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml", "image/gif"].includes(file.type);
}

export function isValidResumeType(file: File): boolean {
  return ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
