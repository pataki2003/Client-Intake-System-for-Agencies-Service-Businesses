import "server-only";

import { extractAnswerValue } from "@/lib/intake/formatters";
import type { AdminIntakeDetail } from "@/types";

export const INTERNAL_PROJECT_BRIEF_SYSTEM_PROMPT = `You are generating an internal project brief for an agency or service business.

Your job is to turn messy intake data into a concise, practical internal brief for the delivery and sales team.

Rules:
- Use only the information provided in the input payload.
- Do not invent facts, scope, budget, technical constraints, deadlines, or business context.
- If something is missing, unclear, or contradictory, put it in openQuestions instead of guessing.
- Preserve concrete details from the intake whenever they are available.
- Write in a clear internal operations tone. No hype, no marketing language, no filler.
- clientSummary must be 2 to 4 sentences summarizing who the client is, what they appear to do, and what they are asking for.
- businessNeed must be 2 to 4 sentences explaining the underlying problem, goal, or opportunity implied by the submission.
- suggestedScope must contain 3 to 7 specific bullets describing a reasonable initial scope based on the provided information.
- openQuestions must contain 0 to 6 specific follow-up questions that would materially improve scoping or onboarding.
- recommendedNextSteps must contain 3 to 6 concrete internal next steps for the agency team.
- If dynamic answers duplicate canonical intake fields, use them to reinforce or clarify, not to create contradictions.
- Output must match the provided schema exactly.`;

type BriefPromptPayload = {
  client: {
    name: string;
    companyName: string | null;
    email: string;
    phone: string | null;
    website: string | null;
  };
  intake: {
    serviceRequested: string;
    status: string;
    budgetRange: string | null;
    timeline: string | null;
    projectSummary: string;
    businessGoals: string | null;
    currentChallenges: string | null;
    referralSource: string | null;
    additionalInfo: string | null;
    sourceMetadata: unknown;
    createdAt: string;
  };
  dynamicAnswers: Array<{
    questionKey: string;
    questionLabel: string;
    answer: string;
  }>;
};

function normalizeDynamicAnswers(detail: AdminIntakeDetail): BriefPromptPayload["dynamicAnswers"] {
  return detail.answers
    .map((answer) => ({
      questionKey: answer.questionKey,
      questionLabel: answer.questionLabel,
      answer: extractAnswerValue(answer.answerValue).trim()
    }))
    .filter((answer) => answer.answer.length > 0 && answer.answer !== "—");
}

export function buildBriefPromptPayload(detail: AdminIntakeDetail): BriefPromptPayload {
  return {
    client: {
      name: detail.client.clientName,
      companyName: detail.client.companyName,
      email: detail.client.email,
      phone: detail.client.phone,
      website: detail.client.website
    },
    intake: {
      serviceRequested: detail.serviceRequested,
      status: detail.status,
      budgetRange: detail.budgetRange,
      timeline: detail.timeline,
      projectSummary: detail.projectSummary,
      businessGoals: detail.businessGoals,
      currentChallenges: detail.currentChallenges,
      referralSource: detail.referralSource,
      additionalInfo: detail.additionalInfo,
      sourceMetadata: detail.sourceMetadata,
      createdAt: detail.createdAt
    },
    dynamicAnswers: normalizeDynamicAnswers(detail)
  };
}

export function buildBriefPromptUserMessage(payload: BriefPromptPayload) {
  return `Generate an internal project brief from the following intake payload.

INPUT_PAYLOAD
${JSON.stringify(payload, null, 2)}`;
}
