import { existsSync, readFileSync } from "fs";
import { join } from "path";
import {
  buildStreetViewMetadataUrl,
  buildStreetViewUrl,
  getGoogleMapsApiKey,
} from "../src/lib/streetview";

function loadEnvLocal() {
  const envPath = join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvLocal();

const SAMPLE_LAT = 32.5149;
const SAMPLE_LNG = -117.0382;

async function main() {
  const apiKey = getGoogleMapsApiKey();

  if (!apiKey) {
    console.error("Missing GOOGLE_MAPS_API_KEY in environment.");
    console.error("Add it to .env.local and restart the dev server.");
    process.exit(1);
  }

  console.log("Checking Google Street View setup...\n");

  const metadataUrl = buildStreetViewMetadataUrl(SAMPLE_LAT, SAMPLE_LNG);
  if (metadataUrl) {
    const metadataResponse = await fetch(metadataUrl);
    const metadata = (await metadataResponse.json()) as {
      status?: string;
      error_message?: string;
    };
    console.log(`Metadata API: ${metadata.status ?? "unknown"}`);
    if (metadata.error_message) {
      console.log(`  ${metadata.error_message}`);
    }
    if (metadata.status === "REQUEST_DENIED") {
      console.log(
        "  Optional: enable Street View Metadata API for no-coverage detection."
      );
    }
  }

  const staticUrl = buildStreetViewUrl(SAMPLE_LAT, SAMPLE_LNG, 600, 400);
  if (staticUrl) {
    const staticResponse = await fetch(staticUrl);
    const contentType = staticResponse.headers.get("content-type") ?? "unknown";
    const body = new Uint8Array(await staticResponse.arrayBuffer());
    const isJpeg = body[0] === 0xff && body[1] === 0xd8;
    const isImage = contentType.includes("image") || isJpeg;

    console.log(`\nStatic API: ${staticResponse.status} (${contentType})`);

    if (!isImage) {
      console.error("\nStreet View Static API is not working.");
      console.error("Enable 'Street View Static API' in Google Cloud Console:");
      console.error("https://console.cloud.google.com/apis/library/street-view-image-backend.googleapis.com");
      console.error(
        "\nUnder Credentials, set API restrictions to include Street View Static API."
      );
      console.error(
        "Use application restriction 'None' for local dev (server-side calls)."
      );
      process.exit(1);
    }
  }

  console.log("\nStreet View is ready. Clinic photos should load on the site.");
  console.log("Test: http://localhost:3002/api/streetview?slug=baja-dental-excellence");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
