// WWS-punten-INDICATIE (Wet betaalbare huur). Geen volledige puntentelling —
// die vereist meting per vertrek, keuken-/sanitairdetails enz. Deze schatting
// gebruikt de dominante rubrieken (oppervlakte, WOZ, energielabel) plus een
// opslag voor voorzieningen, en geeft een bandbreedte + grensgeval-vlag terug.
// Doel: vóór aankoop signaleren of verhuur waarschijnlijk gereguleerd is.

import { WWS_2026 } from "./constants";
import { round2 } from "./util";

export type WwsSegment = "sociaal" | "middenhuur" | "vrij";

export interface WwsInput {
  /** Woonoppervlakte (gebruiksoppervlakte) in m². */
  m2: number;
  wozWaarde: number;
  /** NTA 8800-energielabel, bv. "A", "B", "A++". */
  energielabel?: string;
  /** Altum HouseType, bv. "Appartement" of "Tussenwoning". */
  woningType?: string;
}

export interface WwsIndicatie {
  punten: number;
  bandbreedte: { min: number; max: number };
  segment: WwsSegment;
  /** True wanneer een segmentgrens binnen de bandbreedte valt — volledige telling nodig. */
  grensgeval: boolean;
  /** Indicatieve maximale maandhuur; alleen gevuld bij gereguleerd segment. */
  maxHuurIndicatie: number | null;
  /** True als de 33%-WOZ-cap de punten heeft afgetopt. */
  wozCapToegepast: boolean;
  aannames: string[];
}

/** Onzekerheidsmarge van de indicatie, in punten (m.n. voorzieningen-rubrieken). */
const MARGE = 15;

const MEERGEZINS_PATTERNS = [
  "appartement", "flat", "maisonnette", "bovenwoning", "benedenwoning",
  "portiek", "galerij", "studio", "penthouse", "etage",
];

export function isMeergezins(woningType?: string): boolean {
  if (!woningType) return true; // conservatief: meergezins scoort lager
  const t = woningType.toLowerCase();
  return MEERGEZINS_PATTERNS.some((p) => t.includes(p));
}

export function schatWwsPunten(input: WwsInput): WwsIndicatie {
  const { m2, wozWaarde, energielabel, woningType } = input;
  const aannames: string[] = [];
  const meergezins = isMeergezins(woningType);

  // Rubriek 1+2: vertrekken (1 pt/m²) + overige ruimten (0,75 pt/m²).
  // Gebruiksoppervlakte is niet uitgesplitst → gewogen mix van ~95%.
  const oppervlaktePunten = 0.95 * m2;
  aannames.push("Oppervlakte gewaardeerd als 0,95 punt per m² (mix vertrekken/overige ruimten)");

  // Rubriek 4: energieprestatie.
  const labelKey = (energielabel ?? "").toUpperCase().trim();
  const labelRij = WWS_2026.energielabelPunten[labelKey];
  const labelPunten = labelRij ? labelRij[meergezins ? 1 : 0] : 0;
  if (!labelRij) aannames.push("Energielabel onbekend → 0 punten gerekend voor energieprestatie");

  // Voorzieningen (verwarming, keuken, sanitair, buitenruimte): opslag op basis van grootte.
  const voorzieningenPunten = 18 + 0.1 * m2;
  aannames.push("Voorzieningen (verwarming/keuken/sanitair/buitenruimte) geschat op basis van grootte");

  // Rubriek 11: WOZ-waarde (onderdeel I + II).
  const wozPunten = wozWaarde / WWS_2026.wozPerPunt + wozWaarde / m2 / WWS_2026.wozPerM2PerPunt;

  const overigePunten = oppervlaktePunten + labelPunten + voorzieningenPunten;
  let totaal = Math.round(overigePunten + wozPunten);
  let wozCapToegepast = false;

  // WOZ-cap: max 33% van het totaal, alleen relevant als het totaal zonder cap ≥ 187 is.
  if (totaal > WWS_2026.maxPuntenMiddenhuur && wozPunten > WWS_2026.wozCapAandeel * totaal) {
    // totaal = overig + cap×totaal ⇒ totaal = overig / (1 − cap)
    const gecapt = Math.floor(overigePunten / (1 - WWS_2026.wozCapAandeel));
    wozCapToegepast = true;
    // Uitzondering: zakt de woning dóór de cap onder 187, dan minimaal 186 (blijft gereguleerd).
    totaal = Math.max(gecapt, WWS_2026.maxPuntenMiddenhuur);
    aannames.push("WOZ-cap (33%) toegepast");
  }

  const segment = bepaalSegment(totaal);
  const grensgeval =
    overschrijdtGrens(totaal, WWS_2026.maxPuntenSociaal) ||
    overschrijdtGrens(totaal, WWS_2026.maxPuntenMiddenhuur);

  return {
    punten: totaal,
    bandbreedte: { min: totaal - MARGE, max: totaal + MARGE },
    segment,
    grensgeval,
    maxHuurIndicatie: segment === "vrij" ? null : maxHuurBijPunten(totaal),
    wozCapToegepast,
    aannames,
  };
}

function bepaalSegment(punten: number): WwsSegment {
  if (punten <= WWS_2026.maxPuntenSociaal) return "sociaal";
  if (punten <= WWS_2026.maxPuntenMiddenhuur) return "middenhuur";
  return "vrij";
}

function overschrijdtGrens(punten: number, grens: number): boolean {
  return Math.abs(punten - grens) <= MARGE || Math.abs(punten - (grens + 1)) <= MARGE;
}

/** Indicatieve max. huur: lineair op de 186-puntengrens (~€6,60/punt in 2026). */
export function maxHuurBijPunten(punten: number): number {
  return round2((WWS_2026.maxHuurMiddenhuur / WWS_2026.maxPuntenMiddenhuur) * punten);
}
