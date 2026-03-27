import "server-only";

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

import {
  generatedProjectBriefSchema,
  parseGeneratedProjectBrief,
  renderGeneratedProjectBriefMarkdown,
  type GeneratedProjectBrief
} from "@/lib/briefs/generated-project-brief";
import { createOpenAIClient, getOpenAIModel } from "@/lib/openai/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { buildBriefPromptPayload, buildBriefPromptUserMessage, INTERNAL_PROJECT_BRIEF_SYSTEM_PROMPT } from "@/server/briefs/brief-prompt";
import { getAdminIntakeDetail } from "@/server/admin-intakes/get-admin-intake-detail";
import type { ProjectBrief } from "@/types";

type RawBriefRow = {
  id: string;
  intake_id: string;
  brief_markdown: string;
  brief_json: unknown;
  model: string | null;
  created_at: string;
  updated_at: string;
};

export class IntakeBriefGenerationError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "IntakeBriefGenerationError";
    this.status = status;
  }
}

function mapProjectBrief(row: RawBriefRow): ProjectBrief {
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

function getRefusalMessage(response: {
  output?: Array<{ type?: string; content?: Array<{ type?: string; refusal?: string }> }>;
}) {
  for (const item of response.output ?? []) {
    if (!item || item.type !== "message") {
      continue;
    }

    for (const content of item.content ?? []) {
      if (content?.type === "refusal" && content.refusal) {
        return content.refusal;
      }
    }
  }

  return null;
}

function normalizeBriefGenerationError(error: unknown): IntakeBriefGenerationError {
  if (error instanceof IntakeBriefGenerationError) {
    return error;
  }

  if (error instanceof OpenAI.AuthenticationError) {
    return new IntakeBriefGenerationError("OpenAI authentication failed. Check OPENAI_API_KEY.", 502);
  }

  if (error instanceof OpenAI.PermissionDeniedError) {
    return new IntakeBriefGenerationError(
      `OpenAI denied access to the configured model (${getOpenAIModel()}). Check OPENAI_MODEL and your project permissions.`,
      502
    );
  }

  if (error instanceof OpenAI.RateLimitError) {
    return new IntakeBriefGenerationError("OpenAI rate limits are being hit right now. Please try again in a moment.", 429);
  }

  if (error instanceof OpenAI.BadRequestError || error instanceof OpenAI.UnprocessableEntityError) {
    return new IntakeBriefGenerationError(
      `OpenAI rejected the brief generation request for model ${getOpenAIModel()}. Check OPENAI_MODEL and the request configuration.`,
      502
    );
  }

  if (error instanceof OpenAI.APIConnectionError || error instanceof OpenAI.APIConnectionTimeoutError) {
    return new IntakeBriefGenerationError("We couldn't reach OpenAI right now. Please try again in a moment.", 502);
  }

  if (error instanceof Error && error.message) {
    if (error.message.includes("OPENAI_API_KEY")) {
      return new IntakeBriefGenerationError(error.message, 500);
    }

    return new IntakeBriefGenerationError(error.message, 500);
  }

  return new IntakeBriefGenerationError("We couldn't generate the project brief right now.", 500);
}

async function generateStructuredBrief(input: string): Promise<GeneratedProjectBrief> {
  try {
    const client = createOpenAIClient();
    const response = await client.responses.parse({
      model: getOpenAIModel(),
      instructions: INTERNAL_PROJECT_BRIEF_SYSTEM_PROMPT,
      input,
      text: {
        format: zodTextFormat(generatedProjectBriefSchema, "generated_project_brief")
      }
    });

    if (!response.output_parsed) {
      const refusal = getRefusalMessage(response);
      throw new IntakeBriefGenerationError(
        refusal ? `The model refused to generate a brief: ${refusal}` : "The model did not return a valid structured brief.",
        502
      );
    }

    return response.output_parsed;
  } catch (error) {
    throw normalizeBriefGenerationError(error);
  }
}

export async function generateIntakeBrief(intakeId: string): Promise<ProjectBrief> {
  const intakeDetail = await getAdminIntakeDetail(intakeId);

  if (!intakeDetail) {
    throw new IntakeBriefGenerationError("That intake could not be found.", 404);
  }

  const promptPayload = buildBriefPromptPayload(intakeDetail);
  const generatedBrief = await generateStructuredBrief(buildBriefPromptUserMessage(promptPayload));
  const briefMarkdown = renderGeneratedProjectBriefMarkdown(generatedBrief);
  const supabase = createServiceRoleClient();
  const model = getOpenAIModel();

  const { data, error } = await supabase
    .from("ai_briefs")
    .upsert(
      {
        intake_id: intakeId,
        brief_markdown: briefMarkdown,
        brief_json: generatedBrief,
        model
      },
      {
        onConflict: "intake_id"
      }
    )
    .select("id, intake_id, brief_markdown, brief_json, model, created_at, updated_at")
    .single();

  if (error || !data) {
    throw new IntakeBriefGenerationError(
      error?.message ? `We couldn't save the generated brief in Supabase: ${error.message}` : "We couldn't save the generated brief right now."
    );
  }

  return mapProjectBrief(data as RawBriefRow);
}
