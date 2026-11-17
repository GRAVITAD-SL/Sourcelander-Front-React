import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Id de fallback determinista para freelancers sin id (provenientes de mocks
 * o de datos incompletos del scraper). Determinista para no romper el render
 * con Math.random() (regla react-hooks de pureza) ni generar ids distintos
 * entre renders/hidratación.
 */
export function buildFreelancerFallbackId(name?: string | null): string {
  const slug = (name ?? "sin-nombre")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
  return `freelancer-${slug || "sin-nombre"}`;
}
