import { describe, expect, it } from "vitest";
import { voorbeeldRapport } from "./voorbeeld";

describe("voorbeeldRapport", () => {
  it("rekent de vaste casus deterministisch door, zonder API's", async () => {
    const r = await voorbeeldRapport();
    expect(r.object.adres).toContain("Vondelpark");
    expect(r.doel).toBe("verhuur");
    expect(r.ai.samenvatting).toBeNull();
    // De kanteling die het voorbeeld moet laten zien: beoogde huur boven de
    // gereguleerde max → gereguleerd scenario → NO-GO.
    expect(r.wws?.gereguleerdScenario).toBeTruthy();
    expect(r.score.oordeel).toBe("NO-GO");
  });
});
