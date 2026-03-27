import { BriefGenerationAction } from "@/components/admin/brief-generation-action";
import { FormattedDateTime } from "@/components/shared/intake-display";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectBrief } from "@/types";

type ProjectBriefPanelProps = {
  intakeId: string;
  brief: ProjectBrief | null;
};

function BriefTextBlock({
  title,
  description,
  value
}: {
  title: string;
  description: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-background p-5 space-y-3">
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">{value}</p>
    </div>
  );
}

function BriefListBlock({
  title,
  description,
  items,
  emptyFallback
}: {
  title: string;
  description: string;
  items: string[];
  emptyFallback: string;
}) {
  return (
    <div className="rounded-2xl border bg-background p-5 space-y-4">
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyFallback}</p>
      ) : (
        <ol className="space-y-3">
          {items.map((item, index) => (
            <li key={`${item}-${index}`} className="flex gap-3 rounded-xl bg-secondary/20 px-4 py-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background text-xs font-medium text-muted-foreground">
                {index + 1}
              </span>
              <p className="text-sm leading-6 text-foreground">{item}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function ProjectBriefPanel({ intakeId, brief }: ProjectBriefPanelProps) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="space-y-1">
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">AI brief</p>
              <CardTitle className="text-2xl">Structured project brief</CardTitle>
            </div>
            <CardDescription>
              Generate or refresh an internal brief that turns the intake into a clearer review and delivery handoff.
            </CardDescription>
          </div>

          <BriefGenerationAction intakeId={intakeId} hasExistingBrief={Boolean(brief)} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {brief ? (
          <>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
                Model: {brief.model ?? "Not recorded"}
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-medium">
                Updated <FormattedDateTime value={brief.updatedAt} />
              </Badge>
            </div>

            {brief.briefJson ? (
              <div className="space-y-4">
                <div className="grid gap-4 lg:grid-cols-2">
                  <BriefTextBlock
                    title="Client Summary"
                    description="Who the client appears to be and what they are asking for."
                    value={brief.briefJson.clientSummary}
                  />
                  <BriefTextBlock
                    title="Business Need"
                    description="The underlying business problem or opportunity implied by the intake."
                    value={brief.briefJson.businessNeed}
                  />
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  <BriefListBlock
                    title="Suggested Scope"
                    description="A practical initial scope based on the information currently available."
                    items={brief.briefJson.suggestedScope}
                    emptyFallback="No suggested scope was generated."
                  />
                  <BriefListBlock
                    title="Open Questions"
                    description="Points the team should clarify before finalizing scope or onboarding."
                    items={brief.briefJson.openQuestions}
                    emptyFallback="No major open questions identified yet."
                  />
                </div>

                <BriefListBlock
                  title="Recommended Next Steps"
                  description="Concrete internal follow-up steps for moving the intake forward."
                  items={brief.briefJson.recommendedNextSteps}
                  emptyFallback="No recommended next steps were generated."
                />

                <details className="rounded-2xl border bg-secondary/20 px-4 py-4">
                  <summary className="cursor-pointer text-sm font-medium">View stored markdown</summary>
                  <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-xl border bg-background p-4 text-sm">
                    {brief.briefMarkdown}
                  </pre>
                </details>
              </div>
            ) : (
              <div className="rounded-2xl border bg-secondary/20 p-4">
                <p className="text-sm font-medium">Stored markdown</p>
                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl border bg-background p-4 text-sm">
                  {brief.briefMarkdown}
                </pre>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
            No AI brief has been generated for this intake yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
