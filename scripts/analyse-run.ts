// Live end-to-end check: echt adres → Altum → reken-engine (incl. WWS) → DealReport.
// AI-velden blijven null zonder AI_GATEWAY_API_KEY — dat is de bedoelde fallback.
// Draai: node --env-file=.env.local --import tsx scripts/analyse-run.ts [flip|verhuur]
import { analyseDeal } from "../lib/analyse";

async function main() {
  const doel = process.argv[2] === "flip" ? ("flip" as const) : ("verhuur" as const);
  const report = await analyseDeal({
    postcode: "1071AA",
    housenumber: 1,
    doel,
    aankoopprijs: 800_000,
    verbouwkosten: 60_000,
    // verhuur: bewust hoge huur om de WWS-regulering-check te raken
    maandhuur: doel === "verhuur" ? 3_000 : undefined,
  });
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
