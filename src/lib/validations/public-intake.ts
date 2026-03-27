import { z } from "zod";

import {
  PUBLIC_SERVICE_TYPE_VALUES,
  type PublicServiceTypeValue
} from "@/lib/intake/public-intake-options";
import { BUDGET_RANGES, type BudgetRange } from "@/types";

const optionalText = (label: string, maxLength: number) =>
  z.string().trim().max(maxLength, `${label} must be ${maxLength} characters or fewer.`);

const requiredText = (label: string, maxLength: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(maxLength, `${label} must be ${maxLength} characters or fewer.`);

export const publicIntakeSchema = z
  .object({
    name: requiredText("Name", 120),
    email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
    company_name: optionalText("Company name", 120),
    service_type: z
      .string()
      .trim()
      .min(1, "Select a service type.")
      .refine(
        (value) => PUBLIC_SERVICE_TYPE_VALUES.includes(value as PublicServiceTypeValue),
        "Select a service type."
      ),
    service_type_other: optionalText("Other service type", 120),
    goal: requiredText("Goal", 600),
    problem_description: requiredText("Problem description", 2000),
    deadline: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid deadline."),
    budget_range: z
      .string()
      .trim()
      .min(1, "Select a budget range.")
      .refine((value) => BUDGET_RANGES.includes(value as BudgetRange), "Select a budget range."),
    extra_notes: optionalText("Extra notes", 2000)
  })
  .superRefine((values, ctx) => {
    if (values.service_type === "other" && values.service_type_other.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["service_type_other"],
        message: "Tell us what service you need."
      });
    }
  });

export type PublicIntakeFormValues = z.infer<typeof publicIntakeSchema>;

export type NormalizedPublicIntakeFormValues = {
  name: string;
  email: string;
  companyName: string | null;
  serviceType: PublicServiceTypeValue;
  serviceTypeOther: string | null;
  goal: string;
  problemDescription: string;
  deadline: string;
  budgetRange: BudgetRange;
  extraNotes: string | null;
};

export const DEFAULT_PUBLIC_INTAKE_VALUES: PublicIntakeFormValues = {
  name: "",
  email: "",
  company_name: "",
  service_type: "",
  service_type_other: "",
  goal: "",
  problem_description: "",
  deadline: "",
  budget_range: "",
  extra_notes: ""
};

function toNullableText(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function normalizePublicIntakeFormValues(
  values: PublicIntakeFormValues
): NormalizedPublicIntakeFormValues {
  return {
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    companyName: toNullableText(values.company_name),
    serviceType: values.service_type.trim() as PublicServiceTypeValue,
    serviceTypeOther: toNullableText(values.service_type_other),
    goal: values.goal.trim(),
    problemDescription: values.problem_description.trim(),
    deadline: values.deadline.trim(),
    budgetRange: values.budget_range.trim() as BudgetRange,
    extraNotes: toNullableText(values.extra_notes)
  };
}
