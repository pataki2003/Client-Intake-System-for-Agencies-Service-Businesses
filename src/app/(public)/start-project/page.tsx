import { InfoTile } from "@/components/shared/info-tile";
import { SectionHeader } from "@/components/shared/section-header";
import { StepCard } from "@/components/shared/step-card";
import { PublicIntakeForm } from "@/components/intake/public-intake-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const trustPoints = [
  {
    title: "Response expectations",
    description: "Every request is reviewed carefully before we reply."
  },
  {
    title: "Structured review",
    description: "Your answers help us evaluate fit, scope, timing, and the best next step."
  },
  {
    title: "No obligation",
    description: "This is simply a clear first step, not a commitment."
  }
];

const expectationBlocks = [
  {
    title: "What we review",
    description: "We look at your goals, current challenge, budget, and timing together so the request is reviewed with the right context."
  },
  {
    title: "What happens next",
    description: "After submission, the request is reviewed by the team before we follow up with the most appropriate next step."
  },
  {
    title: "Why we ask for detail",
    description: "A little more context up front leads to a clearer response than a short inquiry message."
  }
];

const flowSteps = [
  {
    step: "01",
    title: "Submit request",
    description: "Share the essentials once so the project starts with clearer context."
  },
  {
    step: "02",
    title: "Review internally",
    description: "The request is reviewed against scope, fit, timing, and follow-up readiness."
  },
  {
    step: "03",
    title: "Generate brief",
    description: "The submission can be turned into a working brief before the team responds."
  }
];

export default function StartProjectPage() {
  return (
    <div className="space-y-10 sm:space-y-12 md:space-y-14">
      <section className="space-y-6 rounded-[32px] border border-border/75 bg-surface-cool p-5 sm:space-y-8 sm:p-7 md:p-8">
        <div className="space-y-4 sm:space-y-5">
          <Badge variant="outline" className="border-primary/10 bg-background/90 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-primary/80">
            Project request
          </Badge>

          <SectionHeader
            title="Start your project inquiry with the right context"
            description="Share the essentials once. We will review the request carefully and follow up with a clear next step."
            titleClassName="text-3xl sm:text-4xl md:text-5xl"
            descriptionClassName="max-w-2xl text-base sm:text-lg"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {trustPoints.map((item, index) => (
            <InfoTile
              key={item.title}
              eyebrow={`Point ${index + 1}`}
              title={item.title}
              description={item.description}
              variant={index === 0 ? "accent" : index === 1 ? "muted" : "default"}
            />
          ))}
        </div>
      </section>

      <section className="rounded-[32px] bg-surface-sand p-3 sm:p-4 md:p-5">
        <div className="grid gap-5 sm:gap-6 xl:grid-cols-[minmax(0,1.15fr)_360px] xl:items-start">
          <PublicIntakeForm />

          <div className="space-y-4 xl:sticky xl:top-6">
            <Card variant="tinted" className="border-border/70 shadow-sm">
              <CardContent className="space-y-4 sm:space-y-5 p-4 sm:p-6">
                <SectionHeader
                  eyebrow="What to expect"
                  title="A practical review process"
                  description="This form helps us review the opportunity properly before we reply."
                  titleClassName="text-xl sm:text-2xl"
                />

                <div className="grid gap-3">
                  {expectationBlocks.map((item, index) => (
                    <InfoTile
                      key={item.title}
                      title={item.title}
                      description={item.description}
                      variant={index === 0 ? "accent" : index === 1 ? "muted" : "default"}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <InfoTile
              eyebrow="Timing"
              title="A best estimate is enough"
              description="If a budget or deadline is still taking shape, you can still submit a useful request."
              variant="accent"
              className="sm:max-w-none"
            />
          </div>
        </div>
      </section>

      <section className="space-y-5 rounded-[32px] border border-border/70 bg-background p-5 sm:space-y-6 sm:p-6">
        <SectionHeader
          eyebrow="How the flow works"
          title="A simple path from request to review"
          description="The first step stays easy for the client and useful for the team evaluating the request."
          className="max-w-2xl"
        />

        <div className="grid gap-4 md:grid-cols-3">
          {flowSteps.map((item, index) => (
            <StepCard
              key={item.step}
              step={item.step}
              title={item.title}
              description={item.description}
              variant={index === 0 ? "highlight" : index === 1 ? "muted" : "accent"}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
