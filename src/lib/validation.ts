import { z } from "zod";

export const createZoneSchema = z.object({
  name: z.string().min(1).max(100),
  memo: z.string().max(1000).optional().nullable(),
});

export const updateZoneSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  memo: z.string().max(1000).optional().nullable(),
});

export const createMaterialSchema = z.object({
  name: z.string().min(1).max(100),
  quantity: z.number().int().nonnegative(),
  zoneId: z.number().int().positive(),
});

export const updateMaterialSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  quantity: z.number().int().nonnegative().optional(),
  zoneId: z.number().int().positive().optional(),
});

export type CreateZoneInput = z.infer<typeof createZoneSchema>;
export type UpdateZoneInput = z.infer<typeof updateZoneSchema>;
export type CreateMaterialInput = z.infer<typeof createMaterialSchema>;
export type UpdateMaterialInput = z.infer<typeof updateMaterialSchema>;


