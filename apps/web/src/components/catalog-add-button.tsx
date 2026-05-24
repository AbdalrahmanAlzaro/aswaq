"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/api";

/**
 * "Add to cart" for a single catalog offer. Snapshots the business name into
 * the cart line so /cart renders the real vendor without a follow-up API call.
 */
export function CatalogAddButton({
  product,
  vendorName,
}: {
  product: Product;
  vendorName: string;
}) {
  const t = useTranslations("Catalog");
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <Button
      kind={added ? "secondary" : "primary"}
      size="sm"
      icon={added ? "check" : "plus"}
      onClick={() => {
        addItem(product, 1, vendorName);
        setAdded(true);
        // Reset the "Added" state after a short pause so the same offer can
        // be added again. We don't push to /cart automatically — shoppers
        // typically compare a couple of items before checking out.
        setTimeout(() => setAdded(false), 1200);
      }}
    >
      {added ? t("added") : t("add")}
    </Button>
  );
}
