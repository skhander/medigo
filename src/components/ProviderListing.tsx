"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CompareDrawer } from "@/components/CompareDrawer";
import { ProviderCard } from "@/components/ProviderCard";
import { Provider } from "@/lib/types";

interface ProviderListingProps {
  providers: Provider[];
  allProviders: Provider[];
  activeProcedure: string;
}

export function ProviderListing({
  providers,
  allProviders,
  activeProcedure,
}: ProviderListingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const compareParam = searchParams.get("compare") ?? "";
  const compareSlugs = compareParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 2);

  function toggleCompare(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    let slugs = [...compareSlugs];

    if (slugs.includes(slug)) {
      slugs = slugs.filter((s) => s !== slug);
    } else if (slugs.length < 2) {
      slugs.push(slug);
    } else {
      slugs = [slugs[1], slug];
    }

    if (slugs.length > 0) {
      params.set("compare", slugs.join(","));
    } else {
      params.delete("compare");
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  }

  const comparedProviders = compareSlugs
    .map((slug) => allProviders.find((p) => p.slug === slug))
    .filter((p): p is Provider => Boolean(p));

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            activeProcedure={activeProcedure}
            isSelectedForCompare={compareSlugs.includes(provider.slug)}
            onToggleCompare={() => toggleCompare(provider.slug)}
          />
        ))}
      </div>

      {comparedProviders.length > 0 && (
        <CompareDrawer
          providers={comparedProviders}
          activeProcedure={activeProcedure}
          onClear={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("compare");
            router.push(`/?${params.toString()}`, { scroll: false });
          }}
        />
      )}
    </>
  );
}
