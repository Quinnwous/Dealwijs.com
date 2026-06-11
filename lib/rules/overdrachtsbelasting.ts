import { OVERDRACHTSBELASTING, STARTERSVRIJSTELLING_MAX_WONINGWAARDE } from "./constants";
import { round2 } from "./util";

export type Gebruik = "belegger" | "hoofdverblijf" | "starter" | "bedrijf";

/**
 * Overdrachtsbelasting over de aankoopprijs op basis van het gebruik (2026).
 * De startersvrijstelling kent een woningwaardegrens (aankoopprijs als proxy voor de
 * woningwaarde); daarboven geldt het hoofdverblijf-tarief.
 */
export function berekenOverdrachtsbelasting(
  aankoopprijs: number,
  gebruik: Gebruik = "belegger",
): number {
  const effectiefGebruik =
    gebruik === "starter" && aankoopprijs > STARTERSVRIJSTELLING_MAX_WONINGWAARDE
      ? "hoofdverblijf"
      : gebruik;
  return round2(aankoopprijs * OVERDRACHTSBELASTING[effectiefGebruik]);
}
