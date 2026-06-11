import { describe, expect, it } from "vitest";
import { analyseDeal } from "./analyse";
import type { PropertyData } from "./altum";

const fakePD = async (): Promise<PropertyData> => ({
  bagId: "X",
  adres: "Teststraat 1",
  city: "Amsterdam",
  marktwaarde: 400_000,
  wozWaarde: 350_000,
  energielabel: "C",
  m2: 80,
  type: "Appartement",
  bouwjaar: 1990,
  raw: { avm: {}, woz: {} },
});

describe("analyseDeal (flip)", () => {
  it("levert een rapport met marge en oordeel op", async () => {
    const r = await analyseDeal(
      {
        postcode: "1000AA",
        housenumber: 1,
        doel: "flip",
        aankoopprijs: 300_000,
        verbouwkosten: 40_000,
        verwachteVerkoopwaarde: 420_000,
      },
      { getPropertyData: fakePD },
    );
    expect(r.waarde.marktwaarde).toBe(400_000);
    expect(r.flip).toBeDefined();
    // aankoopkosten 25.250 + verkoopkosten (420.000×1,25%+750=6.000) → investering 371.250 → marge 48.750
    expect(r.flip?.brutoMarge).toBe(48_750);
    expect(r.score.oordeel).toBe("GO");
  });
});

describe("analyseDeal (verhuur)", () => {
  it("gebruikt WOZ voor box 3 en geeft een oordeel", async () => {
    const r = await analyseDeal(
      { postcode: "1000AA", housenumber: 1, doel: "verhuur", aankoopprijs: 300_000, verbouwkosten: 0, maandhuur: 1_500 },
      { getPropertyData: fakePD },
    );
    expect(r.verhuur).toBeDefined();
    expect(r.waarde.wozWaarde).toBe(350_000);
    expect(["GO", "TWIJFEL", "NO-GO"]).toContain(r.score.oordeel);
  });

  it("begrenst het oordeel op de gereguleerde huur wanneer de beoogde huur te hoog is", async () => {
    // fakePD: 80 m², WOZ 350.000, label C, appartement → ±154 punten (middenhuur),
    // max huur ±€1.017 — beoogde huur €1.500 is dan niet toegestaan.
    const r = await analyseDeal(
      { postcode: "1000AA", housenumber: 1, doel: "verhuur", aankoopprijs: 300_000, verbouwkosten: 0, maandhuur: 1_500 },
      { getPropertyData: fakePD },
    );
    expect(r.wws).toBeDefined();
    expect(r.wws?.indicatie.segment).toBe("middenhuur");
    expect(r.wws?.gereguleerdScenario).toBeDefined();
    expect(r.wws!.gereguleerdScenario!.jaarhuur).toBeLessThan(r.verhuur!.jaarhuur);
    expect(r.score.kernsignaal).toContain("wettelijk begrensd");
  });

  it("metHypotheek zonder schuldbedrag: 80% LTV-aanname en default-rente in het rapport", async () => {
    const r = await analyseDeal(
      { postcode: "1000AA", housenumber: 1, doel: "verhuur", aankoopprijs: 300_000, verbouwkosten: 0, maandhuur: 1_500, metHypotheek: true },
      { getPropertyData: fakePD },
    );
    expect(r.verhuur!.schuld).toBe(240_000); // aanname: 80% van de aankoopprijs
    expect(r.verhuur!.renteJaarlast).toBe(13_200); // default verhuurhypotheekrente 5,5%
    // WOZ 350.000 → box3 (21.000 − 6.480)×36% = 5.227,20; vóór fin. 8.272,80 → ná rente −4.927,20
    expect(r.verhuur!.nettoJaarcashflowNaFinanciering).toBe(-4_927.2);
  });
});

describe("analyseDeal (AI-laag)", () => {
  it("blijft deterministisch zonder AI: ai-velden null/leeg, bron 'geen'", async () => {
    const r = await analyseDeal(
      { postcode: "1000AA", housenumber: 1, doel: "flip", aankoopprijs: 300_000, verwachteVerkoopwaarde: 420_000 },
      { getPropertyData: fakePD },
    );
    expect(r.verbouwkosten).toBe(0);
    expect(r.verbouwkostenBron).toBe("geen");
    expect(r.ai.verbouwSchatting).toBeNull();
    expect(r.ai.samenvatting).toBeNull();
    expect(r.ai.risicos).toEqual([]);
  });

  it("gebruikt de AI-schatting (midden van de range) als rekenwaarde zonder eigen opgave", async () => {
    const r = await analyseDeal(
      {
        postcode: "1000AA",
        housenumber: 1,
        doel: "flip",
        aankoopprijs: 300_000,
        verwachteVerkoopwaarde: 420_000,
        omschrijving: "Keuken en badkamer gedateerd, enkel glas.",
      },
      {
        getPropertyData: fakePD,
        schatVerbouwkosten: async () => ({
          minimum: 30_000,
          maximum: 50_250,
          posten: [{ post: "Keuken", bedrag: 15_000 }],
          aannames: ["Uitbesteed werk"],
        }),
        maakSamenvatting: async () => ({ samenvatting: "Prima deal.", risicos: ["Verbouwrisico"] }),
      },
    );
    // (30.000 + 50.250) / 2 = 40.125 → afgerond op €500 = 40.000
    expect(r.verbouwkosten).toBe(40_000);
    expect(r.verbouwkostenBron).toBe("ai");
    expect(r.ai.samenvatting).toBe("Prima deal.");
    expect(r.ai.risicos).toEqual(["Verbouwrisico"]);
  });

  it("laat eigen opgave winnen van de AI-schatting", async () => {
    const r = await analyseDeal(
      {
        postcode: "1000AA",
        housenumber: 1,
        doel: "flip",
        aankoopprijs: 300_000,
        verbouwkosten: 25_000,
        verwachteVerkoopwaarde: 420_000,
        omschrijving: "Alleen schilderwerk.",
      },
      {
        getPropertyData: fakePD,
        schatVerbouwkosten: async () => ({ minimum: 5_000, maximum: 10_000, posten: [], aannames: [] }),
        maakSamenvatting: async () => null,
      },
    );
    expect(r.verbouwkosten).toBe(25_000);
    expect(r.verbouwkostenBron).toBe("gebruiker");
    expect(r.ai.verbouwSchatting).not.toBeNull();
  });
});
