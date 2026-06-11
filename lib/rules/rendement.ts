import { berekenAankoopkosten } from "./kosten";
import { berekenBox3Jaarlast, leegwaarderatio } from "./box3";
import { HYPOTHEEK_DEFAULTS } from "./constants";
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
  /** Hypotheekschuld op het pand (voor box 3 én rentelast). */
  schuld?: number;
  /** Jaarrente over de schuld, aflossingsvrij gerekend; default verhuurhypotheek-aanname. */
  hypotheekRenteFractie?: number;
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
  /** Schuld waarmee gerekend is (0 = geen financiering). */
  schuld: number;
  /** Jaarlijkse rentelast over de schuld (aflossingsvrij gerekend). */
  renteJaarlast: number;
  /** Cashflow ná rentelasten. */
  nettoJaarcashflowNaFinanciering: number;
  /** Eigen geld in de deal: totale investering − schuld. */
  eigenInbreng: number;
  /** Cash-on-cash: cashflow ná financiering / eigen inbreng. */
  rendementOpEigenVermogen: number;
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
    hypotheekRenteFractie = HYPOTHEEK_DEFAULTS.renteFractie,
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

  const renteJaarlast = round2(schuld * hypotheekRenteFractie);
  const nettoJaarcashflowNaFinanciering = round2(nettoJaarcashflowVoorFinanciering - renteJaarlast);
  const eigenInbreng = round2(Math.max(0, totaleInvestering - schuld));
  const rendementOpEigenVermogen =
    eigenInbreng > 0 ? round4(nettoJaarcashflowNaFinanciering / eigenInbreng) : 0;

  return {
    jaarhuur,
    totaleInvestering,
    brutoAanvangsrendement,
    box3Jaarlast,
    leegwaarderatio: leegwaarderatio(jaarhuur, wozWaarde),
    nettoJaarcashflowVoorFinanciering,
    nettoRendement,
    schuld,
    renteJaarlast,
    nettoJaarcashflowNaFinanciering,
    eigenInbreng,
    rendementOpEigenVermogen,
  };
}
