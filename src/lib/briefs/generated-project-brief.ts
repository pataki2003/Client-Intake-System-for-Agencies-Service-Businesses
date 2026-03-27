import { z } from "zod";

const briefSectionText = z
  .string()
  .trim()
  .min(1, "Brief sections must contain content.");

const briefListItem = z
  .string()
  .trim()
  .min(1, "Brief list items must contain content.");

export const generatedProjectBriefSchema = z.object({
  clientSummary: briefSectionText,
  businessNeed: briefSectionText,
  suggestedScope: z.array(briefListItem).min(3).max(7),
  openQuestions: z.array(briefListItem).max(6),
  recommendedNextSteps: z.array(briefListItem).min(3).max(6)
});

export type GeneratedProjectBrief = z.infer<typeof generatedProjectBriefSchema>;

function renderMarkdownList(items: string[], emptyFallback: string) {
  if (items.length === 0) {
    return emptyFallback;
  }

  return items.map((item) => `- ${item}`).join("\n");
}

export function parseGeneratedProjectBrief(value: unknown): GeneratedProjectBrief | null {
  const parsed = generatedProjectBriefSchema.safeParse(value);

  return parsed.success ? parsed.data : null;
}

export function renderGeneratedProjectBriefMarkdown(brief: GeneratedProjectBrief) {
  return [
    "## Client Summary",
    brief.clientSummary,
    "",
    "## Business Need",
    brief.businessNeed,
    "",
    "## Suggested Scope",
    renderMarkdownList(brief.suggestedScope, "- No suggested scope was generated."),
    "",
    "## Open Questions",
    renderMarkdownList(brief.openQuestions, "No major open questions identified yet."),
    "",
    "## Recommended Next Steps",
    renderMarkdownList(brief.recommendedNextSteps, "- No recommended next steps were generated.")
  ].join("\n");
}
