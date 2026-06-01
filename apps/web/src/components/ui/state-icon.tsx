"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* Verida — StateIcon (loading / success / error)
 * Adapted from 21st.dev "animated-state-icons" (framer-motion): the loading
 * spinner morphs into a drawn checkmark on success; error draws a cross. Motion
 * (pathLength draw, linear spinner, 0.4s/0.2s-delay check) is preserved from the
 * source; colour comes from `currentColor` (set text-success / text-destructive /
 * text-primary on the parent). Honours prefers-reduced-motion (snaps to final).
 * Controlled via `state` (not the source's auto-toggle). RTL-safe (symmetric SVG).
 */
type IconState = "loading" | "success" | "error";

export function StateIcon({
  state,
  size = 40,
  className,
  label,
}: {
  state: IconState;
  size?: number;
  className?: string;
  label?: string;
}) {
  const reduce = useReducedMotion();
  const draw = (duration: number, delay = 0) =>
    reduce ? { duration: 0 } : { duration, delay };
  const fromZero = { pathLength: reduce ? 1 : 0 };

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      style={{ width: size, height: size }}
      className={cn("text-current", className)}
      role="img"
      aria-label={label ?? state}
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === "loading" && (
          <motion.g key="loading" exit={{ opacity: 0 }}>
            <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth={2} opacity={0.2} />
            <motion.circle
              cx="20"
              cy="20"
              r="16"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray="25 75"
              animate={reduce ? undefined : { rotate: 360 }}
              transition={reduce ? undefined : { duration: 1, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "20px 20px" }}
            />
          </motion.g>
        )}

        {state === "success" && (
          <motion.g key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.circle
              cx="20"
              cy="20"
              r="16"
              stroke="currentColor"
              strokeWidth={2}
              initial={fromZero}
              animate={{ pathLength: 1 }}
              transition={draw(0.5)}
            />
            <motion.path
              d="M12 20l6 6 10-12"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={fromZero}
              animate={{ pathLength: 1 }}
              transition={draw(0.4, reduce ? 0 : 0.2)}
            />
          </motion.g>
        )}

        {state === "error" && (
          <motion.g key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.circle
              cx="20"
              cy="20"
              r="16"
              stroke="currentColor"
              strokeWidth={2}
              initial={fromZero}
              animate={{ pathLength: 1 }}
              transition={draw(0.5)}
            />
            <motion.path
              d="M14 14l12 12"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              initial={fromZero}
              animate={{ pathLength: 1 }}
              transition={draw(0.3, reduce ? 0 : 0.2)}
            />
            <motion.path
              d="M26 14l-12 12"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              initial={fromZero}
              animate={{ pathLength: 1 }}
              transition={draw(0.3, reduce ? 0 : 0.32)}
            />
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  );
}
