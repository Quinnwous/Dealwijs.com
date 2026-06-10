import { berekenAankoopkosten } from "./kosten";
import { VERKOOPKOSTEN_DEFAULTS } from "./constants";
import { type Gebruik } from "./overdrachtsbelasting";
import { round2, round4 } from "./util";

export interface FlipInput {
  aankoopprijs: number;
  verbouwkosten: number;
  /** Verwachte verkoopwaarde ná verbouwing (ARV). */
  verwachteVerkoopwaarde: number;
  gebruik?: Gebruik;
  metHypotheek?: boolean;
  /** Financierings-/rentekosten tijdens het project (€), optioneel. */
  financieringskosten?: number;
  /** Makelaarscourtage bij verkoop, als fractie. */
  makelaarcourtageFractie?: number;
}

export interface FlipResultaat {
  aankoopkostenKoper: number;
  verkoopkosten: number;
  /** Aankoop + kosten koper + verbouwing + verkoopkosten + financiering. */
  totaleInvestering: number;
  /** ARV − totale investering. */
  brutoMarge: number;
  /** Marge / totale investering (fractie). */
  rendementOpInvestering: number;
}

export function berekenFlip(input: FlipInput): FlipResultaat {
  const {
    aankoopprijs,
    verbouwkosten,
    verwachteVerkoopwaarde,
    gebruik = "belegger",
    metHypotheek = false,
    financieringskosten = 0,
    makelaarcourtageFractie = VERKOOPKOSTEN_DEFAULTS.makelaarcourtageFractie,
  } = input;

  const { totaalKostenKoper } = berekenAankoopkosten({ aankoopprijs, gebruik, metHypotheek });
  const verkoopkosten = round2(
    verwachteVerkoopwaarde * makelaarcourtageFractie + VERKOOPKOSTEN_DEFAULTS.overig,
  );
  const totaleInvestering = round2(
    aankoopprijs + totaalKostenKoper + verbouwkosten + verkoopkosten + financieringskosten,
  );
  const brutoMarge = round2(verwachteVerkoopwaarde - totaleInvestering);
  const rendementOpInvestering =
    totaleInvestering > 0 ? round4(brutoMarge / totaleInvestering) : 0;

  return {
    aankoopkostenKoper: totaalKostenKoper,
    verkoopkosten,
    totaleInvestering,
    brutoMarge,
    rendementOpInvestering,
  };
}
