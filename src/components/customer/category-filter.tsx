"use client";

import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: Array<{ id: string; name: string }>;
  selected: string | null;
  onSelect: (categoryId: string | null) => void;
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  const pills = [{ id: null, name: "Semua" }, ...categories.map((c) => ({ id: c.id, name: c.name }))];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {pills.map((category) => {
        const isActive =
          category.id === null ? selected === null : selected === category.id;

        return (
          <button
            key={category.id ?? "all"}
            type="button"
            onClick={() => onSelect(category.id)}
            className={cn(
              "shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                : "bg-white text-muted-foreground ring-1 ring-black/6 hover:bg-brand-light hover:text-foreground hover:ring-primary/20",
            )}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
