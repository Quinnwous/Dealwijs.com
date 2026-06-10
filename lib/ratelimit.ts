// Eenvoudige in-memory rate limit per IP per dag — kostenbescherming voor de
// Altum-credits (~€0,94/analyse). Reset bij herstart/deploy; goed genoeg voor
// de MVP op één instance. Later vervangen door Redis (Upstash) bij schaal.

interface Teller {
  count: number;
  resetAt: number;
}

const tellers = new Map<string, Teller>();

const DAG_MS = 24 * 60 * 60 * 1000;

export function analysesPerDag(): number {
  const n = Number(process.env.GRATIS_ANALYSES_PER_DAG);
  return Number.isFinite(n) && n > 0 ? n : 5;
}

export interface RateLimitResultaat {
  toegestaan: boolean;
  /** Resterende analyses vandaag (na deze aanvraag). */
  resterend: number;
}

export function checkRateLimit(ip: string, nu = Date.now()): RateLimitResultaat {
  const limiet = analysesPerDag();
  const t = tellers.get(ip);

  if (!t || nu >= t.resetAt) {
    tellers.set(ip, { count: 1, resetAt: nu + DAG_MS });
    return { toegestaan: true, resterend: limiet - 1 };
  }

  if (t.count >= limiet) return { toegestaan: false, resterend: 0 };

  t.count += 1;
  return { toegestaan: true, resterend: limiet - t.count };
}

/** Haal het client-IP uit de request-headers (Vercel zet x-forwarded-for). */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "onbekend";
}
