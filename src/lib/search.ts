import { Provider } from "./types";

export type SortOption =
  | "relevance"
  | "rating"
  | "price_asc"
  | "price_desc"
  | "reviews";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Best match" },
  { value: "rating", label: "Highest rated" },
  { value: "reviews", label: "Most reviews" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

const QUERY_ALIASES: Record<string, string[]> = {
  Rhinoplasty: ["nose job", "nose surgery", "nasal surgery"],
  "Hair Transplant": ["hair restoration", "fue"],
  "Tummy Tuck": ["abdominoplasty"],
  "Breast Augmentation": ["breast implants", "boob job"],
  "LASIK Eye Surgery": ["lasik", "laser eye"],
  "Gastric Sleeve": ["sleeve gastrectomy", "weight loss surgery"],
  "Gastric Bypass": ["roux-en-y", "weight loss surgery"],
};

export function parseSortOption(value: string | undefined): SortOption {
  const valid: SortOption[] = [
    "relevance",
    "rating",
    "price_asc",
    "price_desc",
    "reviews",
  ];
  if (value && valid.includes(value as SortOption)) {
    return value as SortOption;
  }
  return "relevance";
}

export function getProcedurePrice(
  provider: Provider,
  procedure: string
): number | null {
  if (!procedure) return null;

  const match = provider.procedurePrices.find((item) =>
    item.name.toLowerCase().includes(procedure.toLowerCase())
  );

  return match?.priceUsd ?? null;
}

export function getEffectivePrice(
  provider: Provider,
  procedure: string
): number {
  if (procedure && provider.procedures.includes(procedure)) {
    return (
      getProcedurePrice(provider, procedure) ??
      Math.min(...provider.procedurePrices.map((p) => p.priceUsd))
    );
  }
  return Math.min(...provider.procedurePrices.map((p) => p.priceUsd));
}

export function getDisplayedPrice(
  provider: Provider,
  procedure: string
): { amount: number; label: string } {
  if (procedure && provider.procedures.includes(procedure)) {
    return {
      amount: getEffectivePrice(provider, procedure),
      label: `Starting at for ${procedure}`,
    };
  }
  return {
    amount: getEffectivePrice(provider, procedure),
    label: "Starting at",
  };
}

function procedureMatchesQuery(procedure: string, normalizedQuery: string): boolean {
  if (procedure.toLowerCase().includes(normalizedQuery)) return true;

  const aliases = QUERY_ALIASES[procedure] ?? [];
  return aliases.some(
    (alias) =>
      normalizedQuery.includes(alias) || alias.includes(normalizedQuery)
  );
}

function matchesQuery(provider: Provider, normalizedQuery: string): boolean {
  if (!normalizedQuery) return true;

  if (
    provider.name.toLowerCase().includes(normalizedQuery) ||
    provider.city.toLowerCase().includes(normalizedQuery) ||
    provider.country.toLowerCase().includes(normalizedQuery)
  ) {
    return true;
  }

  return provider.procedures.some((procedure) =>
    procedureMatchesQuery(procedure, normalizedQuery)
  );
}

export function computeRelevanceScore(
  provider: Provider,
  query: string,
  procedure: string,
  priceRange?: { min: number; max: number }
): number {
  let score = 0;
  const normalizedQuery = query.trim().toLowerCase();

  if (procedure && provider.procedures.includes(procedure)) {
    score += 40;
  }

  if (normalizedQuery) {
    if (provider.name.toLowerCase().includes(normalizedQuery)) score += 30;
    if (provider.city.toLowerCase().includes(normalizedQuery)) score += 20;
    if (provider.country.toLowerCase().includes(normalizedQuery)) score += 15;
    if (
      provider.procedures.some((p) => procedureMatchesQuery(p, normalizedQuery))
    ) {
      score += 25;
    }
  }

  score += Math.min(provider.accreditations.length * 5, 20);
  score += provider.rating * Math.log10(provider.reviewCount + 1) * 3;

  if (
    procedure &&
    provider.procedures.includes(procedure) &&
    priceRange &&
    priceRange.max > priceRange.min
  ) {
    const price = getEffectivePrice(provider, procedure);
    const normalized =
      (priceRange.max - price) / (priceRange.max - priceRange.min);
    score += normalized * 15;
  }

  return score;
}

export function filterProviders(
  providers: Provider[],
  query: string,
  procedure: string,
  country: string
): Provider[] {
  return providers.filter((provider) => {
    const matchesProcedure =
      !procedure || provider.procedures.includes(procedure);
    const matchesCountry = !country || provider.country === country;
    return (
      matchesQuery(provider, query.trim().toLowerCase()) &&
      matchesProcedure &&
      matchesCountry
    );
  });
}

function resolveSortMode(
  sort: SortOption,
  query: string,
  procedure: string
): SortOption {
  if (sort === "relevance" && !query.trim() && !procedure) {
    return "rating";
  }
  return sort;
}

export function searchProviders(
  providers: Provider[],
  query: string,
  procedure: string,
  country: string,
  sort: SortOption
): Provider[] {
  const filtered = filterProviders(providers, query, procedure, country);
  const effectiveSort = resolveSortMode(sort, query, procedure);

  const prices = filtered
    .filter((p) => !procedure || p.procedures.includes(procedure))
    .map((p) => getEffectivePrice(p, procedure));
  const priceRange =
    prices.length > 0
      ? { min: Math.min(...prices), max: Math.max(...prices) }
      : undefined;

  if (effectiveSort === "relevance") {
    return filtered
      .map((provider) => ({
        provider,
        score: computeRelevanceScore(
          provider,
          query,
          procedure,
          priceRange
        ),
      }))
      .sort((a, b) => b.score - a.score)
      .map(({ provider }) => provider);
  }

  const sorted = [...filtered];

  switch (effectiveSort) {
    case "rating":
      sorted.sort(
        (a, b) =>
          b.rating - a.rating || b.reviewCount - a.reviewCount
      );
      break;
    case "reviews":
      sorted.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "price_asc":
      sorted.sort(
        (a, b) =>
          getEffectivePrice(a, procedure) - getEffectivePrice(b, procedure)
      );
      break;
    case "price_desc":
      sorted.sort(
        (a, b) =>
          getEffectivePrice(b, procedure) - getEffectivePrice(a, procedure)
      );
      break;
  }

  return sorted;
}

export function getSimilarProviders(
  provider: Provider,
  allProviders: Provider[],
  limit = 3
): Provider[] {
  return allProviders
    .filter((p) => p.id !== provider.id)
    .filter(
      (p) =>
        p.country === provider.country ||
        p.procedures.some((proc) => provider.procedures.includes(proc))
    )
    .map((p) => ({
      provider: p,
      score:
        (p.country === provider.country ? 10 : 0) +
        p.procedures.filter((proc) => provider.procedures.includes(proc))
          .length *
          5 +
        p.rating * Math.log10(p.reviewCount + 1),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ provider: p }) => p);
}
