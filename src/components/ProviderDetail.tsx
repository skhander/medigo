import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ProviderCard } from "@/components/ProviderCard";
import { StreetViewImage } from "@/components/StreetViewImage";
import { Provider } from "@/lib/types";
import { formatPrice } from "@/lib/providers";
import { getCountryFlag, isAccreditedProvider } from "@/lib/ui-helpers";

interface ProviderDetailProps {
  provider: Provider;
  similarProviders: Provider[];
}

const BADGE_STYLE = "bg-sage-100 text-sage-700";

export function ProviderDetail({
  provider,
  similarProviders,
}: ProviderDetailProps) {
  const flag = getCountryFlag(provider.country);

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-sage-600 transition hover:text-sage-700"
      >
        ← Back to all clinics
      </Link>

      <div className="card-shadow overflow-hidden rounded-xl border border-border bg-white">
        <div className="relative">
          <StreetViewImage
            slug={provider.slug}
            alt={`Street view of ${provider.name}`}
            className="h-64 w-full object-cover sm:h-80"
            width={800}
            height={480}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-6 pb-6 pt-16 sm:px-8">
            {flag && (
              <span
                className="absolute right-6 top-4 text-2xl leading-none drop-shadow"
                aria-hidden
              >
                {flag}
              </span>
            )}
            <h1 className="pr-12 text-2xl font-semibold text-white sm:text-3xl">
              {provider.name}
            </h1>
            <p className="mt-2 flex items-start gap-2 text-white/90">
              <Icon name="mapPin" className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{provider.address}</span>
            </p>
          </div>
        </div>

        <div className="border-b border-border bg-white px-6 py-5 sm:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-sm font-medium text-ink ring-1 ring-border">
              <Icon name="star" className="h-4 w-4" />
              {provider.rating} · {provider.reviewCount} reviews
            </span>
            <span className="rounded-full bg-surface px-3 py-1 text-sm font-medium text-ink ring-1 ring-border">
              {provider.city}, {provider.country}
            </span>
            {isAccreditedProvider(provider.accreditations) && (
              <span className="inline-flex items-center gap-1 rounded-full bg-sage-100 px-3 py-1 text-sm font-medium text-sage-700">
                <Icon name="shield" className="h-4 w-4 text-sage-500" />
                Accredited
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2">
          <div className="space-y-7">
            <section>
              <h2 className="text-lg font-semibold text-ink">About</h2>
              <p className="mt-2 leading-relaxed text-ink-muted">
                {provider.description}
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
                <Icon name="shield" className="h-5 w-5 text-sage-500" />
                Accreditations
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {provider.accreditations.map((badge) => (
                  <span
                    key={badge}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${BADGE_STYLE}`}
                  >
                    <Icon name="check" className="h-3.5 w-3.5" />
                    {badge}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-ink">Specialties</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {provider.procedures.map((procedure) => (
                  <span
                    key={procedure}
                    className="rounded-full bg-surface px-3 py-1.5 text-sm font-medium text-ink ring-1 ring-border"
                  >
                    {procedure}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
                <Icon name="tag" className="h-5 w-5 text-sage-500" />
                Treatment prices
              </h2>
              <div className="mt-3 overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface">
                      <th className="px-4 py-3 text-left font-semibold text-ink">
                        Treatment
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-ink">
                        Price (USD)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {provider.procedurePrices.map((item, index) => (
                      <tr
                        key={item.name}
                        className={
                          index % 2 === 0 ? "bg-white" : "bg-surface/50"
                        }
                      >
                        <td className="px-4 py-3 text-ink-muted">{item.name}</td>
                        <td className="px-4 py-3 text-right font-semibold text-ink">
                          {formatPrice(item.priceUsd)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="space-y-7">
            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
                <Icon name="mapPin" className="h-5 w-5 text-sage-500" />
                Location
              </h2>
              <div className="mt-3 overflow-hidden rounded-lg border border-border">
                <iframe
                  src={provider.mapEmbedUrl}
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${provider.name}`}
                  className="w-full"
                />
              </div>
              <p className="mt-2 text-sm text-ink-muted">{provider.address}</p>
            </section>

            <section className="rounded-xl border border-border bg-sage-50 p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
                <Icon name="chat" className="h-5 w-5 text-sage-500" />
                Contact this clinic
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Reach out directly to schedule a consultation. No middlemen, no
                pressure.
              </p>
              <div className="mt-4 space-y-2 text-sm text-ink">
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  <a
                    href={`mailto:${provider.contactEmail}`}
                    className="font-medium text-sage-600 underline hover:text-sage-700"
                  >
                    {provider.contactEmail}
                  </a>
                </p>
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  <a
                    href={`tel:${provider.contactPhone.replace(/\s/g, "")}`}
                    className="font-medium text-sage-600 underline hover:text-sage-700"
                  >
                    {provider.contactPhone}
                  </a>
                </p>
              </div>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <a
                  href={`mailto:${provider.contactEmail}?subject=MediGo Inquiry - ${provider.name}`}
                  className="flex-1 rounded-lg bg-sage-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-sage-600"
                >
                  Send email
                </a>
                <a
                  href={`tel:${provider.contactPhone.replace(/\s/g, "")}`}
                  className="flex-1 rounded-lg border border-border bg-white px-4 py-3 text-center text-sm font-semibold text-sage-600 transition hover:bg-white/80"
                >
                  Call now
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>

      {similarProviders.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ink">
            Other clinics you might consider
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Based on location and specialties
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similarProviders.map((similar) => (
              <ProviderCard key={similar.id} provider={similar} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
