import { describe, expect, it } from "vitest";
import { berekenOverdrachtsbelasting } from "./overdrachtsbelasting";
import { berekenBox3Jaarlast, leegwaarderatio } from "./box3";
import { berekenAankoopkosten } from "./kosten";
import { berekenFlip } from "./flip";
import { berekenVerhuur } from "./rendement";
import { isMeergezins, maxHuurBijPunten, schatWwsPunten } from "./wws";

describe("overdrachtsbelasting 2026", () => {
  it("belegger = 8%", () => {
    expect(berekenOverdrachtsbelasting(400_000, "belegger")).toBe(32_000);
  });
  it("hoofdverblijf = 2%", () => {
    expect(berekenOverdrachtsbelasting(400_000, "hoofdverblijf")).toBe(8_000);
  });
  it("bedrijfspand = 10,4%", () => {
    expect(berekenOverdrachtsbelasting(400_000, "bedrijf")).toBe(41_600);
  });
  it("starter onder de woningwaardegrens = vrijgesteld", () => {
    expect(berekenOverdrachtsbelasting(400_000, "starter")).toBe(0);
  });
  it("starter precies op de grens (€555.000) = nog vrijgesteld", () => {
    expect(berekenOverdrachtsbelasting(555_000, "starter")).toBe(0);
  });
  it("starter boven de grens vervalt naar hoofdverblijf-tarief 2%", () => {
    expect(berekenOverdrachtsbelasting(600_000, "starter")).toBe(12_000);
  });
});

describe("leegwaarderatio 2026 (verhuurde woning, box 3)", () => {
  it("jaarhuur t/m 1% van WOZ → 73%", () => {
    expect(leegwaarderatio(9_000, 1_000_000)).toBe(0.73);
    expect(leegwaarderatio(10_000, 1_000_000)).toBe(0.73); // precies 1% valt nog in de laagste schijf
  });
  it("1–2% → 79%, 2–3% → 84%, 3–4% → 90%, 4–5% → 95%", () => {
    expect(leegwaarderatio(15_000, 1_000_000)).toBe(0.79);
    expect(leegwaarderatio(30_000, 1_000_000)).toBe(0.84);
    expect(leegwaarderatio(35_000, 1_000_000)).toBe(0.9);
    expect(leegwaarderatio(45_000, 1_000_000)).toBe(0.95);
  });
  it("boven 5% → geen korting (100%)", () => {
    expect(leegwaarderatio(60_000, 1_000_000)).toBe(1);
  });
  it("geen huur of geen WOZ → geen korting (100%)", () => {
    expect(leegwaarderatio(0, 300_000)).toBe(1);
    expect(leegwaarderatio(12_000, 0)).toBe(1);
  });
});

describe("box 3 2026", () => {
  it("zonder schuld: 6% × waarde × 36%", () => {
    // 300.000 × 6% = 18.000 → × 36% = 6.480
    expect(berekenBox3Jaarlast({ wozWaarde: 300_000 })).toBe(6_480);
  });
  it("met schuld: forfait bezitting − forfait schuld, × 36%", () => {
    // (300.000×6% − 200.000×2,7%) = 18.000 − 5.400 = 12.600 → × 36% = 4.536
    expect(berekenBox3Jaarlast({ wozWaarde: 300_000, schuld: 200_000 })).toBe(4_536);
  });
  it("verhuurde staat: leegwaarderatio verlaagt de grondslagwaarde", () => {
    // jaarhuur 3.300 / WOZ 300.000 = 1,1% → ratio 79%
    // 300.000 × 0,79 = 237.000 → × 6% = 14.220 → × 36% = 5.119,20
    expect(berekenBox3Jaarlast({ wozWaarde: 300_000, jaarhuur: 3_300 })).toBe(5_119.2);
  });
});

describe("aankoopkosten (belegger, cash)", () => {
  it("ovb + notaris + keuring", () => {
    // 300.000×8% = 24.000 + 800 + 450 = 25.250
    const r = berekenAankoopkosten({ aankoopprijs: 300_000 });
    expect(r.totaalKostenKoper).toBe(25_250);
    expect(r.totaalInclAankoop).toBe(325_250);
  });
});

describe("flip", () => {
  it("berekent marge en rendement", () => {
    const r = berekenFlip({
      aankoopprijs: 250_000,
      verbouwkosten: 50_000,
      verwachteVerkoopwaarde: 380_000,
    });
    // aankoopkosten: 20.000 + 800 + 450 = 21.250
    // verkoopkosten: 380.000×1,25% + 750 = 4.750 + 750 = 5.500
    // investering: 250.000 + 21.250 + 50.000 + 5.500 = 326.750
    // marge: 380.000 − 326.750 = 53.250
    expect(r.aankoopkostenKoper).toBe(21_250);
    expect(r.verkoopkosten).toBe(5_500);
    expect(r.totaleInvestering).toBe(326_750);
    expect(r.brutoMarge).toBe(53_250);
    expect(r.rendementOpInvestering).toBeCloseTo(0.163, 3);
  });
});

