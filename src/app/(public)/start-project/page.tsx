import { PublicIntakeForm } from "@/components/intake/public-intake-form";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const intakeHighlights = [
  "Tell us what you need in one clear intake flow",
  "We capture the project context, budget, and deadline up front",
  "Your submission drops directly into the internal review workflow"
];

export default function StartProjectPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Public Intake"
        title="Start your project"
        description="Share the essentials and we&apos;ll turn your request into a structured project intake for our team."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <PublicIntakeForm />

        <Card className="border-border/70 bg-secondary/40">
          <CardHeader>
            <CardTitle>What to expect</CardTitle>
            <CardDescription>This MVP keeps the first step fast while still giving us the context we need.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3 text-sm text-muted-foreground">
              {intakeHighlights.map((item) => (
                <li key={item} className="rounded-lg border border-border/60 bg-background/80 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>

            <div className="rounded-xl border border-dashed border-border/70 bg-background/80 p-4 text-sm text-muted-foreground">
              Most teams complete this form in under five minutes.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
