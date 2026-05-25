export const COUNTRY_FLAG: Record<string, string> = {
  Mexico: "🇲🇽",
  Thailand: "🇹🇭",
  India: "🇮🇳",
  Turkey: "🇹🇷",
  "Costa Rica": "🇨🇷",
  Colombia: "🇨🇴",
  "South Korea": "🇰🇷",
};

export function getCountryFlag(country: string): string {
  return COUNTRY_FLAG[country] ?? "";
}

export function isAccreditedProvider(accreditations: string[]): boolean {
  return accreditations.length > 0;
}
