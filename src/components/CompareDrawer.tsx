"use client";

import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Provider } from "@/lib/types";
import { formatPrice, getDisplayedPrice } from "@/lib/providers";

interface CompareDrawerProps {
  providers: Provider[];
  activeProcedure: string;
  onClear: () => void;
}

export function CompareDrawer({
  providers,
  activeProcedure,
  onClear,
}: CompareDrawerProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white p-4 shadow-lg sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">
            Compare clinics ({providers.length}/2)
          </h3>
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-medium text-sage-600 hover:text-sage-700"
          >
            Clear
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {providers.map((provider) => {
            const { amount, label } = getDisplayedPrice(
              provider,
              activeProcedure
            );
            return (
              <div
                key={provider.id}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{provider.name}</p>
                    <p className="mt-1 text-sm text-ink-muted">
                      {provider.city}, {provider.country}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-ink">
                    <Icon name="star" className="h-4 w-4 text-ink-faint" />
                    {provider.rating}
                  </div>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <dt className="text-ink-faint">Reviews</dt>
                    <dd className="font-medium text-ink">
                      {provider.reviewCount}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink-faint">Accreditations</dt>
                    <dd className="font-medium text-ink">
                      {provider.accreditations.length}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-ink-faint">{label}</dt>
                    <dd className="font-semibold text-ink">
                      {formatPrice(amount)}
                    </dd>
                  </div>
                </dl>
                <Link
                  href={`/providers/${provider.slug}`}
                  className="mt-3 inline-block text-sm font-medium text-sage-600 hover:text-sage-700"
                >
                  View details
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
