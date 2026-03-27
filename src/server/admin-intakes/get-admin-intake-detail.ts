import "server-only";

import { parseGeneratedProjectBrief } from "@/lib/briefs/generated-project-brief";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type {
  AdminIntakeAnswer,
  AdminIntakeClient,
  AdminIntakeDetail,
  AdminIntakeNote,
  BudgetRange,
  IntakeStatus,
  JsonValue,
  ProjectBrief,
  ProjectTimeline
} from "@/types";

type RawIntakeRow = {
  id: string;
  client_id: string;
  status: IntakeStatus;
  service_requested: string;
  budget_range: BudgetRange | null;
  timeline: ProjectTimeline | null;
  project_summary: string;
  business_goals: string | null;
  current_challenges: string | null;
  referral_source: string | null;
  additional_info: string | null;
  confirmation_sent_at: string | null;
  source_metadata: JsonValue | null;
  created_at: string;
  updated_at: string;
};

type RawClientRow = {
  id: string;
  client_name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
};

type RawAnswerRow = {
  id: string;
  intake_id: string;
  question_key: string;
  question_label: string;
  answer_type: string;
  answer_value: JsonValue;
  display_order: number;
  created_at: string;
  updated_at: string;
};

type RawBriefRow = {
  id: string;
  intake_id: string;
  brief_markdown: string;
  brief_json: unknown;
  model: string | null;
  created_at: string;
  updated_at: string;
};

type RawNoteRow = {
  id: string;
  intake_id: string;
  author_id: string | null;
  body: string;
  created_at: string;
  updated_at: string;
};

function mapClient(row: RawClientRow): AdminIntakeClient {
  return {
    id: row.id,
    clientName: row.client_name,
    companyName: row.company_name,
    email: row.email,
    phone: row.phone,
    website: row.website,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapAnswer(row: RawAnswerRow): AdminIntakeAnswer {
  return {
    id: row.id,
    intakeId: row.intake_id,
    questionKey: row.question_key,
    questionLabel: row.question_label,
    answerType: row.answer_type,
    answerValue: row.answer_value,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapBrief(row: RawBriefRow | null): ProjectBrief | null {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    intakeId: row.intake_id,
    briefMarkdown: row.brief_markdown,
    briefJson: parseGeneratedProjectBrief(row.brief_json),
    model: row.model,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapNote(row: RawNoteRow): AdminIntakeNote {
  return {
    id: row.id,
    intakeId: row.intake_id,
    authorId: row.author_id,
    body: row.body,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function getAdminIntakeDetail(intakeId: string): Promise<AdminIntakeDetail | null> {
  const supabase = createServiceRoleClient();

  const { data: intakeRow, error: intakeError } = await supabase
    .from("intakes")
    .select(
      "id, client_id, status, service_requested, budget_range, timeline, project_summary, business_goals, current_challenges, referral_source, additional_info, confirmation_sent_at, source_metadata, created_at, updated_at"
    )
    .eq("id", intakeId)
    .maybeSingle();

  if (intakeError) {
    throw new Error(`Failed to load intake detail: ${intakeError.message}`);
  }

  if (!intakeRow) {
    return null;
  }

  const typedIntake = intakeRow as RawIntakeRow;

  const [clientResult, answersResult, briefResult, notesResult] = await Promise.all([
    supabase
      .from("clients")
      .select("id, client_name, company_name, email, phone, website, created_at, updated_at")
      .eq("id", typedIntake.client_id)
      .single(),
    supabase
      .from("intake_answers")
      .select("id, intake_id, question_key, question_label, answer_type, answer_value, display_order, created_at, updated_at")
      .eq("intake_id", typedIntake.id)
      .order("display_order", { ascending: true }),
    supabase
      .from("ai_briefs")
      .select("id, intake_id, brief_markdown, brief_json, model, created_at, updated_at")
      .eq("intake_id", typedIntake.id)
      .maybeSingle(),
    supabase
      .from("internal_notes")
      .select("id, intake_id, author_id, body, created_at, updated_at")
      .eq("intake_id", typedIntake.id)
      .order("created_at", { ascending: false })
  ]);

  if (clientResult.error) {
    throw new Error(`Failed to load intake client: ${clientResult.error.message}`);
  }

  if (answersResult.error) {
    throw new Error(`Failed to load intake answers: ${answersResult.error.message}`);
  }

  if (briefResult.error) {
    throw new Error(`Failed to load intake brief: ${briefResult.error.message}`);
  }

  if (notesResult.error) {
    throw new Error(`Failed to load intake notes: ${notesResult.error.message}`);
  }

  const client = clientResult.data ? mapClient(clientResult.data as RawClientRow) : null;

  if (!client) {
    return null;
  }

  return {
    id: typedIntake.id,
    clientId: typedIntake.client_id,
    status: typedIntake.status,
    serviceRequested: typedIntake.service_requested,
    budgetRange: typedIntake.budget_range,
    timeline: typedIntake.timeline,
    projectSummary: typedIntake.project_summary,
    businessGoals: typedIntake.business_goals,
    currentChallenges: typedIntake.current_challenges,
    referralSource: typedIntake.referral_source,
    additionalInfo: typedIntake.additional_info,
    confirmationSentAt: typedIntake.confirmation_sent_at,
    sourceMetadata: typedIntake.source_metadata,
    createdAt: typedIntake.created_at,
    updatedAt: typedIntake.updated_at,
    client,
    answers: ((answersResult.data ?? []) as RawAnswerRow[]).map(mapAnswer),
    brief: mapBrief((briefResult.data ?? null) as RawBriefRow | null),
    notes: ((notesResult.data ?? []) as RawNoteRow[]).map(mapNote)
  };
}
