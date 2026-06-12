import { afterEach, describe, expect, it, vi } from "vitest";
import { getPropertyData } from "./altum";
import { AdresNietGevondenError } from "./fouten";

// De Altum-client throttelt (1,5 s tussen calls), dus deze tests zijn bewust traag.
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("getPropertyData (gestubde Altum-API)", () => {
  it("avm-404 → AdresNietGevondenError", async () => {
    vi.stubEnv("ALTUM_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 404 })));
    await expect(getPropertyData("9999XX", 1)).rejects.toBeInstanceOf(AdresNietGevondenError);
  }, 10_000);

  it("woz-fout is geen showstopper: rapport zonder WOZ-waarde", async () => {
    vi.stubEnv("ALTUM_API_KEY", "test-key");
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: RequestInfo | URL) =>
        String(url).includes("/woz")
          ? new Response("{}", { status: 404 })
          : new Response(
              JSON.stringify({ Output: { Street: "Teststraat", HouseNumber: 1, PriceEstimation: 400_000 } }),
              { status: 200 },
            ),
      ),
    );
    const pd = await getPropertyData("8888XX", 1);
    expect(pd.marktwaarde).toBe(400_000);
    expect(pd.wozWaarde).toBe(0);
  }, 10_000);
});
