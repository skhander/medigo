import Link from "next/link";
import { Icon } from "@/components/Icon";
import { StreetViewImage } from "@/components/StreetViewImage";
import { Provider } from "@/lib/types";
import { formatPrice, getDisplayedPrice } from "@/lib/providers";
import { getCountryFlag, isAccreditedProvider } from "@/lib/ui-helpers";

interface ProviderCardProps {
  provider: Provider;
  activeProcedure?: string;
  isSelectedForCompare?: boolean;
  onToggleCompare?: () => void;
}

const BADGE_STYLE = "bg-sage-100 text-sage-700";

export function ProviderCard({
  provider,
  activeProcedure = "",
  isSelectedForCompare = false,
  onToggleCompare,
}: ProviderCardProps) {
  const { amount, label } = getDisplayedPrice(provider, activeProcedure);
  const flag = getCountryFlag(provider.country);

  return (
    <article className="card-shadow group flex flex-col overflow-hidden rounded-xl border border-border bg-white transition hover:shadow-md">
      <div className="relative">
        <StreetViewImage
          slug={provider.slug}
          alt={`Street view of ${provider.name}`}
          className="h-44 w-full object-cover"
          width={600}
          height={352}
        />
        {flag && (
          <span
            className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-lg leading-none shadow-sm"
            title={provider.country}
            aria-label={provider.country}
          >
            {flag}
          </span>
        )}
      </div>
      <div className="border-b border-border bg-surface p-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-ink">{provider.name}</h2>
            {isAccreditedProvider(provider.accreditations) && (
              <span className="inline-flex items-center gap-1 rounded-full bg-sage-100 px-2 py-0.5 text-xs font-medium text-sage-700">
                <Icon name="shield" className="h-3 w-3 text-sage-500" />
                Accredited
              </span>
            )}
          </div>
          <p className="mt-1 flex items-center gap-1 text-sm text-ink-muted">
            <Icon name="mapPin" className="h-4 w-4 text-ink-faint" />
            {provider.city}, {provider.country}
          </p>
        </div>

        <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-ink ring-1 ring-border">
          <Icon name="star" className="h-3.5 w-3.5 text-ink" />
          {provider.rating} · {provider.reviewCount} reviews
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {provider.accreditations.slice(0, 3).map((badge) => (
            <span
              key={badge}
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${BADGE_STYLE}`}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="line-clamp-2 text-sm leading-relaxed text-ink-muted">
          {provider.description}
        </p>

        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-ink">Treatment prices</p>
          <ul className="space-y-1.5">
            {provider.procedurePrices.slice(0, 3).map((item) => (
              <li
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-ink-muted">{item.name}</span>
                <span className="font-semibold text-ink">
                  {formatPrice(item.priceUsd)}
                </span>
              </li>
            ))}
            {provider.procedurePrices.length > 3 && (
              <li className="text-xs text-ink-faint">
                +{provider.procedurePrices.length - 3} more treatments
              </li>
            )}
          </ul>
        </div>

        <div className="mt-4 rounded-lg bg-sage-50 px-4 py-3">
          <p className="text-xs font-medium text-ink-muted">{label}</p>
          <p className="text-xl font-semibold text-ink">{formatPrice(amount)}</p>
        </div>

        {onToggleCompare && (
          <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-ink-muted">
            <input
              type="checkbox"
              checked={isSelectedForCompare}
              onChange={onToggleCompare}
              className="rounded border-border text-sage-500 focus:ring-sage-100"
            />
            Compare clinic
          </label>
        )}

        <div className="mt-4 flex gap-2">
          <Link
            href={`/providers/${provider.slug}`}
            className="flex-1 rounded-lg bg-sage-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-sage-600"
          >
            View clinic
          </Link>
          <a
            href={`mailto:${provider.contactEmail}`}
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-sage-600 transition hover:bg-sage-50"
          >
            Contact clinic
          </a>
        </div>
      </div>
    </article>
  );
}
