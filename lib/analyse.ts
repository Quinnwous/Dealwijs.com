import type { DealInput } from "./schema";
import { getPropertyData, type PropertyData } from "./altum";
import {
  schatVerbouwkosten,
  schattingRekenwaarde,
  maakSamenvatting,
  type VerbouwSchatting,
} from "./ai";
import {
  berekenAankoopkosten,
  berekenFlip,
  berekenVerhuur,
  schatWwsPunten,
  HYPOTHEEK_DEFAULTS,
  VERHUUR_DEFAULTS,
  VERKOOPKOSTEN_DEFAULTS,
  type AankoopkostenResultaat,
  type FlipResultaat,
  type VerhuurResultaat,
  type WwsIndicatie,
} from "./rules";

export type Oordeel = "GO" | "TWIJFEL" | "NO-GO";

export interface DealReport {
  object: {
    adres: string;
    type?: string;
    bouwjaar?: number;
    m2?: number;
    energielabel?: string;
    bagId?: string;
  };
  waarde: { marktwaarde: number; wozWaarde: number; confidence?: string };
  doel: "flip" | "verhuur";
  aankoopprijs: number;
  /** Verbouwkosten zoals gebruikt in de berekening. */
  verbouwkosten: number;
  /** Waar de rekenwaarde vandaan komt: eigen opgave, AI-schatting of geen verbouwing. */
  verbouwkostenBron: "gebruiker" | "ai" | "geen";
  aankoopkosten: AankoopkostenResultaat;
  flip?: FlipResultaat;
  verhuur?: VerhuurResultaat;
  /** Alleen bij verhuur: WWS-punten-indicatie (Wet betaalbare huur). */
  wws?: {
    indicatie: WwsIndicatie;
    /** Gevuld wanneer de beoogde huur boven de gereguleerde max ligt: cijfers op de toegestane huur. */
    gereguleerdScenario?: VerhuurResultaat;
  };
  score: { oordeel: Oordeel; kernsignaal: string };
  /** Aannames en defaults die in déze berekening zijn gebruikt (transparantie). */
  aannames: string[];
  /** AI-laag: null wanneer er geen AI-key is — het rapport blijft dan volledig deterministisch. */
  ai: {
    verbouwSchatting: VerbouwSchatting | null;
    samenvatting: string | null;
    risicos: string[];
  };
}

export interface AnalyseDeps {
  getPropertyData: typeof getPropertyData;
  schatVerbouwkosten: typeof schatVerbouwkosten;
  maakSamenvatting: typeof maakSamenvatting;
}

const defaultDeps: AnalyseDeps = { getPropertyData, schatVerbouwkosten, maakSamenvatting };

