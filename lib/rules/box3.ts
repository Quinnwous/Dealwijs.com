import { BOX3, LEEGWAARDERATIO_2026 } from "./constants";
import { round2 } from "./util";

export interface Box3Input {
  /** Waarde van het pand voor box 3 (woningen: WOZ-waarde). */
  wozWaarde: number;
  /** Eventuele schuld op het pand (hypotheek); 0 indien geen. */
  schuld?: number;
  /**
   * Kale jaarhuur wanneer het pand (straks) verhuurd is met huurbescherming →
   * de leegwaarderatio verlaagt dan de grondslagwaarde. Weglaten bij leegstand/flip.
   */
  jaarhuur?: number;
}

/**
 * Leegwaarderatio 2026: factor waarmee de WOZ-waarde van een verhuurde woning
 * (reguliere verhuur met huurbescherming) in box 3 wordt vermenigvuldigd.
 * Zonder huur of WOZ-waarde is de ratio niet van toepassing (100%).
 */
export function leegwaarderatio(jaarhuur: number, wozWaarde: number): number {
  if (jaarhuur <= 0 || wozWaarde <= 0) return 1;
  const fractie = jaarhuur / wozWaarde;
  for (const schijf of LEEGWAARDERATIO_2026) {
    if (fractie <= schijf.totEnMetFractie) return schijf.ratio;
  }
  return 1;
}

/**
 * Jaarlijkse box 3-belasting toe te rekenen aan dit pand (peildatum 2026).
 * Vereenvoudigd: heffingvrij vermogen geldt op portfolioniveau en blijft hier buiten beschouwing.
 */
export function berekenBox3Jaarlast({ wozWaarde, schuld = 0, jaarhuur }: Box3Input): number {
  const grondslagwaarde = wozWaarde * (jaarhuur ? leegwaarderatio(jaarhuur, wozWaarde) : 1);
  const voordeelBezitting = grondslagwaarde * BOX3.forfaitBezittingen;
  const voordeelSchuld = schuld * BOX3.forfaitSchulden;
  const grondslag = Math.max(0, voordeelBezitting - voordeelSchuld);
  return round2(grondslag * BOX3.tarief);
}
