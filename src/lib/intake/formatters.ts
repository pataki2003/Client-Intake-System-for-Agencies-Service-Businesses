import { PUBLIC_BUDGET_RANGE_OPTIONS } from "@/lib/intake/public-intake-options";
import type { BudgetRange, IntakeStatus, JsonValue, ProjectTimeline } from "@/types";

const budgetRangeLabelMap = new Map(PUBLIC_BUDGET_RANGE_OPTIONS.map((option) => [option.value, option.label] as const));

const intakeStatusLabelMap = new Map<IntakeStatus, string>([
  ["new", "New"],
  ["reviewing", "Reviewing"],
  ["brief_ready", "Brief ready"],
  ["contacted", "Contacted"],
  ["archived", "Archived"]
]);

const projectTimelineLabelMap = new Map<ProjectTimeline, string>([
  ["asap", "ASAP"],
  ["within_30_days", "Within 30 days"],
  ["within_60_days", "Within 60 days"],
  ["within_90_days", "Within 90 days"],
  ["flexible", "Flexible"]
]);

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium"
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short"
});

function getValidDate(value: string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function isJsonObject(value: JsonValue | undefined): value is { [key: string]: JsonValue } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function formatIntakeStatus(status: IntakeStatus) {
  return intakeStatusLabelMap.get(status) ?? status;
}

export function formatBudgetRange(range: BudgetRange | null) {
  if (!range) {
    return "Not provided";
  }

  return budgetRangeLabelMap.get(range) ?? range;
}

export function formatDate(value: string | null) {
  if (!value) {
    return "Not set";
  }

  const date = getValidDate(value);

  return date ? dateFormatter.format(date) : value;
}

export function formatProjectTimeline(value: ProjectTimeline | null) {
  if (!value) {
    return "Not set";
  }

  return projectTimelineLabelMap.get(value) ?? value;
}

export function formatDateTime(value: string) {
  const date = getValidDate(value);

  return date ? dateTimeFormatter.format(date) : value;
}

export function formatJsonValue(value: JsonValue | null | undefined): string {
  if (value == null || value === "") {
    return "—";
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? value.map((entry) => formatJsonValue(entry)).join(", ") : "—";
  }

  return JSON.stringify(value, null, 2);
}

export function extractAnswerValue(value: JsonValue) {
  if (isJsonObject(value) && "value" in value) {
    return formatJsonValue(value.value);
  }

  return formatJsonValue(value);
}
