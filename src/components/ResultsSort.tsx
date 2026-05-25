"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { SORT_OPTIONS, parseSortOption } from "@/lib/search";

export function ResultsSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const sort = parseSortOption(searchParams.get("sort") ?? undefined);

  const updateSort = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "relevance") {
        params.set("sort", value);
      } else {
        params.delete("sort");
      }
      startTransition(() => {
        router.push(`/?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams]
  );

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort"
        className="whitespace-nowrap text-sm font-medium text-ink-muted"
      >
        Sort by
      </label>
      <select
        id="sort"
        value={sort}
        disabled={isPending}
        onChange={(e) => updateSort(e.target.value)}
        className="rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-sage-500 focus:ring-2 focus:ring-sage-100 disabled:opacity-60"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
