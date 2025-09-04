// packages/schemas/src/common.ts
import { z } from "zod";

// ---- Type-specific payloads ----
export const CharacterPayload = z.object({
  name: z.string(),
  age: z.number().int().nonnegative().optional(),
  gender: z.string().optional(),
  traits: z.array(z.string()).default([]),
  bio: z.string().optional(),
});

export const LocationPayload = z.object({
  title: z.string(),
  biome: z.string().optional(),
  climate: z.string().optional(),
  description: z.string().optional(),
});

export const ItemPayload = z.object({
  label: z.string(),
  rarity: z.enum(["common","uncommon","rare","legendary"]).optional(),
  description: z.string().optional(),
});

// ---- Discriminated union ----
export const CanonContent = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("character"), fields: CharacterPayload }),
  z.object({ kind: z.literal("location"),  fields: LocationPayload }),
  z.object({ kind: z.literal("item"),      fields: ItemPayload }),
]);

export type CanonContent = z.infer<typeof CanonContent>;
