import { z } from "zod";

export const doelSchema = z.enum(["flip", "verhuur"]);

/** Lege strings uit formulieren tellen als "niet ingevuld" (anders maakt coerce er 0 van). */
const leegIsUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;
const optioneelGetal = <S extends z.ZodType<number, unknown>>(s: S) =>
  z.preprocess(leegIsUndefined, s.optional());

export const dealInputSchema = z.object({
  postcode: z.string().min(4),
  housenumber: z.coerce.number().int().positive(),
  houseaddition: z.preprocess(leegIsUndefined, z.string().optional()),
  doel: doelSchema,
  aankoopprijs: z.coerce.number().positive(),
  /** Eigen budget. Leeg laten + omschrijving invullen = AI schat de verbouwkosten. */
  verbouwkosten: optioneelGetal(z.coerce.number().nonnegative()),
  /** Vrije omschrijving van staat + verbouwplannen — input voor de AI-schatting. */
  omschrijving: z.preprocess(leegIsUndefined, z.string().max(2000).optional()),
  /** Flip: verwachte verkoopwaarde na verbouwing (ARV). Default = AVM-marktwaarde. */
  verwachteVerkoopwaarde: optioneelGetal(z.coerce.number().positive()),
  /** Verhuur: verwachte maandhuur. Default = grove schatting. */
  maandhuur: optioneelGetal(z.coerce.number().positive()),
  metHypotheek: z.coerce.boolean().optional(),
  schuld: optioneelGetal(z.coerce.number().nonnegative()),
  /** Jaarrente in procenten (bv. 5,5). Default = verhuurhypotheek-aanname. */
  hypotheekRente: optioneelGetal(z.coerce.number().positive().max(15)),
});

export type DealInput = z.infer<typeof dealInputSchema>;
