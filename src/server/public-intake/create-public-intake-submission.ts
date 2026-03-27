import "server-only";

import {
  getPublicServiceTypeLabel,
  type PublicServiceTypeValue
} from "@/lib/intake/public-intake-options";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import {
  normalizePublicIntakeFormValues,
  publicIntakeSchema,
  type NormalizedPublicIntakeFormValues
} from "@/lib/validations/public-intake";
import type { PublicIntakeFieldErrors, PublicIntakeSubmissionResult } from "@/types";

type PublicIntakeRequestContext = {
  referer?: string | null;
  userAgent?: string | null;
};

type AnswerType = "text" | "long_text" | "single_select" | "email";

type IntakeAnswerInsert = {
  intake_id: string;
  question_key: string;
  question_label: string;
  answer_type: AnswerType;
  answer_value: Record<string, unknown>;
  display_order: number;
};

function resolveServiceRequested(values: NormalizedPublicIntakeFormValues) {
  if (values.serviceType === "other") {
    return values.serviceTypeOther ?? "Other";
  }

  return getPublicServiceTypeLabel(values.serviceType as Exclude<PublicServiceTypeValue, "other">);
}

function buildSourceMetadata({ referer, userAgent }: PublicIntakeRequestContext) {
  const metadata: Record<string, unknown> = {};

  if (referer) {
    metadata.referer = referer;

    try {
      const refererUrl = new URL(referer);
      const trackingEntries = Array.from(refererUrl.searchParams.entries()).filter(
        ([key]) => key.startsWith("utm_") || key === "ref" || key === "source"
      );

      metadata.landingPath = refererUrl.pathname;

      if (trackingEntries.length > 0) {
        metadata.tracking = Object.fromEntries(trackingEntries);
      }
    } catch {
      metadata.landingPath = null;
    }
  }

  if (userAgent) {
    metadata.userAgent = userAgent;
  }

  return Object.keys(metadata).length > 0 ? metadata : null;
}

function buildIntakeAnswerRows(
  intakeId: string,
  values: NormalizedPublicIntakeFormValues,
  resolvedServiceType: string
): IntakeAnswerInsert[] {
  return [
    {
      intake_id: intakeId,
      question_key: "name",
      question_label: "Name",
      answer_type: "text",
      answer_value: { value: values.name },
      display_order: 0
    },
    {
      intake_id: intakeId,
      question_key: "email",
      question_label: "Email",
      answer_type: "email",
      answer_value: { value: values.email },
      display_order: 1
    },
    {
      intake_id: intakeId,
      question_key: "company_name",
      question_label: "Company name",
      answer_type: "text",
      answer_value: { value: values.companyName },
      display_order: 2
    },
    {
      intake_id: intakeId,
      question_key: "service_type",
      question_label: "Service type",
      answer_type: "single_select",
      answer_value: {
        option: values.serviceType,
        otherValue: values.serviceTypeOther,
        value: resolvedServiceType
      },
      display_order: 3
    },
    {
      intake_id: intakeId,
      question_key: "goal",
      question_label: "Goal",
      answer_type: "long_text",
      answer_value: { value: values.goal },
      display_order: 4
    },
    {
      intake_id: intakeId,
      question_key: "problem_description",
      question_label: "Problem description",
      answer_type: "long_text",
      answer_value: { value: values.problemDescription },
      display_order: 5
    },
    {
      intake_id: intakeId,
      question_key: "deadline",
      question_label: "Deadline",
      answer_type: "text",
      answer_value: { value: values.deadline },
      display_order: 6
    },
    {
      intake_id: intakeId,
      question_key: "budget_range",
      question_label: "Budget range",
      answer_type: "single_select",
      answer_value: { value: values.budgetRange },
      display_order: 7
    },
    {
      intake_id: intakeId,
      question_key: "extra_notes",
      question_label: "Extra notes",
      answer_type: "long_text",
      answer_value: { value: values.extraNotes },
      display_order: 8
    }
  ];
}

function buildFieldErrors(error: { flatten: () => { fieldErrors: Record<string, string[]> } }) {
  return error.flatten().fieldErrors as PublicIntakeFieldErrors;
}

function genericFailureResult(): PublicIntakeSubmissionResult {
  return {
    success: false,
    formError: "We couldn't submit your request right now. Please try again in a moment."
  };
}

export async function createPublicIntakeSubmission(
  input: unknown,
  requestContext: PublicIntakeRequestContext = {}
): Promise<PublicIntakeSubmissionResult> {
  const parsed = publicIntakeSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      formError: "Please review the form and fix the highlighted fields.",
      fieldErrors: buildFieldErrors(parsed.error)
    };
  }

  const values = normalizePublicIntakeFormValues(parsed.data);
  const resolvedServiceType = resolveServiceRequested(values);
  const supabase = createServiceRoleClient();

  try {
    const { data: existingClients, error: existingClientError } = await supabase
      .from("clients")
      .select("id")
      .ilike("email", values.email)
      .order("created_at", { ascending: true })
      .limit(1);

    if (existingClientError) {
      console.error("Failed to check for an existing client.", existingClientError);
      return genericFailureResult();
    }

    let clientId = existingClients?.[0]?.id;

    if (!clientId) {
      const { data: createdClient, error: createClientError } = await supabase
        .from("clients")
        .insert({
          client_name: values.name,
          company_name: values.companyName,
          email: values.email
        })
        .select("id")
        .single();

      if (createClientError || !createdClient) {
        console.error("Failed to create client.", createClientError);
        return genericFailureResult();
      }

      clientId = createdClient.id;
    }

    const { data: createdIntake, error: createIntakeError } = await supabase
      .from("intakes")
      .insert({
        client_id: clientId,
        service_requested: resolvedServiceType,
        project_summary: values.goal,
        current_challenges: values.problemDescription,
        budget_range: values.budgetRange,
        timeline: null,
        additional_info: values.extraNotes,
        source_metadata: buildSourceMetadata(requestContext)
      })
      .select("id")
      .single();

    if (createIntakeError || !createdIntake) {
      console.error("Failed to create intake.", createIntakeError);
      return genericFailureResult();
    }

    const { error: createAnswersError } = await supabase
      .from("intake_answers")
      .insert(buildIntakeAnswerRows(createdIntake.id, values, resolvedServiceType));

    if (createAnswersError) {
      console.error("Failed to create intake answers.", createAnswersError);
      return genericFailureResult();
    }

    return {
      success: true,
      intakeId: createdIntake.id
    };
  } catch (error) {
    console.error("Unexpected public intake submission failure.", error);
    return genericFailureResult();
  }
}
