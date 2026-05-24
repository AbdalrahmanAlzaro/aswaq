"use client";

import { useCart } from "@/lib/cart-context";
import { Icon } from "@/components/ui/icon";

export function CartQtyStepper({
  productId,
  initialQty,
}: {
  productId: string;
  initialQty: number;
}) {
  const { setQty } = useCart();

  return (
    <div className="inline-flex items-center bg-[var(--bg-raised)] rounded-full p-0.5">
      <button
        type="button"
        aria-label="Decrement"
        disabled={initialQty <= 0}
        onClick={() => setQty(productId, Math.max(0, initialQty - 1))}
        className="w-7 h-7 rounded-full grid place-items-center cursor-pointer text-[var(--fg-1)] disabled:opacity-50"
      >
        <Icon name="minus" size={14} />
      </button>
      <span className="num min-w-[22px] text-center font-bold text-[13px]">
        {initialQty}
      </span>
      <button
        type="button"
        aria-label="Increment"
        onClick={() => setQty(productId, initialQty + 1)}
        className="w-7 h-7 rounded-full grid place-items-center cursor-pointer bg-[var(--accent)] text-[var(--accent-fg)] disabled:opacity-50"
      >
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
}
