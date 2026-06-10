// AI-samenvatting: vertaalt het deterministische rapport naar een leesbaar oordeel
// met de belangrijkste risico's. Raakt de cijfers niet aan — alleen duiding.

import { generateText, Output } from "ai";
import { z } from "zod";
import type { DealReport } from "../analyse";
import { AI_MODEL, aiBeschikbaar } from "./client";

const samenvattingSchema = z.object({
  samenvatting: z
    .string()
    .describe("Kernoordeel over de deal in 2-4 zinnen, direct en concreet, helder Nederlands"),
  risicos: z
    .array(z.string())
    .min(1)
    .max(4)
    .describe("Belangrijkste risico's van deze specifieke deal, elk in één zin"),
});

export type AiSamenvatting = z.infer<typeof samenvattingSchema>;

const SYSTEM = `Je bent een nuchtere Nederlandse vastgoed-analist die beleggers en flippers helpt een aankoopbeslissing te toetsen.
Je krijgt een doorgerekend deal-rapport (deterministische cijfers volgens NL-regels 2026: overdrachtsbelasting, box 3, kosten koper).
Vat het oordeel samen en benoem de grootste risico's van déze deal. Verwijs naar concrete cijfers uit het rapport.
Reken niets opnieuw uit en spreek de cijfers niet tegen. Geen financieel advies — duiding van de berekening.`;

export async function maakSamenvatting(report: DealReport): Promise<AiSamenvatting | null> {
  if (!aiBeschikbaar()) return null;

  // Alleen het deterministische deel meesturen (ai-veld weglaten;
  // undefined-waarden verdwijnen bij JSON.stringify).
  const kern = { ...report, ai: undefined };

  try {
    const { output } = await generateText({
      model: AI_MODEL,
      output: Output.object({ schema: samenvattingSchema }),
      system: SYSTEM,
      prompt: `Deal-rapport (JSON):\n${JSON.stringify(kern, null, 2)}`,
    });
    return output;
  } catch (e) {
    console.error("AI-samenvatting mislukt:", e);
    return null;
  }
}
