import { describe, expect, it } from "vitest";
import { resolveProviderCoords } from "./providers";

describe("resolveProviderCoords", () => {
  const mapUrl =
    "https://maps.google.com/maps?q=32.5149,-117.0382&z=15&output=embed";

  it("uses map_embed_url when database lat/lng are zero", () => {
    expect(resolveProviderCoords(0, 0, mapUrl)).toEqual({
      lat: 32.5149,
      lng: -117.0382,
    });
  });

  it("prefers non-zero database coordinates", () => {
    expect(resolveProviderCoords(21.1619, -86.8515, mapUrl)).toEqual({
      lat: 21.1619,
      lng: -86.8515,
    });
  });
});
