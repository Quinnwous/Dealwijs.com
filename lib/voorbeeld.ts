// Voorbeeldrapport voor de "bekijk een voorbeeld"-knop. De woningdata is een
// bevroren Altum-snapshot (live AVM/WOZ-call 2026-06-10) zodat nieuwsgierige
// bezoekers géén Altum-credits kosten; de reken-engine rekent wél live mee met
// de actuele regels. De casus is bewust de kanteling die de moat laat zien:
// oogt als prima verhuurdeal → WWS-huurgrens → NO-GO.
import { analyseDeal, type DealReport } from "./analyse";
import type { PropertyData } from "./altum";
import type { DealInput } from "./schema";

export const VOORBEELD_DATA: PropertyData = {
  bagId: "0363010000857109",
  adres: "Vondelpark 1",
  city: "Amsterdam",
  marktwaarde: 878_907,
  wozWaarde: 1_321_000,
  energielabel: "G",
  m2: 86,
  type: "Vrijstaande woning",
  bouwjaar: 1883,
  confidence: "90% Confidence Interval is 791016-966797.",
  raw: { avm: "bevroren snapshot 2026-06-10", woz: "bevroren snapshot 2026-06-10" },
};

export const VOORBEELD_INPUT: DealInput = {
  postcode: "1071AA",
  housenumber: 1,
  doel: "verhuur",
  aankoopprijs: 800_000,
  maandhuur: 3_000,
};

let cache: Promise<DealReport> | null = null;

/** Deterministisch: geen Altum- of AI-calls, dus gratis en altijd beschikbaar. */
export function voorbeeldRapport(): Promise<DealReport> {
  cache ??= analyseDeal(VOORBEELD_INPUT, {
    getPropertyData: async () => VOORBEELD_DATA,
    maakSamenvatting: async () => null,
  });
  return cache;
}
