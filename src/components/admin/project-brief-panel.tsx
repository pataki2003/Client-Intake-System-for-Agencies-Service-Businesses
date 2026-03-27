import type { ReactNode } from "react";

import { BriefGenerationAction } from "@/components/admin/brief-generation-action";
import { FormattedDateTime } from "@/components/shared/intake-display";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectBrief } from "@/types";

type ProjectBriefPanelProps = {
  intakeId: string;
  brief: ProjectBrief | null;
};

function BriefNarrativeBlock({
  title,
  description,
  value
}: {
  title: string;
  description: string;
  value: string;
}) {
  return (
    <section className="rounded-2xl border bg-background p-5 md:p-6">
      <div className="space-y-2">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">{value}</p>
      </div>
    </section>
  );
}

function BriefListBlock({
  title,
  description,
  items,
  emptyFallback,
  itemLabel
}: {
  title: string;
  description: string;
  items: string[];
  emptyFallback: string;
  itemLabel: "Scope" | "Question" | "Step";
}) {
  return (
    <section className="rounded-2xl border bg-background p-5 md:p-6">
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyFallback}</p>
        ) : (
          <ol className="space-y-3">
            {items.map((item, index) => (
              <li key={`${item}-${index}`} className="rounded-xl border bg-secondary/20 px-4 py-4">
                <div className="flex gap-3">
                  <div className="flex h-7 min-w-7 items-center justify-center rounded-full border bg-background px-2 text-[11px] font-semibold text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      {itemLabel} {index + 1}
                    </p>
                    <p className="text-sm leading-7 text-foreground">{item}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}

function BriefMetadataItem({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-background px-4 py-4">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <div className="mt-2 text-sm text-foreground">{children}</div>
    </div>
  );
}

export function ProjectBriefPanel({ intakeId, brief }: ProjectBriefPanelProps) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="space-y-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
                AI-assisted
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-medium">
                Internal review
              </Badge>
            </div>

            <div className="space-y-2">
              <CardTitle className="text-2xl md:text-3xl">AI project brief</CardTitle>
              <CardDescription className="max-w-2xl">
                Turn the intake into a structured internal summary that helps the team align faster on fit, scope,
                questions, and next steps.
              </CardDescription>
            </div>
          </div>

          <div className="rounded-2xl border bg-background p-3">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Action</p>
              <p className="text-sm text-muted-foreground">
                {brief ? "Refresh the brief using the latest intake data." : "Generate the first structured internal brief."}
              </p>
            </div>
            <div className="mt-3">
              <BriefGenerationAction intakeId={intakeId} hasExistingBrief={Boolean(brief)} />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {brief ? (
          <>
            <div className="grid gap-3 md:grid-cols-2">
              <BriefMetadataItem label="Model">
                <p className="font-medium">{brief.model ?? "Not recorded"}</p>
              </BriefMetadataItem>
              <BriefMetadataItem label="Last updated">
                <FormattedDateTime
                  value={brief.updatedAt}
                  showRelative
                  valueClassName="font-medium text-foreground"
                  relativeClassName="text-xs text-muted-foreground"
                />
              </BriefMetadataItem>
            </div>

            {brief.briefJson ? (
              <div className="space-y-4">
                <div className="grid gap-4 lg:grid-cols-2">
                  <BriefNarrativeBlock
                    title="Client Summary"
                    description="Who the client appears to be and what they are asking for."
                    value={brief.briefJson.clientSummary}
                  />
                  <BriefNarrativeBlock
                    title="Business Need"
                    description="The business problem, opportunity, or reason behind the request."
                    value={brief.briefJson.businessNeed}
                  />
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  <BriefListBlock
                    title="Suggested Scope"
                    description="A practical starting scope based on the information currently available."
                    items={brief.briefJson.suggestedScope}
                    emptyFallback="No suggested scope was generated."
                    itemLabel="Scope"
                  />
                  <BriefListBlock
                    title="Open Questions"
                    description="Clarifications that would materially improve scoping or onboarding."
                    items={brief.briefJson.openQuestions}
                    emptyFallback="No major open questions identified yet."
                    itemLabel="Question"
                  />
                </div>

                <BriefListBlock
                  title="Recommended Next Steps"
                  description="Concrete internal actions for moving the opportunity forward."
                  items={brief.briefJson.recommendedNextSteps}
                  emptyFallback="No recommended next steps were generated."
                  itemLabel="Step"
                />

                <details className="rounded-2xl border bg-secondary/15 px-4 py-4">
                  <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                    View stored markdown
                  </summary>
                  <div className="mt-4 rounded-xl border bg-background p-4">
                    <pre className="overflow-x-auto whitespace-pre-wrap text-sm leading-6">{brief.briefMarkdown}</pre>
                  </div>
                </details>
              </div>
            ) : (
              <div className="rounded-2xl border bg-secondary/15 p-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Stored markdown</p>
                  <p className="text-sm text-muted-foreground">
                    Structured JSON is not available for this brief, so the stored markdown is shown directly.
                  </p>
                </div>
                <div className="mt-4 rounded-xl border bg-background p-4">
                  <pre className="overflow-x-auto whitespace-pre-wrap text-sm leading-6">{brief.briefMarkdown}</pre>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed px-5 py-7">
            <div className="space-y-2">
              <p className="text-sm font-medium">No AI brief generated yet</p>
              <p className="text-sm text-muted-foreground">
                Generate a structured summary to turn this intake into a faster internal review and follow-up handoff.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
