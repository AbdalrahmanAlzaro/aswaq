import { Readex_Pro } from "next/font/google";

/**
 * Verida type system — Readex Pro.
 *
 * One variable family covering BOTH Arabic and Latin (BRAND.md, Decision #4),
 * chosen for clear bilingual reading that serves the Arabic-first requirement
 * and the "clarity / truth" brand from a single harmonious type system.
 *
 * `next/font/google` self-hosts the font at build time (the .woff2 files are
 * emitted into the build output), so there is NO runtime request to Google —
 * this covers the offline / self-hosted concern with no CDN dependency.
 *
 * Readex Pro is a variable font, so we omit `weight` and load the full axis
 * range (the design uses 600 headlines / 500 labels-buttons / 400 body / 300
 * quiet display). The family is exposed as the CSS variable `--font-readex`,
 * which `--font-sans` in globals.css points at.
 */
export const readex = Readex_Pro({
  subsets: ["latin", "arabic"],
  variable: "--font-readex",
  display: "swap",
});

/** Convenience: the class that exposes `--font-readex` on <html>. */
export const fontVariables = readex.variable;
