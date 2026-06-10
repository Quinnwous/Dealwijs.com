import { OVERDRACHTSBELASTING } from "./constants";
import { round2 } from "./util";

export type Gebruik = "belegger" | "hoofdverblijf" | "starter" | "bedrijf";

/** Overdrachtsbelasting over de aankoopprijs op basis van het gebruik (2026). */
export function berekenOverdrachtsbelasting(
  aankoopprijs: number,
  gebruik: Gebruik = "belegger",
): number {
  return round2(aankoopprijs * OVERDRACHTSBELASTING[gebruik]);
}
