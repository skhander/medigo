"use client";

import { useState } from "react";
import { getStreetViewProxyUrl } from "@/lib/streetview";

interface StreetViewImageProps {
  slug: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function StreetViewImage({
  slug,
  alt,
  className = "",
  width = 600,
  height = 400,
}: StreetViewImageProps) {
  const [failed, setFailed] = useState(false);
  const src = getStreetViewProxyUrl(slug, width, height);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-sage-50 text-sm text-ink-muted ${className}`}
        role="img"
        aria-label={alt}
      >
        Street view unavailable
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
