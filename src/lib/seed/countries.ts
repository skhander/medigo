export const COUNTRIES = [
  "Mexico",
  "Thailand",
  "India",
  "Turkey",
  "Costa Rica",
  "Colombia",
  "South Korea",
] as const;

export type CountryName = (typeof COUNTRIES)[number];

export const COUNTRY_PHONE_PREFIX: Record<CountryName, string> = {
  Mexico: "+52",
  Thailand: "+66",
  India: "+91",
  Turkey: "+90",
  "Costa Rica": "+506",
  Colombia: "+57",
  "South Korea": "+82",
};
