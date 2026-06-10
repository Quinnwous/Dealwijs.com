import { voorbeeldRapport } from "@/lib/voorbeeld";

// Vast voorbeeldrapport: geen rate limit nodig — kost geen credits.
export async function GET() {
  return Response.json(await voorbeeldRapport(), {
    headers: { "Cache-Control": "public, max-age=3600" },
  });
}
