"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { FEATURED_PROCEDURES } from "@/lib/types";

export function ProcedureChips() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const activeProcedure = searchParams.get("procedure") ?? "";

  const selectProcedure = useCallback(
    (procedure: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (activeProcedure === procedure) {
        params.delete("procedure");
      } else {
        params.set("procedure", procedure);
      }
      startTransition(() => {
        router.push(`/?${params.toString()}`, { scroll: false });
      });
      document.getElementById("results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    [activeProcedure, router, searchParams]
  );

  return (
    <div>
      <p className="mb-3 text-sm font-medium text-ink-muted">
        Popular treatments
      </p>
      <div className="flex flex-wrap gap-2">
        {FEATURED_PROCEDURES.map((procedure) => {
          const isActive = activeProcedure === procedure;
          return (
            <button
              key={procedure}
              type="button"
              onClick={() => selectProcedure(procedure)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-sage-500 text-white shadow-sm"
                  : "bg-white text-ink ring-1 ring-border hover:bg-sage-50 hover:ring-border-strong"
              }`}
            >
              {procedure}
            </button>
          );
        })}
      </div>

      {isPending && (
        <p className="mt-3 text-xs font-medium text-ink-faint">
          Updating results...
        </p>
      )}
    </div>
  );
}
