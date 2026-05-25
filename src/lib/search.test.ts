import { describe, expect, it } from "vitest";
import { SEED_PROVIDERS } from "./seed";
import {
  computeRelevanceScore,
  filterProviders,
  getProcedurePrice,
  getSimilarProviders,
  searchProviders,
} from "./search";

describe("filterProviders", () => {
  it("filters by procedure", () => {
    const results = filterProviders(SEED_PROVIDERS, "", "IVF", "");
    expect(results.every((p) => p.procedures.includes("IVF"))).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });

  it("filters by Rhinoplasty", () => {
    const results = filterProviders(SEED_PROVIDERS, "", "Rhinoplasty", "");
    expect(results.length).toBeGreaterThanOrEqual(8);
    expect(results.every((p) => p.procedures.includes("Rhinoplasty"))).toBe(
      true
    );
  });

  it("filters by country including Colombia and South Korea", () => {
    expect(filterProviders(SEED_PROVIDERS, "", "", "Colombia").length).toBe(11);
    expect(filterProviders(SEED_PROVIDERS, "", "", "South Korea").length).toBe(
      10
    );
  });

  it("matches nose job alias to rhinoplasty providers", () => {
    const results = filterProviders(SEED_PROVIDERS, "nose job", "", "");
    expect(results.some((p) => p.procedures.includes("Rhinoplasty"))).toBe(
      true
    );
  });
});

describe("getProcedurePrice", () => {
  it("returns the matching line item price", () => {
    const provider = SEED_PROVIDERS.find((p) => p.slug === "istanbul-rhinoplasty-center")!;
    expect(getProcedurePrice(provider, "Rhinoplasty")).toBe(2900);
    expect(getProcedurePrice(provider, "Revision Rhinoplasty")).toBe(3800);
  });

  it("returns null when no line item matches", () => {
    const provider = SEED_PROVIDERS[0];
    expect(getProcedurePrice(provider, "Nonexistent Procedure")).toBeNull();
  });
});

describe("computeRelevanceScore", () => {
  it("scores procedure match higher than non-match", () => {
    const ivfProvider = SEED_PROVIDERS.find((p) =>
      p.procedures.includes("IVF")
    )!;
    const nonIvf = SEED_PROVIDERS.find((p) => !p.procedures.includes("IVF"))!;

    const ivfScore = computeRelevanceScore(ivfProvider, "", "IVF");
    const nonIvfScore = computeRelevanceScore(nonIvf, "", "IVF");

    expect(ivfScore).toBeGreaterThan(nonIvfScore);
  });
});

describe("searchProviders sorting", () => {
  it("returns rhinoplasty providers ranked by relevance for nose job query", () => {
    const results = searchProviders(
      SEED_PROVIDERS,
      "nose job",
      "",
      "",
      "relevance"
    );
    expect(results[0].procedures.includes("Rhinoplasty")).toBe(true);
  });

  it("sorts by rating when no query or procedure", () => {
    const results = searchProviders(SEED_PROVIDERS, "", "", "", "relevance");
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].rating).toBeGreaterThanOrEqual(results[i].rating);
    }
  });

  it("sorts rhinoplasty by price ascending", () => {
    const results = searchProviders(
      SEED_PROVIDERS,
      "",
      "Rhinoplasty",
      "",
      "price_asc"
    );
    for (let i = 1; i < results.length; i++) {
      const prev = getProcedurePrice(results[i - 1], "Rhinoplasty")!;
      const curr = getProcedurePrice(results[i], "Rhinoplasty")!;
      expect(prev).toBeLessThanOrEqual(curr);
    }
  });
});

describe("getSimilarProviders", () => {
  it("excludes the source provider", () => {
    const provider = SEED_PROVIDERS[0];
    const similar = getSimilarProviders(provider, SEED_PROVIDERS);
    expect(similar.every((p) => p.id !== provider.id)).toBe(true);
  });

  it("respects the limit", () => {
    const provider = SEED_PROVIDERS[0];
    const similar = getSimilarProviders(provider, SEED_PROVIDERS, 2);
    expect(similar.length).toBeLessThanOrEqual(2);
  });
});

describe("seed catalog", () => {
  it("contains at least 75 providers", () => {
    expect(SEED_PROVIDERS.length).toBeGreaterThanOrEqual(75);
  });

  it("has unique slugs", () => {
    const slugs = SEED_PROVIDERS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
