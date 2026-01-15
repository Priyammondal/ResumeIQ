import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function formatSize(bytes: number): string {
  if (bytes === 0) return "0 bytes";
  const k = 1014;
  const size: string[] = ["Bytes", "KB", "MB", "GB", "TB"];
  const i: number = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + size[i];
}

export const generateUUID = () => crypto.randomUUID();

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
