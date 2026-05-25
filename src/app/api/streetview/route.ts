import { NextRequest, NextResponse } from "next/server";
import { getProviderBySlug } from "@/lib/providers";
import {
  buildStreetViewUrl,
  getGoogleMapsApiKey,
  getPlaceholderContentType,
  getPlaceholderSvg,
  hasStreetViewCoverage,
} from "@/lib/streetview";

function placeholderResponse(cacheSeconds = 3600) {
  return new NextResponse(getPlaceholderSvg(), {
    headers: {
      "Content-Type": getPlaceholderContentType(),
      "Cache-Control": `public, max-age=${cacheSeconds}`,
    },
  });
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  const width = Math.min(
    Math.max(Number(request.nextUrl.searchParams.get("w") ?? 600), 100),
    1200
  );
  const height = Math.min(
    Math.max(Number(request.nextUrl.searchParams.get("h") ?? 400), 100),
    800
  );

  if (!slug) {
    return placeholderResponse();
  }

  const provider = await getProviderBySlug(slug);
  if (!provider) {
    return placeholderResponse();
  }

  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    return placeholderResponse();
  }

  const covered = await hasStreetViewCoverage(provider.lat, provider.lng);
  if (!covered) {
    return placeholderResponse(86400);
  }

  const streetViewUrl = buildStreetViewUrl(
    provider.lat,
    provider.lng,
    width,
    height
  );

  if (!streetViewUrl) {
    return placeholderResponse();
  }

  try {
    const imageResponse = await fetch(streetViewUrl);
    const contentType =
      imageResponse.headers.get("content-type") ?? "image/jpeg";
    const imageBuffer = new Uint8Array(await imageResponse.arrayBuffer());
    const isJpeg = imageBuffer[0] === 0xff && imageBuffer[1] === 0xd8;
    const isImage = contentType.includes("image") || isJpeg;

    if (!isImage) {
      return placeholderResponse();
    }

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return placeholderResponse();
  }
}
