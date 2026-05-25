"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Icon } from "@/components/Icon";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const query = searchParams.get("q") ?? "";

  const updateSearch = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      startTransition(() => {
        router.push(`/?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams]
  );

  return (
    <div className="card-shadow rounded-xl border border-border bg-white p-5 sm:p-6">
      <div className="relative">
        <Icon
          name="search"
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-faint"
        />
        <input
          id="search"
          type="search"
          placeholder="Search clinics, cities, or treatments..."
          defaultValue={query}
          onChange={(e) => updateSearch({ q: e.target.value })}
          className="w-full rounded-lg border border-border bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-sage-500 focus:ring-2 focus:ring-sage-100 sm:text-base"
        />
      </div>

      {isPending && (
        <p className="mt-3 text-xs font-medium text-ink-faint">
          Updating results...
        </p>
      )}
    </div>
  );
}
