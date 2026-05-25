export interface ProcedurePrice {
  name: string;
  priceUsd: number;
}

export interface Provider {
  id: string;
  name: string;
  slug: string;
  country: string;
  city: string;
  address: string;
  description: string;
  accreditations: string[];
  procedures: string[];
  procedurePrices: ProcedurePrice[];
  lat: number;
  lng: number;
  mapEmbedUrl: string;
  contactEmail: string;
  contactPhone: string;
  rating: number;
  reviewCount: number;
}

export interface SearchFilters {
  query: string;
  procedure: string;
  country: string;
  sort: SortOption;
}

export type SortOption =
  | "relevance"
  | "rating"
  | "price_asc"
  | "price_desc"
  | "reviews";

export {
  POPULAR_PROCEDURES,
  PROCEDURE_CATEGORIES,
  FEATURED_PROCEDURES,
} from "./seed/procedures";

export { COUNTRIES } from "./seed/countries";
