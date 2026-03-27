import { BriefGenerationAction } from "@/components/admin/brief-generation-action";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/intake/formatters";
import type { ProjectBrief } from "@/types";

type ProjectBriefPanelProps = {
  intakeId: string;
  brief: ProjectBrief | null;
};

function renderBulletList(items: string[], emptyFallback: string) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyFallback}</p>;
  }

  return (
    <ul className="space-y-2 text-sm">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="rounded-xl border bg-background px-4 py-3">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ProjectBriefPanel({ intakeId, brief }: ProjectBriefPanelProps) {
  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1.5">
            <CardTitle>AI project brief</CardTitle>
            <CardDescription>Generate or refresh a structured internal brief from the current intake data.</CardDescription>
          </div>

          <BriefGenerationAction intakeId={intakeId} hasExistingBrief={Boolean(brief)} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {brief ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Model</p>
                <p className="text-sm">{brief.model ?? "Not recorded"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last updated</p>
                <p className="text-sm">{formatDateTime(brief.updatedAt)}</p>
              </div>
            </div>

            {brief.briefJson ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Client Summary</p>
                  <p className="whitespace-pre-wrap text-sm">{brief.briefJson.clientSummary}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Business Need</p>
                  <p className="whitespace-pre-wrap text-sm">{brief.briefJson.businessNeed}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Suggested Scope</p>
                  {renderBulletList(brief.briefJson.suggestedScope, "No suggested scope was generated.")}
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Open Questions</p>
                  {renderBulletList(brief.briefJson.openQuestions, "No major open questions identified yet.")}
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Recommended Next Steps</p>
                  {renderBulletList(brief.briefJson.recommendedNextSteps, "No recommended next steps were generated.")}
                </div>

                <details className="rounded-xl border bg-muted/40 px-4 py-3">
                  <summary className="cursor-pointer text-sm font-medium">View stored markdown</summary>
                  <pre className="mt-4 overflow-x-auto whitespace-pre-wrap text-sm">{brief.briefMarkdown}</pre>
                </details>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stored markdown</p>
                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl bg-muted p-4 text-sm">
                  {brief.briefMarkdown}
                </pre>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
            No AI brief has been generated for this intake yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
