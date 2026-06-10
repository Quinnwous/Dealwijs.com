import { AANKOOPKOSTEN_DEFAULTS } from "./constants";
import { berekenOverdrachtsbelasting, type Gebruik } from "./overdrachtsbelasting";
import { round2 } from "./util";

export interface AankoopkostenInput {
  aankoopprijs: number;
  gebruik?: Gebruik;
  /** Wordt er met hypotheek gefinancierd? (voegt hypotheek-gerelateerde kosten toe). */
  metHypotheek?: boolean;
  /** Bouwkundige keuring meenemen? default true. */
  bouwkundigeKeuring?: boolean;
  /** Overschrijf default-kostenbedragen indien gewenst. */
  overrides?: Partial<typeof AANKOOPKOSTEN_DEFAULTS>;
}

export interface Kostenpost {
  naam: string;
  bedrag: number;
}

export interface AankoopkostenResultaat {
  posten: Kostenpost[];
  /** Kosten koper, exclusief de aankoopprijs zelf. */
  totaalKostenKoper: number;
  /** Aankoopprijs + kosten koper. */
  totaalInclAankoop: number;
}

export function berekenAankoopkosten(input: AankoopkostenInput): AankoopkostenResultaat {
  const {
    aankoopprijs,
    gebruik = "belegger",
    metHypotheek = false,
    bouwkundigeKeuring = true,
  } = input;
  const d = { ...AANKOOPKOSTEN_DEFAULTS, ...input.overrides };

  const posten: Kostenpost[] = [
    { naam: "Overdrachtsbelasting", bedrag: berekenOverdrachtsbelasting(aankoopprijs, gebruik) },
    { naam: "Notaris (leveringsakte)", bedrag: d.notarisLevering },
  ];

  if (metHypotheek) {
    posten.push({ naam: "Notaris (hypotheekakte)", bedrag: d.notarisHypotheek });
    posten.push({ naam: "Hypotheekadvies", bedrag: d.hypotheekadvies });
    posten.push({ naam: "Taxatie", bedrag: d.taxatie });
  }
  if (bouwkundigeKeuring) {
    posten.push({ naam: "Bouwkundige keuring", bedrag: d.bouwkundigeKeuring });
  }

  const totaalKostenKoper = round2(posten.reduce((s, p) => s + p.bedrag, 0));
  return {
    posten,
    totaalKostenKoper,
    totaalInclAankoop: round2(aankoopprijs + totaalKostenKoper),
  };
}