describe("verhuur", () => {
  it("berekent bruto-/nettorendement en box 3", () => {
    const r = berekenVerhuur({ aankoopprijs: 300_000, maandhuur: 1_500 });
    // aankoopkosten: 24.000 + 800 + 450 = 25.250 → investering 325.250
    // jaarhuur 18.000; bruto 18.000/325.250 ≈ 0,0553
    // box3 6.480; exploitatie 25% = 4.500; netto CF = 18.000 − 4.500 − 6.480 = 7.020
    expect(r.totaleInvestering).toBe(325_250);
    expect(r.jaarhuur).toBe(18_000);
    expect(r.box3Jaarlast).toBe(6_480);
    expect(r.leegwaarderatio).toBe(1); // 18.000/300.000 = 6% → geen korting
    expect(r.nettoJaarcashflowVoorFinanciering).toBe(7_020);
    expect(r.brutoAanvangsrendement).toBeCloseTo(0.0553, 4);
    expect(r.nettoRendement).toBeCloseTo(0.0216, 4);
  });

  it("lage huur t.o.v. WOZ: leegwaarderatio drukt de box 3-last", () => {
    // Gereguleerde-huur-casus: WOZ 1.321.000, huur €1.228/mnd → jaarhuur 14.736
    // verhouding 1,12% → ratio 79% → box 3 over 1.043.590 = 22.541,54
    const r = berekenVerhuur({
      aankoopprijs: 800_000,
      maandhuur: 1_228,
      wozWaarde: 1_321_000,
    });
    expect(r.leegwaarderatio).toBe(0.79);
    expect(r.box3Jaarlast).toBe(22_541.54);
  });

  it("met financiering: rente, cashflow ná rente en rendement op eigen geld", () => {
    // metHypotheek: kosten koper 29.350 (incl. notaris hyp., advies, taxatie) → investering 329.350
    // box3 met schuld: (300.000×6% − 240.000×2,7%) × 36% = 4.147,20
    // vóór financiering: 18.000 − 4.500 − 4.147,20 = 9.352,80
    // rente 4,5% × 240.000 = 10.800 → ná financiering −1.447,20
    // eigen inbreng: 329.350 − 240.000 = 89.350 → rendement eigen geld −1,62%
    const r = berekenVerhuur({
      aankoopprijs: 300_000,
      maandhuur: 1_500,
      metHypotheek: true,
      schuld: 240_000,
      hypotheekRenteFractie: 0.045,
    });
    expect(r.renteJaarlast).toBe(10_800);
    expect(r.nettoJaarcashflowVoorFinanciering).toBe(9_352.8);
    expect(r.nettoJaarcashflowNaFinanciering).toBe(-1_447.2);
    expect(r.eigenInbreng).toBe(89_350);
    expect(r.rendementOpEigenVermogen).toBeCloseTo(-0.0162, 4);
  });

  it("schuld zonder opgegeven rente: default verhuurhypotheekrente 5,5%", () => {
    const r = berekenVerhuur({
      aankoopprijs: 300_000,
      maandhuur: 1_500,
      metHypotheek: true,
      schuld: 240_000,
    });
    expect(r.renteJaarlast).toBe(13_200); // 240.000 × 5,5%
  });

  it("zonder schuld: geen rente, rendement eigen geld == nettorendement", () => {
    const r = berekenVerhuur({ aankoopprijs: 300_000, maandhuur: 1_500 });
    expect(r.renteJaarlast).toBe(0);
    expect(r.nettoJaarcashflowNaFinanciering).toBe(r.nettoJaarcashflowVoorFinanciering);
    expect(r.eigenInbreng).toBe(r.totaleInvestering);
    expect(r.rendementOpEigenVermogen).toBe(r.nettoRendement);
  });
});

describe("wws (Wet betaalbare huur, indicatie)", () => {
  it("herkent meergezins-types; onbekend type = conservatief meergezins", () => {
    expect(isMeergezins("Appartement")).toBe(true);
    expect(isMeergezins("Portiekflat")).toBe(true);
    expect(isMeergezins("Tussenwoning")).toBe(false);
    expect(isMeergezins(undefined)).toBe(true);
  });

  it("klein/goedkoop appartement met slecht label → gereguleerd segment", () => {
    // 50 m², WOZ 180.000, label F, meergezins:
    // oppervlakte 47,5 + label −9 + voorzieningen 23 + WOZ (10,62 + 13,43) ≈ 86 punten
    const r = schatWwsPunten({ m2: 50, wozWaarde: 180_000, energielabel: "F", woningType: "Appartement" });
    expect(r.segment).toBe("sociaal");
    expect(r.maxHuurIndicatie).not.toBeNull();
    expect(r.punten).toBeGreaterThan(70);
    expect(r.punten).toBeLessThan(110);
  });

  it("ruime woning met hoge WOZ en goed label → vrije sector", () => {
    const r = schatWwsPunten({ m2: 140, wozWaarde: 800_000, energielabel: "A", woningType: "Vrijstaande woning" });
    expect(r.segment).toBe("vrij");
    expect(r.maxHuurIndicatie).toBeNull();
  });

  it("WOZ-cap: extreem hoge WOZ wordt afgetopt op 33% van het totaal", () => {
    // Zonder cap zou de WOZ-rubriek domineren; met cap geldt totaal = overig / 0,67.
    const met = schatWwsPunten({ m2: 60, wozWaarde: 900_000, energielabel: "C", woningType: "Appartement" });
    expect(met.wozCapToegepast).toBe(true);
    // overig = 57 + 15 + 24 = 96 → 96/0,67 = 143,28 → floor 143 → minimaal 186 (uitzondering)
    expect(met.punten).toBe(186);
    expect(met.segment).toBe("middenhuur");
  });

  it("grensgeval-vlag bij punten dicht bij de liberalisatiegrens", () => {
    // Richting ~186 punten sturen: 110 m², WOZ 420.000, label C, meergezins
    const r = schatWwsPunten({ m2: 110, wozWaarde: 420_000, energielabel: "C", woningType: "Bovenwoning" });
    expect(Math.abs(r.punten - 186) < 30).toBe(true);
    expect(r.grensgeval).toBe(true);
  });

  it("maxHuurBijPunten is lineair op de liberalisatiegrens", () => {
    expect(maxHuurBijPunten(186)).toBeCloseTo(1228.07, 2);
    expect(maxHuurBijPunten(93)).toBeCloseTo(614.04, 1);
  });
});
