import { describe, expect, it } from "vitest";
import { AdresNietGevondenError, gebruikersfout } from "./fouten";

describe("gebruikersfout", () => {
  it("adres niet gevonden → 404 met duidelijke melding", () => {
    const f = gebruikersfout(new AdresNietGevondenError());
    expect(f.status).toBe(404);
    expect(f.melding).toContain("niet gevonden");
    expect(f.melding).toContain("postcode");
  });

  it("databron-fout → 502 zonder interne details", () => {
    const f = gebruikersfout(new Error("Altum avm gaf status 500"));
    expect(f.status).toBe(502);
    expect(f.melding).not.toContain("Altum");
    expect(f.melding).not.toContain("500");
  });

  it("onbekende fout → 500 generiek, zonder details", () => {
    const f = gebruikersfout(new Error("ALTUM_API_KEY ontbreekt (zet hem in .env.local)"));
    expect(f.status).toBe(500);
    expect(f.melding).not.toContain("env.local");
    expect(f.melding.toLowerCase()).toContain("opnieuw");
  });
});
