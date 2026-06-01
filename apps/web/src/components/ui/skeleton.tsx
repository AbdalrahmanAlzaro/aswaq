"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* Verida — Skeleton
 * Adapted from 21st.dev "animated-loading-skeleton" (framer-motion), toned to the
 * BRAND principle: a calm 1 → 0.6 → 1 opacity pulse over 1.2s (no marketing
 * shimmer). Honours prefers-reduced-motion (renders static). RTL-safe.
 */
export function Skeleton({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className={cn("rounded-md bg-muted", className)}
      animate={reduce ? undefined : { opacity: [1, 0.6, 1] }}
      transition={
        reduce ? undefined : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
      }
    />
  );
}

/* A standard list-row skeleton (image slot + two text lines), matching the
 * card anatomy used across the app. */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-busy="true"
      className={cn(
        "flex items-center gap-4 rounded-2xl border border-border bg-card p-3.5",
        className,
      )}
    >
      <Skeleton className="h-16 w-24 shrink-0 rounded-xl" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-2.5 w-1/3" />
      </div>
    </div>
  );
}
