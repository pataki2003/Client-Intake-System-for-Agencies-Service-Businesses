import { BriefGenerationAction } from "@/components/admin/brief-generation-action";
import { FormattedDateTime } from "@/components/shared/intake-display";
import { InfoTile } from "@/components/shared/info-tile";
import { SectionHeader } from "@/components/shared/section-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    <section className="rounded-2xl border bg-secondary/15 p-5 md:p-6">
      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="rounded-xl border bg-background px-4 py-4">
          <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">{value}</p>
        </div>
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
    <section className="rounded-2xl border bg-secondary/10 p-5 md:p-6">
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-background px-4 py-4">
            <p className="text-sm text-muted-foreground">{emptyFallback}</p>
          </div>
        ) : (
          <ol className="space-y-3">
            {items.map((item, index) => (
              <li key={`${item}-${index}`} className="rounded-xl border bg-background px-4 py-4">
                <div className="flex gap-3">
                  <div className="flex h-7 min-w-7 items-center justify-center rounded-full border bg-secondary/20 px-2 text-[11px] font-semibold text-muted-foreground">
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

export function ProjectBriefPanel({ intakeId, brief }: ProjectBriefPanelProps) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="space-y-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
                AI-assisted
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-medium">
                Internal use
              </Badge>
            </div>

            <SectionHeader
              eyebrow="Project brief"
              title="Working brief"
              description="Summarize the request into a cleaner internal brief the team can scan quickly."
              titleClassName="text-2xl md:text-3xl"
              descriptionClassName="max-w-2xl text-sm"
            />
          </div>

          <div className="w-full rounded-2xl border bg-secondary/15 p-4 xl:max-w-[280px]">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Brief action</p>
              <p className="text-sm text-muted-foreground">
                {brief ? "Regenerate the brief using the latest request details." : "Generate the first brief from the current request."}
              </p>
            </div>
            <div className="mt-4">
              <BriefGenerationAction intakeId={intakeId} hasExistingBrief={Boolean(brief)} />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {brief ? (
          <>
            <div className="grid gap-3 md:grid-cols-2">
              <InfoTile
                eyebrow="Model"
                title={brief.model ?? "Not recorded"}
                variant="muted"
                titleClassName="text-base font-medium"
              />
              <InfoTile
                eyebrow="Last updated"
                title={
                  <FormattedDateTime
                    value={brief.updatedAt}
                    showRelative
                    valueClassName="font-medium text-foreground"
                    relativeClassName="text-xs text-muted-foreground"
                  />
                }
                variant="accent"
                titleClassName="text-base font-medium"
              />
            </div>

            {brief.briefJson ? (
              <div className="space-y-4">
                <div className="grid gap-4 lg:grid-cols-2">
                  <BriefNarrativeBlock
                    title="Client Summary"
                    description="Who the client is and what they are asking for."
                    value={brief.briefJson.clientSummary}
                  />
                  <BriefNarrativeBlock
                    title="Business Need"
                    description="The problem or opportunity behind the request."
                    value={brief.briefJson.businessNeed}
                  />
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  <BriefListBlock
                    title="Suggested Scope"
                    description="A practical starting scope based on what has been submitted."
                    items={brief.briefJson.suggestedScope}
                    emptyFallback="No suggested scope was captured."
                    itemLabel="Scope"
                  />
                  <BriefListBlock
                    title="Open Questions"
                    description="Questions that would improve scoping or onboarding."
                    items={brief.briefJson.openQuestions}
                    emptyFallback="No open questions were highlighted."
                    itemLabel="Question"
                  />
                </div>

                <BriefListBlock
                  title="Recommended Next Steps"
                  description="Suggested internal actions for moving the opportunity forward."
                  items={brief.briefJson.recommendedNextSteps}
                  emptyFallback="No next steps were captured."
                  itemLabel="Step"
                />

                <details className="rounded-2xl border bg-secondary/10 px-4 py-4">
                  <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                    View stored markdown version
                  </summary>
                  <div className="mt-4 rounded-xl border bg-background p-4">
                    <pre className="overflow-x-auto whitespace-pre-wrap text-sm leading-6">{brief.briefMarkdown}</pre>
                  </div>
                </details>
              </div>
            ) : (
              <div className="rounded-2xl border bg-secondary/10 p-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Stored markdown</p>
                  <p className="text-sm text-muted-foreground">
                    Structured brief data is not available for this record, so the stored markdown is shown below.
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
              <p className="text-sm font-medium">No project brief yet</p>
              <p className="text-sm text-muted-foreground">
                Generate a brief to create a concise working summary for the team.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