export async function analyseDeal(
  input: DealInput,
  deps: Partial<AnalyseDeps> = {},
): Promise<DealReport> {
  const d = { ...defaultDeps, ...deps };
  const pd = await d.getPropertyData(input.postcode, input.housenumber, input.houseaddition);
  const gebruik = "belegger" as const;
  const metHypotheek = input.metHypotheek ?? false;
  const wozWaarde = pd.wozWaarde || input.aankoopprijs;

  // AI-verbouwschatting (alleen met omschrijving + beschikbare AI; anders null).
  const verbouwSchatting = input.omschrijving
    ? await d.schatVerbouwkosten({
        omschrijving: input.omschrijving,
        type: pd.type,
        bouwjaar: pd.bouwjaar,
        m2: pd.m2,
        energielabel: pd.energielabel,
      })
    : null;

  // Rekenwaarde: eigen opgave wint; anders AI-midden; anders 0.
  const verbouwkosten =
    input.verbouwkosten ?? (verbouwSchatting ? schattingRekenwaarde(verbouwSchatting) : 0);
  const verbouwkostenBron: DealReport["verbouwkostenBron"] =
    input.verbouwkosten != null ? "gebruiker" : verbouwSchatting ? "ai" : "geen";

  const aankoopkosten = berekenAankoopkosten({ aankoopprijs: input.aankoopprijs, gebruik, metHypotheek });

  let flip: FlipResultaat | undefined;
  let verhuur: VerhuurResultaat | undefined;
  let wws: DealReport["wws"];
  let oordeel: Oordeel;
  let kernsignaal: string;
  const aannames: string[] = [];

  // Financiering geldt voor beide doelen: opgegeven schuld wint; met hypotheek
  // zonder bedrag → LTV-aanname op de aankoopprijs.
  const schuld =
    input.schuld ?? (metHypotheek ? Math.round(input.aankoopprijs * HYPOTHEEK_DEFAULTS.ltv) : 0);
  if (metHypotheek && input.schuld == null) {
    aannames.push(
      `Hypotheekschuld aangenomen op ${pctKort(HYPOTHEEK_DEFAULTS.ltv)} van de aankoopprijs: €${fmt(schuld)}`,
    );
  }
  if (schuld > 0 && input.hypotheekRente == null) {
    aannames.push(
      `Hypotheekrente aangenomen op ${pctKort(HYPOTHEEK_DEFAULTS.renteFractie)} per jaar (aflossingsvrij gerekend)`,
    );
  }

  if (input.doel === "flip") {
    const arv = input.verwachteVerkoopwaarde ?? pd.marktwaarde;
    if (input.verwachteVerkoopwaarde == null) {
      aannames.push(`Verkoopwaarde ná verbouwing gelijkgesteld aan de AVM-marktwaarde: €${fmt(arv)}`);
    }
    const renteFractie =
      input.hypotheekRente != null ? input.hypotheekRente / 100 : HYPOTHEEK_DEFAULTS.renteFractie;
    const financieringskosten = schuld
      ? Math.round(schuld * renteFractie * (HYPOTHEEK_DEFAULTS.flipProjectduurMaanden / 12))
      : 0;
    if (financieringskosten > 0) {
      aannames.push(
        `Rentekosten gerekend over een aangenomen projectduur van ${HYPOTHEEK_DEFAULTS.flipProjectduurMaanden} maanden`,
      );
    }
    aannames.push(
      `Verkoopkosten: ${pctKort(VERKOOPKOSTEN_DEFAULTS.makelaarcourtageFractie)} makelaarscourtage + €${fmt(VERKOOPKOSTEN_DEFAULTS.overig)} overig`,
    );
    flip = berekenFlip({
      aankoopprijs: input.aankoopprijs,
      verbouwkosten,
      verwachteVerkoopwaarde: arv,
      gebruik,
      metHypotheek,
      financieringskosten,
    });
    ({ oordeel, kernsignaal } = scoreFlip(flip.brutoMarge, flip.rendementOpInvestering));
  } else {
    const maandhuur = input.maandhuur ?? schatHuur(pd);
    if (input.maandhuur == null) {
      aannames.push(`Maandhuur geschat op ~0,4% van de marktwaarde: €${fmt(maandhuur)} per maand`);
    }
    if (!pd.wozWaarde) {
      aannames.push("WOZ-waarde onbekend bij de bron — aankoopprijs gebruikt als grondslag voor box 3");
    }
    aannames.push(
      `Exploitatiekosten gerekend als ${pctKort(VERHUUR_DEFAULTS.exploitatiekostenFractie)} van de jaarhuur (onderhoud, beheer, verzekering, leegstand)`,
    );
    const verhuurInput = {
      aankoopprijs: input.aankoopprijs,
      maandhuur,
      wozWaarde,
      verbouwkosten,
      gebruik,
      metHypotheek,
      schuld,
      hypotheekRenteFractie: input.hypotheekRente != null ? input.hypotheekRente / 100 : undefined,
    };
    verhuur = berekenVerhuur(verhuurInput);
    if (verhuur.leegwaarderatio < 1) {
      aannames.push(
        `Box 3: leegwaarderatio ${pctKort(verhuur.leegwaarderatio)} toegepast — verhuurde staat met huurbescherming aangenomen (regeling vervalt per 2027)`,
      );
    }
    aannames.push("Box 3 gerekend zonder heffingvrij vermogen (geldt op portfolioniveau)");

    if (pd.m2) {
      const indicatie = schatWwsPunten({
        m2: pd.m2,
        wozWaarde,
        energielabel: pd.energielabel,
        woningType: pd.type,
      });
      const huurBovenMax =
        indicatie.maxHuurIndicatie != null && maandhuur > indicatie.maxHuurIndicatie;
      wws = {
        indicatie,
        gereguleerdScenario: huurBovenMax
          ? berekenVerhuur({ ...verhuurInput, maandhuur: indicatie.maxHuurIndicatie! })
          : undefined,
      };
    }

    // Oordeel op het gereguleerde scenario wanneer de beoogde huur niet is toegestaan.
    if (wws?.gereguleerdScenario) {
      ({ oordeel, kernsignaal } = scoreVerhuur(wws.gereguleerdScenario.nettoRendement));
      kernsignaal = `Huur wettelijk begrensd op ±€${fmt(wws.indicatie.maxHuurIndicatie!)} (${wws.indicatie.segment}) — ${kernsignaal}`;
    } else {
      ({ oordeel, kernsignaal } = scoreVerhuur(verhuur.nettoRendement));
    }
  }

  const report: DealReport = {
    object: {
      adres: pd.adres,
      type: pd.type,
      bouwjaar: pd.bouwjaar,
      m2: pd.m2,
      energielabel: pd.energielabel,
      bagId: pd.bagId,
    },
    waarde: { marktwaarde: pd.marktwaarde, wozWaarde, confidence: pd.confidence },
    doel: input.doel,
    aankoopprijs: input.aankoopprijs,
    verbouwkosten,
    verbouwkostenBron,
    aankoopkosten,
    flip,
    verhuur,
    wws,
    score: { oordeel, kernsignaal },
    aannames,
    ai: { verbouwSchatting, samenvatting: null, risicos: [] },
  };

  const samenvatting = await d.maakSamenvatting(report);
  if (samenvatting) {
    report.ai.samenvatting = samenvatting.samenvatting;
    report.ai.risicos = samenvatting.risicos;
  }

  return report;
}

