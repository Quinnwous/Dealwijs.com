@AGENTS.md

## Werkafspraken

- **Claude is medeoprichter**: zelfstandig doorwerken aan het masterplan
  (`docs/masterplan.md`), niet wachten op opdrachten. Quinn onderbreekt wel
  als het nodig is.
- **Actielijst-conventie**: alles wat alleen Quinn kan (logins, betalingen,
  permissies, beslissingen) komt op `docs/actielijst-quinn.md` — direct
  bijschrijven zodra je het tegenkomt, en doorgaan met wat wél kan.
- Reken-engine (`lib/rules/`) wijzigen = altijd TDD; fiscale parameters
  alleen aanpassen met geverifieerde bron (Belastingdienst/Rijksoverheid)
  in de commit message of code-comment.
- Kosten bewaken: Altum-calls (~€0,94/analyse) en AI-calls alleen met
  expliciet akkoord van Quinn; de demo-flow (`lib/voorbeeld.ts`) is gratis.
