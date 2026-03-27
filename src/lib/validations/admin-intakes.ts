import { z } from "zod";

import { INTAKE_STATUSES } from "@/types";

export const adminIntakeIdSchema = z.string().uuid("Invalid intake id.");

export const intakeStatusUpdateSchema = z.object({
  status: z.enum(INTAKE_STATUSES)
});

export const internalNoteSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "Enter a note before saving.")
    .max(4000, "Keep notes under 4,000 characters for this MVP.")
});