function scoreFlip(marge: number, rendement: number): { oordeel: Oordeel; kernsignaal: string } {
  if (marge >= 30_000 && rendement >= 0.12) return { oordeel: "GO", kernsignaal: `Marge €${fmt(marge)} (${pct(rendement)} ROI)` };
  if (marge <= 0 || rendement < 0.05) return { oordeel: "NO-GO", kernsignaal: `Te dunne marge: €${fmt(marge)} (${pct(rendement)} ROI)` };
  return { oordeel: "TWIJFEL", kernsignaal: `Marge €${fmt(marge)} (${pct(rendement)} ROI)` };
}

function scoreVerhuur(netto: number): { oordeel: Oordeel; kernsignaal: string } {
  if (netto >= 0.04) return { oordeel: "GO", kernsignaal: `Nettorendement ${pct(netto)}` };
  if (netto < 0.02) return { oordeel: "NO-GO", kernsignaal: `Laag nettorendement ${pct(netto)}` };
  return { oordeel: "TWIJFEL", kernsignaal: `Nettorendement ${pct(netto)}` };
}

/** Grove fallback voor maandhuur als de gebruiker er geen opgeeft (~0,4% van de marktwaarde). */
function schatHuur(pd: PropertyData): number {
  return Math.round((pd.marktwaarde * 0.004) / 50) * 50;
}

const fmt = (n: number) => Math.round(n).toLocaleString("nl-NL");
const pct = (f: number) => `${(f * 100).toFixed(1)}%`;
/** Compact NL-percentage voor aanname-teksten: 0,055 → "5,5%", 0,8 → "80%". */
const pctKort = (f: number) =>
  `${(f * 100).toLocaleString("nl-NL", { maximumFractionDigits: 1 })}%`;
