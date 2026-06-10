import { BOX3 } from "./constants";
import { round2 } from "./util";

export interface Box3Input {
  /** Waarde van het pand voor box 3 (woningen: WOZ-waarde). */
  wozWaarde: number;
  /** Eventuele schuld op het pand (hypotheek); 0 indien geen. */
  schuld?: number;
}

/**
 * Jaarlijkse box 3-belasting toe te rekenen aan dit pand (peildatum 2026).
 * Vereenvoudigd: heffingvrij vermogen geldt op portfolioniveau en blijft hier buiten beschouwing.
 */
export function berekenBox3Jaarlast({ wozWaarde, schuld = 0 }: Box3Input): number {
  const voordeelBezitting = wozWaarde * BOX3.forfaitBezittingen;
  const voordeelSchuld = schuld * BOX3.forfaitSchulden;
  const grondslag = Math.max(0, voordeelBezitting - voordeelSchuld);
  return round2(grondslag * BOX3.tarief);
}
