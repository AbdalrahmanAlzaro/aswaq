"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Icon } from "./ui/icon";

/* Verida — SearchBar. Re-skinned to Verida tokens; RTL-safe (logical box, the
 * search/filter glyphs are non-directional). API unchanged. */
export function SearchBar({
  placeholder,
  basePath = "/search",
}: {
  placeholder: string;
  basePath?: string;
}) {
  const [q, setQ] = useState("");
  const router = useRouter();
  return (
    <form
      action={basePath}
      onSubmit={(e) => {
        e.preventDefault();
        router.push(q ? `${basePath}?q=${encodeURIComponent(q)}` : basePath);
      }}
      role="search"
      className="mx-5 flex h-12 items-center gap-2 rounded-xl border border-input bg-background px-3"
    >
      <Icon name="search" size={18} className="text-muted-foreground" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-subtle-foreground"
      />
      <button
        type="button"
        aria-label="Filter"
        className="grid h-8 w-8 cursor-pointer place-items-center text-muted-foreground hover:text-foreground"
      >
        <Icon name="filter" size={18} />
      </button>
    </form>
  );
}
