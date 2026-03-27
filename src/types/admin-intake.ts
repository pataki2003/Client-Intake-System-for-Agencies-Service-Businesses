import type { BudgetRange, InternalNote, IntakeStatus, JsonValue, ProjectBrief, ProjectTimeline } from "./intake";

export interface AdminIntakeListItem {
  id: string;
  clientId: string;
  clientName: string;
  companyName: string | null;
  serviceRequested: string;
  status: IntakeStatus;
  budgetRange: BudgetRange | null;
  hasBrief: boolean;
  createdAt: string;
}

export interface AdminIntakeClient {
  id: string;
  clientName: string;
  companyName: string | null;
  email: string;
  phone: string | null;
  website: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminIntakeAnswer {
  id: string;
  intakeId: string;
  questionKey: string;
  questionLabel: string;
  answerType: string;
  answerValue: JsonValue;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminIntakeNote extends Omit<InternalNote, "authorId"> {
  authorId: string | null;
}

export interface AdminIntakeDetail {
  id: string;
  clientId: string;
  status: IntakeStatus;
  serviceRequested: string;
  budgetRange: BudgetRange | null;
  timeline: ProjectTimeline | null;
  projectSummary: string;
  businessGoals: string | null;
  currentChallenges: string | null;
  referralSource: string | null;
  additionalInfo: string | null;
  confirmationSentAt: string | null;
  sourceMetadata: JsonValue | null;
  createdAt: string;
  updatedAt: string;
  client: AdminIntakeClient;
  answers: AdminIntakeAnswer[];
  brief: ProjectBrief | null;
  notes: AdminIntakeNote[];
}
