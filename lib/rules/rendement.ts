import { berekenAankoopkosten } from "./kosten";
import { berekenBox3Jaarlast, leegwaarderatio } from "./box3";
import { type Gebruik } from "./overdrachtsbelasting";
import { round2, round4 } from "./util";

export interface VerhuurInput {
  aankoopprijs: number;
  maandhuur: number;
  /** WOZ-waarde voor box 3; default = aankoopprijs. */
  wozWaarde?: number;
  verbouwkosten?: number;
  gebruik?: Gebruik;
  metHypotheek?: boolean;
  /** Hypotheekschuld op het pand (voor box 3). */
  schuld?: number;
  /** Jaarlijkse exploitatiekosten als fractie van de jaarhuur (onderhoud, beheer, verzekering, leegstand). */
  exploitatiekostenFractie?: number;
}

export interface VerhuurResultaat {
  jaarhuur: number;
  totaleInvestering: number;
  /** Jaarhuur / totale investering. */
  brutoAanvangsrendement: number;
  box3Jaarlast: number;
  /** Toegepaste leegwaarderatio op de WOZ-waarde in box 3 (1 = geen korting). */
  leegwaarderatio: number;
  /** Jaarhuur − exploitatie − box 3 (vóór financieringslasten). */
  nettoJaarcashflowVoorFinanciering: number;
  /** Netto cashflow / totale investering. */
  nettoRendement: number;
}

export function berekenVerhuur(input: VerhuurInput): VerhuurResultaat {
  const {
    aankoopprijs,
    maandhuur,
    wozWaarde = aankoopprijs,
    verbouwkosten = 0,
    gebruik = "belegger",
    metHypotheek = false,
    schuld = 0,
    exploitatiekostenFractie = 0.25,
  } = input;

  const { totaalKostenKoper } = berekenAankoopkosten({ aankoopprijs, gebruik, metHypotheek });
  const jaarhuur = round2(maandhuur * 12);
  const totaleInvestering = round2(aankoopprijs + totaalKostenKoper + verbouwkosten);
  const brutoAanvangsrendement =
    totaleInvestering > 0 ? round4(jaarhuur / totaleInvestering) : 0;
  const box3Jaarlast = berekenBox3Jaarlast({ wozWaarde, schuld, jaarhuur });
  const exploitatie = round2(jaarhuur * exploitatiekostenFractie);
  const nettoJaarcashflowVoorFinanciering = round2(jaarhuur - exploitatie - box3Jaarlast);
  const nettoRendement =
    totaleInvestering > 0 ? round4(nettoJaarcashflowVoorFinanciering / totaleInvestering) : 0;

  return {
    jaarhuur,
    totaleInvestering,
    brutoAanvangsrendement,
    box3Jaarlast,
    leegwaarderatio: leegwaarderatio(jaarhuur, wozWaarde),
    nettoJaarcashflowVoorFinanciering,
    nettoRendement,
  };
}
