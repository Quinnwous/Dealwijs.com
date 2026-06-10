import { describe, expect, it } from "vitest";
import { checkRateLimit, analysesPerDag, clientIp } from "./ratelimit";

describe("rate limit", () => {
  it("staat het ingestelde aantal analyses per dag toe en blokkeert daarna", () => {
    const ip = `test-${Math.random()}`;
    const limiet = analysesPerDag();
    for (let i = 0; i < limiet; i++) {
      expect(checkRateLimit(ip).toegestaan).toBe(true);
    }
    expect(checkRateLimit(ip).toegestaan).toBe(false);
  });

  it("reset na een dag", () => {
    const ip = `test-${Math.random()}`;
    const nu = Date.now();
    for (let i = 0; i < analysesPerDag() + 1; i++) checkRateLimit(ip, nu);
    expect(checkRateLimit(ip, nu).toegestaan).toBe(false);
    expect(checkRateLimit(ip, nu + 25 * 60 * 60 * 1000).toegestaan).toBe(true);
  });

  it("haalt het eerste IP uit x-forwarded-for", () => {
    const req = new Request("http://x", { headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" } });
    expect(clientIp(req)).toBe("1.2.3.4");
  });
});
