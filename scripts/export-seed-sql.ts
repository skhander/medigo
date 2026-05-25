import { writeFileSync } from "fs";
import { join } from "path";
import { SEED_PROVIDERS } from "../src/lib/seed/index";

function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}

function toSqlArray(values: string[]): string {
  return `array[${values.map((v) => `'${escapeSql(v)}'`).join(", ")}]`;
}

function toSqlJson(values: { name: string; priceUsd: number }[]): string {
  return `'${JSON.stringify(values).replace(/'/g, "''")}'::jsonb`;
}

const rows = SEED_PROVIDERS.map((provider) => {
  return `(
  '${escapeSql(provider.name)}',
  '${escapeSql(provider.slug)}',
  '${escapeSql(provider.country)}',
  '${escapeSql(provider.city)}',
  '${escapeSql(provider.address)}',
  '${escapeSql(provider.description)}',
  ${toSqlArray(provider.accreditations)},
  ${toSqlArray(provider.procedures)},
  ${toSqlJson(provider.procedurePrices)},
  ${provider.lat},
  ${provider.lng},
  '${escapeSql(provider.mapEmbedUrl)}',
  '${escapeSql(provider.contactEmail)}',
  '${escapeSql(provider.contactPhone)}',
  ${provider.rating},
  ${provider.reviewCount}
)`;
}).join(",\n");

const sql = `-- MediGo expanded seed (${SEED_PROVIDERS.length} providers)
-- Generated from src/lib/seed — run: npm run seed:sql

DELETE FROM providers;

INSERT INTO providers (
  name, slug, country, city, address, description,
  accreditations, procedures, procedure_prices,
  lat, lng, map_embed_url, contact_email, contact_phone, rating, review_count
) VALUES
${rows}
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  country = EXCLUDED.country,
  city = EXCLUDED.city,
  address = EXCLUDED.address,
  description = EXCLUDED.description,
  accreditations = EXCLUDED.accreditations,
  procedures = EXCLUDED.procedures,
  procedure_prices = EXCLUDED.procedure_prices,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  map_embed_url = EXCLUDED.map_embed_url,
  contact_email = EXCLUDED.contact_email,
  contact_phone = EXCLUDED.contact_phone,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count;
`;

const outputPath = join(process.cwd(), "supabase", "seed-expansion.sql");
writeFileSync(outputPath, sql);
console.log(`Wrote ${SEED_PROVIDERS.length} providers to ${outputPath}`);
