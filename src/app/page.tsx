import { Suspense } from "react";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { ProcedureChips } from "@/components/ProcedureChips";
import { ResultsSort } from "@/components/ResultsSort";
import { ProviderListing } from "@/components/ProviderListing";
import { Icon } from "@/components/Icon";
import {
  getProviders,
  parseSortOption,
  searchProviders,
} from "@/lib/providers";

interface HomeProps {
  searchParams: Promise<{
    q?: string;
    procedure?: string;
    country?: string;
    sort?: string;
  }>;
}

function getResultsSubtitle(
  count: number,
  query: string,
  procedure: string,
  country: string
): string {
  const countText = `${count} clinic${count !== 1 ? "s" : ""} found`;

  if (procedure && !query && !country) {
    return `${countText} for ${procedure}`;
  }

  if (query && !procedure && !country) {
    return `${countText} matching "${query}"`;
  }

  if (query || procedure || country) {
    return `${countText} matching your search`;
  }

  return countText;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const procedure = params.procedure ?? "";
  const country = params.country ?? "";
  const sort = parseSortOption(params.sort);

  const allProviders = await getProviders();
  const providers = searchProviders(
    allProviders,
    query,
    procedure,
    country,
    sort
  );

  const hasFilters = Boolean(query || procedure || country);

  return (
    <>
      <Header />

      <main>
        <section className="hero-surface px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <p className="mb-3 text-sm font-medium text-ink-muted">
              Verified clinics worldwide
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Find trusted care abroad
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">
              Compare accredited clinics with transparent pricing and direct
              contact — ranked by relevance, not ads.
            </p>
          </div>
        </section>

        <section className="relative -mt-6 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Suspense fallback={<SearchSkeleton />}>
              <SearchBar />
            </Suspense>
          </div>
        </section>

        <section
          id="results"
          className="scroll-mt-24 px-4 py-10 pb-12 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <Suspense fallback={null}>
              <ProcedureChips />
            </Suspense>

            <div className="mb-8 mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-ink">
                  {providers.length === allProviders.length && !hasFilters
                    ? "All clinics"
                    : "Search results"}
                </h2>
                <p className="mt-1 text-sm text-ink-muted">
                  {getResultsSubtitle(
                    providers.length,
                    query,
                    procedure,
                    country
                  )}
                </p>
              </div>
              <Suspense fallback={null}>
                <ResultsSort />
              </Suspense>
            </div>

            {providers.length > 0 ? (
              <Suspense fallback={null}>
                <ProviderListing
                  providers={providers}
                  allProviders={allProviders}
                  activeProcedure={procedure}
                />
              </Suspense>
            ) : (
              <div className="card-shadow rounded-xl border border-dashed border-border bg-white px-6 py-16 text-center">
                <Icon
                  name="search"
                  className="mx-auto h-10 w-10 text-ink-faint"
                />
                <p className="mt-4 text-lg font-semibold text-ink">
                  No clinics match your search
                </p>
                <p className="mt-2 text-sm text-ink-muted">
                  Try adjusting your search or selecting a different treatment.
                </p>
              </div>
            )}
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-y border-border bg-white px-4 py-12 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center text-2xl font-semibold text-ink">
              How MediGo works
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-center text-sm text-ink-muted">
              Three steps to find care you can feel confident about
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                {
                  icon: "search" as const,
                  title: "Search and compare",
                  desc: "Search by clinic, city, or treatment — or pick a popular treatment above. Results are ranked by relevance.",
                },
                {
                  icon: "clipboard" as const,
                  title: "Review with confidence",
                  desc: "See transparent pricing, accreditations, and patient reviews before you reach out.",
                },
                {
                  icon: "chat" as const,
                  title: "Contact directly",
                  desc: "Connect with clinics yourself to schedule a consultation and plan your trip.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="card-shadow rounded-xl border border-border bg-white p-7 text-center"
                >
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-sage-100">
                    <Icon
                      name={item.icon}
                      className="h-6 w-6 text-sage-500"
                    />
                  </span>
                  <h3 className="mt-4 font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-medium text-ink">
            MediGo — care beyond borders
          </p>
          <p className="mt-1 text-xs text-ink-faint">
            © {new Date().getFullYear()} MediGo. All providers independently
            listed.
          </p>
        </div>
      </footer>
    </>
  );
}

function SearchSkeleton() {
  return (
    <div className="card-shadow h-20 animate-pulse rounded-xl border border-border bg-white" />
  );
}
