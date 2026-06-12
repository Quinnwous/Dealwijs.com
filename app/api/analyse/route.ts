import { NextResponse } from "next/server";
import { dealInputSchema } from "@/lib/schema";
import { analyseDeal } from "@/lib/analyse";
import { gebruikersfout } from "@/lib/fouten";
import { checkRateLimit, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";
// Altum-throttling + twee AI-calls (verbouwschatting + samenvatting) passen ruim binnen 60s.
export const maxDuration = 60;

export async function POST(req: Request) {
  const limiet = checkRateLimit(clientIp(req));
  if (!limiet.toegestaan) {
    return NextResponse.json(
      { error: "Je hebt je gratis analyses voor vandaag gebruikt. Probeer het morgen opnieuw." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige JSON" }, { status: 400 });
  }

  const parsed = dealInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Ongeldige invoer", details: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const report = await analyseDeal(parsed.data);
    return NextResponse.json(report);
  } catch (e) {
    console.error("Analyse mislukt:", e); // interne details alleen server-side
    const fout = gebruikersfout(e);
    return NextResponse.json({ error: fout.melding }, { status: fout.status });
  }
}
