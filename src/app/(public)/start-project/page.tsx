import { PublicIntakeForm } from "@/components/intake/public-intake-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const trustPoints = [
  {
    title: "Response expectations",
    description: "Every submission is reviewed by the team, not dropped into a generic inbox."
  },
  {
    title: "Structured review",
    description: "We use your answers to evaluate scope, fit, and the most useful next step internally."
  },
  {
    title: "No obligation",
    description: "This is a straightforward intake, not a commitment. The goal is clarity on both sides."
  }
];

const expectationBlocks = [
  {
    title: "What we review",
    description: "We look at your goals, the current challenge, timing, and budget range together so the request has the right internal context."
  },
  {
    title: "What happens next",
    description: "Once submitted, your request is structured for internal review before we follow up with the most appropriate next step."
  },
  {
    title: "Why this form is more detailed",
    description: "A little more context upfront leads to a faster, more thoughtful response than a generic contact form."
  }
];

const flowSteps = [
  {
    step: "01",
    title: "Submit request",
    description: "Share the essentials once so the project starts with clear context instead of back-and-forth clarification."
  },
  {
    step: "02",
    title: "Review internally",
    description: "Your submission is organized for the team to review against scope, fit, timing, and next-step readiness."
  },
  {
    step: "03",
    title: "Generate AI brief",
    description: "The intake can be turned into a structured internal brief that helps the team align before responding."
  }
];

export default function StartProjectPage() {
  return (
    <div className="space-y-10 md:space-y-12">
      <section className="space-y-6 border-b pb-8 md:pb-10">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">Client onboarding</p>
          <div className="space-y-3">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
              Start a serious project conversation with the right context from day one.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Share the essentials once. We&apos;ll review your request internally, structure it properly, and follow up with
              a thoughtful next step.
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {trustPoints.map((item) => (
            <div key={item.title} className="rounded-xl border bg-card px-4 py-4">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_360px] xl:items-start">
        <PublicIntakeForm />

        <Card className="border-border/70 bg-secondary/30">
          <CardHeader className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">What to expect</p>
              <CardTitle className="text-2xl">A practical first step, not a long intake marathon.</CardTitle>
            </div>
            <CardDescription>
              This form is designed to help us respond with more clarity and less back-and-forth.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {expectationBlocks.map((item) => (
              <div key={item.title} className="rounded-xl border bg-background px-4 py-4">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}

            <div className="rounded-xl border border-dashed bg-background px-4 py-4">
              <p className="text-sm font-medium">Timing</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Most teams complete this form in a few minutes. If you are still shaping the brief, a best estimate is completely fine.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-5">
        <div className="max-w-2xl space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">How the flow works</p>
          <h2 className="text-3xl font-semibold tracking-tight">A simple intake flow with a better internal handoff.</h2>
          <p className="text-muted-foreground">
            The goal is to make the first step easy for the client and immediately more useful for the team reviewing the request.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {flowSteps.map((item) => (
            <Card key={item.step}>
              <CardHeader className="space-y-3">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">{item.step}</p>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
