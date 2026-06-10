import { describe, expect, it } from "vitest";
import { berekenOverdrachtsbelasting } from "./overdrachtsbelasting";
import { berekenBox3Jaarlast } from "./box3";
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
    expect(r.nettoJaarcashflowVoorFinanciering).toBe(7_020);
    expect(r.brutoAanvangsrendement).toBeCloseTo(0.0553, 4);
    expect(r.nettoRendement).toBeCloseTo(0.0216, 4);
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
