"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, Product } from "@/lib/api";

const STORAGE_KEY = "aswaq_cart_v1";

interface CartState {
  lines: CartLine[];
  // `vendorName` is snapshotted onto the cart line so /cart can render the
  // real shop name without a follow-up GET /businesses/:id.
  addItem: (product: Product, qty?: number, vendorName?: string) => void;
  setQty: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  totalItems: number;
}

const CartContext = createContext<CartState | null>(null);

// In-memory cart, mirrored to localStorage so the cart survives reload. There
// is intentionally NO server cart — checkout calls POST /orders per business.
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) setLines(parsed);
      }
    } catch {
      /* corrupted storage — start fresh */
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* quota exceeded / private mode — ignore */
    }
  }, [lines, ready]);

  const addItem = useCallback(
    (product: Product, qty: number = 1, vendorName?: string) => {
      setLines((prev) => {
        const existing = prev.find((l) => l.product.id === product.id);
        if (existing) {
          return prev.map((l) =>
            l.product.id === product.id
              ? {
                  ...l,
                  qty: l.qty + qty,
                  // Refresh the snapshot if the caller supplied a new name
                  // (e.g. business renamed between adds).
                  vendorName: vendorName ?? l.vendorName,
                }
              : l,
          );
        }
        return [...prev, { product, qty, vendorName }];
      });
    },
    [],
  );

  const setQty = useCallback((productId: string, qty: number) => {
    setLines((prev) => {
      if (qty <= 0) return prev.filter((l) => l.product.id !== productId);
      return prev.map((l) => (l.product.id === productId ? { ...l, qty } : l));
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.product.id !== productId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartState>(
    () => ({
      lines,
      addItem,
      setQty,
      removeItem,
      clear,
      totalItems: lines.reduce((n, l) => n + l.qty, 0),
    }),
    [lines, addItem, setQty, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
