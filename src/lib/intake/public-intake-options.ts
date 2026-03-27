import type { BudgetRange } from "@/types";

export const PUBLIC_SERVICE_TYPE_VALUES = [
  "web_design_development",
  "branding",
  "seo",
  "paid_ads",
  "social_media",
  "automation",
  "content_strategy",
  "other"
] as const;

export type PublicServiceTypeValue = (typeof PUBLIC_SERVICE_TYPE_VALUES)[number];

export const PUBLIC_SERVICE_TYPE_OPTIONS: ReadonlyArray<{
  value: PublicServiceTypeValue;
  label: string;
}> = [
  { value: "web_design_development", label: "Web design & development" },
  { value: "branding", label: "Branding" },
  { value: "seo", label: "SEO" },
  { value: "paid_ads", label: "Paid ads" },
  { value: "social_media", label: "Social media management" },
  { value: "automation", label: "Automation & systems" },
  { value: "content_strategy", label: "Content strategy" },
  { value: "other", label: "Other" }
];

export const PUBLIC_BUDGET_RANGE_OPTIONS: ReadonlyArray<{
  value: BudgetRange;
  label: string;
}> = [
  { value: "under_2500", label: "Under $2,500" },
  { value: "2500_5000", label: "$2,500 - $5,000" },
  { value: "5000_10000", label: "$5,000 - $10,000" },
  { value: "10000_25000", label: "$10,000 - $25,000" },
  { value: "25000_plus", label: "$25,000+" },
  { value: "undisclosed", label: "Prefer not to say yet" }
];

const publicServiceTypeLabelMap = new Map(
  PUBLIC_SERVICE_TYPE_OPTIONS.map((option) => [option.value, option.label] as const)
);

export function getPublicServiceTypeLabel(value: Exclude<PublicServiceTypeValue, "other">) {
  return publicServiceTypeLabelMap.get(value) ?? value;
}
