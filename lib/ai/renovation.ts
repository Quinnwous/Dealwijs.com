// AI-verbouwkosten-inschatting. De enige "fuzzy" input in de berekening:
// de gebruiker beschrijft de staat/plannen, Claude schat een realistische range.
// Alle overige sommen blijven deterministisch in lib/rules.

import { generateText, Output } from "ai";
import { z } from "zod";
import { AI_MODEL, aiBeschikbaar } from "./client";

export interface VerbouwContext {
  /** Vrije omschrijving van staat + verbouwplannen, door de gebruiker. */
  omschrijving: string;
  type?: string;
  bouwjaar?: number;
  m2?: number;
  energielabel?: string;
}

const schattingSchema = z.object({
  minimum: z.number().describe("Ondergrens totale verbouwkosten in euro's, incl. btw en arbeid"),
  maximum: z.number().describe("Bovengrens totale verbouwkosten in euro's, incl. btw en arbeid"),
  posten: z
    .array(
      z.object({
        post: z.string().describe("Naam van de kostenpost, bv. 'Badkamer renoveren'"),
        bedrag: z.number().describe("Middenschatting voor deze post in euro's"),
      }),
    )
    .describe("Uitsplitsing van de schatting in concrete kostenposten"),
  aannames: z
    .array(z.string())
    .max(5)
    .describe("Belangrijkste aannames achter de schatting (afwerkingsniveau, uitbesteed werk, e.d.)"),
});

export type VerbouwSchatting = z.infer<typeof schattingSchema>;

const SYSTEM = `Je bent een Nederlandse bouwkosten-expert die verbouwbudgetten raamt voor vastgoedbeleggers en flippers.
Prijspeil 2026, inclusief btw en arbeidsloon, uitgaande van uitbesteed werk tegen marktconforme aannemers-/zzp-tarieven in de Randstad.
Wees realistisch en eerder conservatief: verbouwingen vallen vaker duurder uit dan goedkoper. Neem 10-15% onvoorzien op in de range.
Schat alleen wat uit de omschrijving en woningkenmerken volgt; verzin geen werkzaamheden die de gebruiker niet noemt.`;

export async function schatVerbouwkosten(ctx: VerbouwContext): Promise<VerbouwSchatting | null> {
  if (!aiBeschikbaar() || !ctx.omschrijving.trim()) return null;

  const kenmerken = [
    ctx.type && `Type: ${ctx.type}`,
    ctx.bouwjaar && `Bouwjaar: ${ctx.bouwjaar}`,
    ctx.m2 && `Woonoppervlak: ${ctx.m2} m²`,
    ctx.energielabel && `Energielabel: ${ctx.energielabel}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const { output } = await generateText({
      model: AI_MODEL,
      output: Output.object({ schema: schattingSchema }),
      system: SYSTEM,
      prompt: `Woningkenmerken:\n${kenmerken || "(onbekend)"}\n\nOmschrijving van staat en verbouwplannen:\n${ctx.omschrijving}\n\nRaam de totale verbouwkosten.`,
    });
    return output;
  } catch (e) {
    console.error("AI-verbouwschatting mislukt:", e);
    return null;
  }
}

/** Middenwaarde van de range, afgerond op €500 — gebruikt als rekenwaarde. */
export function schattingRekenwaarde(s: VerbouwSchatting): number {
  return Math.round((s.minimum + s.maximum) / 2 / 500) * 500;
}
