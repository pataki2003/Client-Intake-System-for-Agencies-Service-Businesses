export const INTAKE_STATUSES = [
  "new",
  "reviewing",
  "brief_ready",
  "contacted",
  "archived"
] as const;

export type IntakeStatus = (typeof INTAKE_STATUSES)[number];

export const BUDGET_RANGES = [
  "under_2500",
  "2500_5000",
  "5000_10000",
  "10000_25000",
  "25000_plus",
  "undisclosed"
] as const;

export type BudgetRange = (typeof BUDGET_RANGES)[number];

export const PROJECT_TIMELINES = [
  "asap",
  "within_30_days",
  "within_60_days",
  "within_90_days",
  "flexible"
] as const;

export type ProjectTimeline = (typeof PROJECT_TIMELINES)[number];

export interface IntakeSubmission {
  clientName: string;
  companyName: string | null;
  email: string;
  phone: string | null;
  website: string | null;
  serviceRequested: string;
  budgetRange: BudgetRange | null;
  timeline: ProjectTimeline | null;
  projectSummary: string;
  businessGoals: string | null;
  currentChallenges: string | null;
  referralSource: string | null;
  additionalInfo: string | null;
}

export interface IntakeRecord extends IntakeSubmission {
  id: string;
  status: IntakeStatus;
  confirmationSentAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IntakeListItem {
  id: string;
  clientName: string;
  companyName: string | null;
  email: string;
  serviceRequested: string;
  status: IntakeStatus;
  createdAt: string;
}

export interface ProjectBrief {
  id: string;
  intakeId: string;
  briefMarkdown: string;
  model: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InternalNote {
  id: string;
  intakeId: string;
  authorId: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  fullName: string | null;
  role: "admin";
  createdAt: string;
}
