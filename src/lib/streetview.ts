const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <rect width="600" height="400" fill="#EEF4F3"/>
  <path d="M300 140c-33 0-60 27-60 60 0 45 60 110 60 110s60-65 60-110c0-33-27-60-60-60zm0 82a22 22 0 110-44 22 22 0 010 44z" fill="#2F5853" opacity="0.35"/>
  <text x="300" y="340" text-anchor="middle" fill="#6B6B6B" font-family="system-ui,sans-serif" font-size="16">Street view unavailable</text>
</svg>`;

export function getGoogleMapsApiKey(): string | undefined {
  return process.env.GOOGLE_MAPS_API_KEY;
}

export function buildStreetViewUrl(
  lat: number,
  lng: number,
  width: number,
  height: number
): string | null {
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey || (lat === 0 && lng === 0)) return null;

  const params = new URLSearchParams({
    size: `${width}x${height}`,
    location: `${lat},${lng}`,
    fov: "80",
    pitch: "0",
    key: apiKey,
  });

  return `https://maps.googleapis.com/maps/api/streetview?${params.toString()}`;
}

export function buildStreetViewMetadataUrl(
  lat: number,
  lng: number
): string | null {
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey || (lat === 0 && lng === 0)) return null;

  const params = new URLSearchParams({
    location: `${lat},${lng}`,
    key: apiKey,
  });

  return `https://maps.googleapis.com/maps/api/streetview/metadata?${params.toString()}`;
}

export async function hasStreetViewCoverage(
  lat: number,
  lng: number
): Promise<boolean> {
  const metadataUrl = buildStreetViewMetadataUrl(lat, lng);
  if (!metadataUrl) return false;

  try {
    const response = await fetch(metadataUrl);
    if (!response.ok) return true;
    const data = (await response.json()) as { status?: string };
    if (data.status === "OK") return true;
    if (data.status === "ZERO_RESULTS") return false;
    // Metadata API not enabled or restricted — try static image fetch instead.
    if (data.status === "REQUEST_DENIED") return true;
    return false;
  } catch {
    return true;
  }
}

export function getStreetViewProxyUrl(
  slug: string,
  width = 600,
  height = 400
): string {
  const params = new URLSearchParams({
    slug,
    w: String(width),
    h: String(height),
  });
  return `/api/streetview?${params.toString()}`;
}

export function getPlaceholderSvg(): string {
  return PLACEHOLDER_SVG;
}

export function getPlaceholderContentType(): string {
  return "image/svg+xml";
}
