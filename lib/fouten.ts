// Foutvertaling naar de eindgebruiker: interne details (statuscodes, env-namen,
// bronnamen) blijven server-side; de bezoeker krijgt een bruikbare melding.

/** Het opgegeven adres is onbekend bij de databron (Altum/Kadaster). */
export class AdresNietGevondenError extends Error {
  constructor() {
    super("Adres niet gevonden bij de databron");
    this.name = "AdresNietGevondenError";
  }
}

export interface Gebruikersfout {
  status: number;
  melding: string;
}

/** Vertaalt een interne fout naar een veilige, bruikbare API-fout. */
export function gebruikersfout(e: unknown): Gebruikersfout {
  if (e instanceof AdresNietGevondenError) {
    return {
      status: 404,
      melding:
        "Adres niet gevonden — controleer postcode en huisnummer (bv. 1234AB en 10, toevoeging apart).",
    };
  }
  if (e instanceof Error && e.message.startsWith("Altum")) {
    if (/429|rate limited/.test(e.message)) {
      return {
        status: 503,
        melding: "Het is even druk bij de databron. Probeer het over een minuut opnieuw.",
      };
    }
    return {
      status: 502,
      melding: "Woningdata ophalen lukte niet. Probeer het over een minuut opnieuw.",
    };
  }
  return {
    status: 500,
    melding: "Er ging iets mis bij de analyse. Probeer het opnieuw.",
  };
}
