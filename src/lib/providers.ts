import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Provider } from "./types";
import { SEED_PROVIDERS } from "./seed-data";

export {
  searchProviders,
  filterProviders,
  getSimilarProviders,
  parseSortOption,
  getDisplayedPrice,
  getEffectivePrice,
  getProcedurePrice,
} from "./search";
export type { SortOption } from "./search";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabase;
}

function parseCoordsFromMapUrl(mapEmbedUrl: string): { lat: number; lng: number } {
  const match = mapEmbedUrl.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (match) {
    return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  }
  return { lat: 0, lng: 0 };
}

function resolveCoords(
  rowLat: unknown,
  rowLng: unknown,
  mapEmbedUrl: string
): { lat: number; lng: number } {
  const parsed = parseCoordsFromMapUrl(mapEmbedUrl);
  const lat = Number(rowLat);
  const lng = Number(rowLng);

  if (Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0)) {
    return { lat, lng };
  }

  return parsed;
}

export function resolveProviderCoords(
  rowLat: unknown,
  rowLng: unknown,
  mapEmbedUrl: string
): { lat: number; lng: number } {
  return resolveCoords(rowLat, rowLng, mapEmbedUrl);
}

function rowToProvider(row: Record<string, unknown>): Provider {
  const mapEmbedUrl = row.map_embed_url as string;
  const { lat, lng } = resolveCoords(row.lat, row.lng, mapEmbedUrl);

  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    country: row.country as string,
    city: row.city as string,
    address: row.address as string,
    description: row.description as string,
    accreditations: row.accreditations as string[],
    procedures: row.procedures as string[],
    procedurePrices: row.procedure_prices as Provider["procedurePrices"],
    lat,
    lng,
    mapEmbedUrl,
    contactEmail: row.contact_email as string,
    contactPhone: row.contact_phone as string,
    rating: row.rating as number,
    reviewCount: row.review_count as number,
  };
}

export async function getProviders(): Promise<Provider[]> {
  const client = getSupabaseClient();

  if (!client) {
    return SEED_PROVIDERS;
  }

  const { data, error } = await client
    .from("providers")
    .select("*")
    .order("name");

  if (error || !data?.length) {
    return SEED_PROVIDERS;
  }

  return data.map(rowToProvider);
}

export async function getProviderBySlug(slug: string): Promise<Provider | null> {
  const client = getSupabaseClient();

  if (!client) {
    return SEED_PROVIDERS.find((p) => p.slug === slug) ?? null;
  }

  const { data, error } = await client
    .from("providers")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return SEED_PROVIDERS.find((p) => p.slug === slug) ?? null;
  }

  return rowToProvider(data);
}

export function formatPrice(usd: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(usd);
}
