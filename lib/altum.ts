// Server-side client voor Altum AI (woningdata). Houdt key server-side, throttelt en cachet.
// Endpoints + velden bevestigd in Fase 0 (zie docs/product/data-feasibility-altum.md).

import { AdresNietGevondenError } from "./fouten";

const BASE = "https://api.altum.ai";
const MIN_GAP_MS = 1500; // gratis tier rate limit → pauze tussen calls

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Eenvoudige in-memory cache + seriële call-chain (throttling).
const cache = new Map<string, unknown>();
let chain: Promise<unknown> = Promise.resolve();

function apiKey(): string {
  const k = process.env.ALTUM_API_KEY;
  if (!k) throw new Error("ALTUM_API_KEY ontbreekt (zet hem in .env.local)");
  return k;
}

async function post<T = Record<string, unknown>>(
  endpoint: "avm" | "woz",
  body: Record<string, unknown>,
): Promise<T> {
  const cacheKey = `${endpoint}:${JSON.stringify(body)}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey) as T;

  const run = chain.then(async () => {
    await sleep(MIN_GAP_MS);
    for (let attempt = 1; attempt <= 3; attempt++) {
      const res = await fetch(`${BASE}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey() },
        body: JSON.stringify(body),
      });
      if (res.status === 429 && attempt < 3) {
        await sleep(3000 * attempt);
        continue;
      }
      if (res.status === 404) throw new AdresNietGevondenError();
      if (!res.ok) throw new Error(`Altum ${endpoint} gaf status ${res.status}`);
      return (await res.json()) as T;
    }
    throw new Error(`Altum ${endpoint}: rate limited`);
  });
  chain = run.catch(() => undefined); // keten niet laten breken op fouten
  const json = await run;
  cache.set(cacheKey, json);
  return json;
}

export interface PropertyData {
  bagId?: string;
  adres: string;
  city?: string;
  marktwaarde: number;
  wozWaarde: number;
  energielabel?: string;
  m2?: number;
  type?: string;
  bouwjaar?: number;
  confidence?: string;
  raw: { avm: unknown; woz: unknown };
}

interface AvmOutput {
  BagID?: string;
  City?: string;
  Street?: string;
  HouseNumber?: number | string;
  PriceEstimation?: number;
  Confidence?: string;
  EnergyLabel?: string;
  InnerSurfaceArea?: number;
  HouseType?: string;
  BuildYear?: number;
}
interface WozEntry { Date: string; Value: string }

const jaar = (d: string) => Number(d.split("-").pop());

function laatsteWoz(arr?: WozEntry[]): number {
  if (!arr?.length) return 0;
  const sorted = [...arr].sort((a, b) => jaar(b.Date) - jaar(a.Date));
  return Number(sorted[0].Value) || 0;
}

/** Haalt AVM + WOZ op en normaliseert naar wat de analyse nodig heeft. */
export async function getPropertyData(
  postcode: string,
  housenumber: number,
  houseaddition?: string,
): Promise<PropertyData> {
  const body: Record<string, unknown> = {
    postcode: postcode.toUpperCase().replace(/\s+/g, ""),
    housenumber,
    ...(houseaddition ? { houseaddition } : {}),
  };
  const avm = await post<{ Output?: AvmOutput }>("avm", body);
  // WOZ-fout is geen showstopper (bv. nieuwbouw zonder beschikking): rapport
  // valt dan terug op de aankoopprijs als box 3-grondslag (zie analyse).
  const woz = await post<{ Output?: { wozvalue?: WozEntry[] } }>("woz", body).catch(
    () => ({ Output: undefined }),
  );
  const a = avm.Output ?? {};
  const w = woz.Output ?? {};
  // Sommige bronnen geven 200 met lege Output voor onbekende adressen; zonder
  // marktwaarde is geen enkel rapportonderdeel zinvol.
  if (!Number(a.PriceEstimation)) throw new AdresNietGevondenError();
  return {
    bagId: a.BagID,
    city: a.City,
    adres: `${a.Street ?? ""} ${a.HouseNumber ?? housenumber}`.trim(),
    marktwaarde: Number(a.PriceEstimation) || 0,
    wozWaarde: laatsteWoz(w.wozvalue),
    energielabel: a.EnergyLabel ?? undefined,
    m2: a.InnerSurfaceArea ?? undefined,
    type: a.HouseType ?? undefined,
    bouwjaar: a.BuildYear ?? undefined,
    confidence: a.Confidence ?? undefined,
    raw: { avm, woz },
  };
}
