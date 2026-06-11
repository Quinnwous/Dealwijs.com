// Nederlandse fiscale & kosten-parameters — peildatum 2026.
// Bron: Belastingdienst / Rijksoverheid 2026. Pas aan bij wetswijziging.

/** Overdrachtsbelasting-tarieven 2026 (per 1-1-2026 verlaagd van 10,4% naar 8% voor beleggers). */
export const OVERDRACHTSBELASTING = {
  /** Beleggingspand / 2e woning / verhuur. */
  belegger: 0.08,
  /** Eigen hoofdverblijf. */
  hoofdverblijf: 0.02,
  /** Starters onder voorwaarden (zie ook de woningwaardegrens hieronder). */
  starter: 0,
  /** Bedrijfspand / niet-woning. */
  bedrijf: 0.104,
} as const;

/**
 * Startersvrijstelling geldt t/m deze woningwaarde (per 1-1-2026; wordt €615.000 per 2027).
 * Daarboven betaalt de starter het hoofdverblijf-tarief.
 */
export const STARTERSVRIJSTELLING_MAX_WONINGWAARDE = 555_000;

/**
 * Leegwaarderatio (box 3, verhuurde woning met huurbescherming) — tabel 2023 t/m 2026.
 * Schijven op jaarhuur als percentage van de WOZ-waarde; bovengrens is inclusief.
 * Geldt niet bij tijdelijke verhuur of niet-marktconforme verhuur aan gelieerde partij (dan 100%).
 * Let op: per 1-1-2027 wordt de leegwaarderatio afgeschaft.
 */
export const LEEGWAARDERATIO_2026 = [
  { totEnMetFractie: 0.01, ratio: 0.73 },
  { totEnMetFractie: 0.02, ratio: 0.79 },
  { totEnMetFractie: 0.03, ratio: 0.84 },
  { totEnMetFractie: 0.04, ratio: 0.9 },
  { totEnMetFractie: 0.05, ratio: 0.95 },
] as const;

/** Box 3 — peildatum 2026. */
export const BOX3 = {
  /** Forfaitair rendement overige bezittingen (incl. vastgoed). */
  forfaitBezittingen: 0.06,
  /** Forfaitair rendement schulden. */
  forfaitSchulden: 0.027,
  /** Belastingtarief box 3. */
  tarief: 0.36,
  /** Heffingvrij vermogen per persoon (portfolio-niveau; per-deal buiten beschouwing). */
  heffingvrijPerPersoon: 59357,
} as const;

/** Standaard aankoopkosten-aannames (€) — grove NL-richtbedragen 2026. */
export const AANKOOPKOSTEN_DEFAULTS = {
  notarisLevering: 800,
  notarisHypotheek: 800,
  hypotheekadvies: 2500,
  taxatie: 800,
  bouwkundigeKeuring: 450,
} as const;

/**
 * Woningwaarderingsstelsel (WWS) / Wet betaalbare huur — kengetallen per 1-1-2026.
 * Bron: Huurcommissie beleidsboek waarderingsstelsel zelfstandige woonruimte +
 * wettelijke wijzigingen per 1 januari 2026 (huurcommissie.nl, volkshuisvestingnederland.nl).
 */
export const WWS_2026 = {
  /** T/m dit puntenaantal: sociale sector (gereguleerd, laag segment). */
  maxPuntenSociaal: 143,
  /** T/m dit puntenaantal: middenhuur (gereguleerd). Vanaf 187: vrije sector. */
  maxPuntenMiddenhuur: 186,
  /** Maximale (aanvangs)huur op de grens van het lage segment, per maand. */
  maxHuurSociaal: 932.93,
  /** Maximale huur op 186 punten = liberalisatiegrens, per maand. */
  maxHuurMiddenhuur: 1228.07,
  /** Rubriek 11 onderdeel I: 1 punt per dit bedrag aan WOZ-waarde (peildatum 1-1-2025). */
  wozPerPunt: 16_954,
  /** Rubriek 11 onderdeel II: 1 punt per dit bedrag WOZ-waarde per m². */
  wozPerM2PerPunt: 268,
  /** WOZ-punten tellen voor maximaal dit aandeel van het totaal mee (de "WOZ-cap"). */
  wozCapAandeel: 0.33,
  /** Energielabel-punten (NTA 8800-label vanaf 2021): [eengezins, meergezins]. */
  energielabelPunten: {
    "A++++": [62, 58],
    "A+++": [57, 53],
    "A++": [52, 48],
    "A+": [47, 43],
    A: [41, 37],
    B: [34, 30],
    C: [22, 15],
    D: [14, 11],
    E: [-4, -4],
    F: [-9, -9],
    G: [-15, -15],
  } as Record<string, [number, number]>,
} as const;

/** Standaard verkoopkosten-aannames (flip). */
export const VERKOOPKOSTEN_DEFAULTS = {
  /** Makelaarscourtage bij verkoop, als fractie van de verkoopprijs. */
  makelaarcourtageFractie: 0.0125,
  /** Overige verkoopkosten (styling, energielabel, etc.). */
  overig: 750,
} as const;
