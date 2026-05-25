import { Provider } from "../types";
import { PROCEDURE_BASE_PRICES } from "./procedures";
import { CountryName } from "./countries";

export interface ProviderInput {
  id: string;
  name: string;
  slug: string;
  country: CountryName;
  city: string;
  address: string;
  description: string;
  accreditations: string[];
  procedures: string[];
  procedurePrices?: { name: string; priceUsd: number }[];
  lat: number;
  lng: number;
  contactEmail: string;
  contactPhone: string;
  rating: number;
  reviewCount: number;
}

export function createProvider(input: ProviderInput): Provider {
  const procedurePrices =
    input.procedurePrices ??
    input.procedures.map((procedure) => ({
      name: procedure,
      priceUsd: PROCEDURE_BASE_PRICES[procedure] ?? 3000,
    }));

  return {
    id: input.id,
    name: input.name,
    slug: input.slug,
    country: input.country,
    city: input.city,
    address: input.address,
    description: input.description,
    accreditations: input.accreditations,
    procedures: input.procedures,
    procedurePrices,
    lat: input.lat,
    lng: input.lng,
    mapEmbedUrl: `https://maps.google.com/maps?q=${input.lat},${input.lng}&z=15&output=embed`,
    contactEmail: input.contactEmail,
    contactPhone: input.contactPhone,
    rating: input.rating,
    reviewCount: input.reviewCount,
  };
}

export function pricesFor(
  procedures: string[],
  overrides: Partial<Record<string, number>> = {}
): { name: string; priceUsd: number }[] {
  return procedures.map((procedure) => ({
    name: procedure,
    priceUsd: overrides[procedure] ?? PROCEDURE_BASE_PRICES[procedure] ?? 3000,
  }));
}
