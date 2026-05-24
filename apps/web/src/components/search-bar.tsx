"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Icon } from "./ui/icon";

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
      className="flex items-center gap-2 h-12 bg-white rounded-[var(--radius-md)] border border-[var(--border-strong)] px-3 mx-5"
    >
      <Icon name="search" size={18} className="text-[var(--fg-2)]" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-[15px] text-[var(--fg-1)] placeholder:text-[var(--fg-mute)]"
      />
      <button
        type="button"
        aria-label="Filter"
        className="grid place-items-center w-8 h-8 text-[var(--fg-2)] hover:text-[var(--fg-1)] cursor-pointer"
      >
        <Icon name="filter" size={18} />
      </button>
    </form>
  );
}
