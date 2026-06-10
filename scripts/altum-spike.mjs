// Fase 0 — Altum AI data-feasibility spike.
// Doel: bewijzen dat de data bruikbaar + betaalbaar is vóór we de app bouwen.
// Draai met:  node --env-file=.env.local scripts/altum-spike.mjs [postcode huisnummer]...
// Bijv.:      node --env-file=.env.local scripts/altum-spike.mjs 1071AA 1 3011AD 60

const API_KEY = process.env.ALTUM_API_KEY;
const COST_PER_CALL_EUR = 0.47; // ex btw, pay-per-use
const BASE = "https://api.altum.ai";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const DELAY_MS = Number(process.env.SPIKE_DELAY_MS ?? 1600); // pauze tussen calls (rate limit gratis tier)

if (!API_KEY) {
  console.error("❌ ALTUM_API_KEY ontbreekt. Zet hem in .env.local en draai met --env-file=.env.local");
  process.exit(1);
}

// Adressen: uit CLI-args (paren van postcode huisnummer) of een paar defaults.
function parseArgs(argv) {
  const out = [];
  for (let i = 0; i < argv.length; i += 2) {
    if (argv[i] && argv[i + 1]) out.push({ postcode: argv[i], housenumber: Number(argv[i + 1]) });
  }
  return out;
}
const cliAddresses = parseArgs(process.argv.slice(2));
const addresses = cliAddresses.length
  ? cliAddresses
  : [
      { postcode: "1071AA", housenumber: 1 },
      { postcode: "3011AD", housenumber: 60 },
      { postcode: "2514JL", housenumber: 1 },
    ];

let creditsUsed = 0;

async function call(endpoint, body) {
  const postcode = String(body.postcode).toUpperCase().replace(/\s+/g, "");
  const payload = { ...body, postcode };
  const t0 = Date.now();
  let status = 0;
  let json = null;
  let error = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(`${BASE}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
        body: JSON.stringify(payload),
      });
      status = res.status;
      const text = await res.text();
      try { json = JSON.parse(text); } catch { json = text; }
      if (status === 200) { creditsUsed += 1; break; } // alleen geslaagde calls kosten een credit
      if (status === 429 && attempt < 3) { await sleep(4000 * attempt); continue; } // backoff op rate limit
      break;
    } catch (e) {
      error = String(e);
      break;
    }
  }
  return { endpoint, status, ms: Date.now() - t0, json, error };
}

const firstSuccess = {}; // endpoint -> volledige json voor velden-ontdekking

console.log(`\n🔎 Altum spike — ${addresses.length} adres(sen), endpoints: avm + woz\n`);

for (const addr of addresses) {
  const label = `${addr.postcode} ${addr.housenumber}`;
  for (const endpoint of ["avm", "woz"]) {
    const r = await call(endpoint, addr);
    const ok = r.status === 200;
    const topKeys = r.json && typeof r.json === "object" && r.json.Output
      ? Object.keys(r.json.Output).slice(0, 12).join(", ")
      : (typeof r.json === "string" ? r.json.slice(0, 120) : JSON.stringify(r.json).slice(0, 120));
    console.log(`${ok ? "✅" : "⚠️ "} ${endpoint.toUpperCase().padEnd(3)} ${label.padEnd(14)} status=${r.status} ${r.ms}ms ${r.error ?? ""}`);
    console.log(`    Output-keys: ${topKeys}`);
    if (ok && !firstSuccess[endpoint]) firstSuccess[endpoint] = r.json;
    await sleep(DELAY_MS);
  }
}

console.log(`\n=== DISCOVERY (volledige eerste geslaagde response per endpoint) ===`);
for (const endpoint of ["avm", "woz"]) {
  if (firstSuccess[endpoint]) {
    console.log(`\n--- ${endpoint.toUpperCase()} ---`);
    console.log(JSON.stringify(firstSuccess[endpoint], null, 2).slice(0, 1800));
  } else {
    console.log(`\n--- ${endpoint.toUpperCase()} --- (geen geslaagde response)`);
  }
}

console.log(`\n=== KOSTEN / UNIT-ECONOMICS ===`);
console.log(`Geslaagde calls (credits): ${creditsUsed}  ≈ €${(creditsUsed * COST_PER_CALL_EUR).toFixed(2)} ex btw`);
console.log(`Per analyse (avm + woz = 2 calls): ≈ €${(2 * COST_PER_CALL_EUR).toFixed(2)} ex btw`);
console.log(`Bij €29/mnd abonnement → break-even op datakosten rond ~${Math.floor(29 / (2 * COST_PER_CALL_EUR))} analyses/maand per gebruiker.\n`);
