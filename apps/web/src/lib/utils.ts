import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn — merge class names with Tailwind-aware conflict resolution.
 * `clsx` resolves conditionals/arrays; `twMerge` de-dupes conflicting
 * Tailwind utilities so the last one wins (e.g. `px-2 px-4` -> `px-4`).
 * Used by the cva-based UI primitives (see components/ui/button.tsx).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
