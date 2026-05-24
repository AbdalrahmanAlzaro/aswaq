"use client";

import { useState, type ReactNode } from "react";

export type BusinessTabKey = "menu" | "reviews" | "about";

export function BusinessTabs({
  menuLabel,
  reviewsLabel,
  aboutLabel,
  menu,
  reviews,
  about,
}: {
  menuLabel: ReactNode;
  reviewsLabel: ReactNode;
  aboutLabel: ReactNode;
  menu: ReactNode;
  reviews: ReactNode;
  about: ReactNode;
}) {
  const [active, setActive] = useState<BusinessTabKey>("menu");

  return (
    <>
      <nav
        role="tablist"
        className="flex border-b border-[var(--border)] ps-5 gap-0 text-sm font-semibold"
      >
        <TabButton
          active={active === "menu"}
          onClick={() => setActive("menu")}
        >
          {menuLabel}
        </TabButton>
        <TabButton
          active={active === "reviews"}
          onClick={() => setActive("reviews")}
        >
          {reviewsLabel}
        </TabButton>
        <TabButton
          active={active === "about"}
          onClick={() => setActive("about")}
        >
          {aboutLabel}
        </TabButton>
      </nav>

      {active === "menu" && menu}
      {active === "reviews" && reviews}
      {active === "about" && about}
    </>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        "px-4 py-3.5 border-b-2 -mb-px cursor-pointer bg-transparent",
        "transition-colors duration-150 [transition-timing-function:var(--ease-out-aswaq)]",
        active
          ? "border-[var(--accent)] text-[var(--fg-1)]"
          : "border-transparent text-[var(--fg-3)] hover:text-[var(--fg-1)]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
