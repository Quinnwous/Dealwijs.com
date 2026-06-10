// Gedeelde AI-config. Claude via de Vercel AI Gateway (model-string "anthropic/...").
// Zonder key levert de AI-laag null op en blijft het rapport volledig deterministisch —
// de app werkt dus ook zonder AI_GATEWAY_API_KEY.

export const AI_MODEL = process.env.DEALWIJS_AI_MODEL ?? "anthropic/claude-sonnet-4.6";

export function aiBeschikbaar(): boolean {
  // AI_GATEWAY_API_KEY lokaal; VERCEL_OIDC_TOKEN authenticeert automatisch op Vercel.
  return Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN);
}
