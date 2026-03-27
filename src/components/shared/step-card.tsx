import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StepCardProps = {
  step: string;
  title: string;
  description: string;
  className?: string;
  variant?: "default" | "accent" | "muted";
};

const variantStyles = {
  default: "border-border/70 bg-card",
  accent: "border-primary/10 bg-primary/[0.04]",
  muted: "border-border/70 bg-secondary/20"
};

export function StepCard({
  step,
  title,
  description,
  className,
  variant = "default"
}: StepCardProps) {
  return (
    <Card className={cn("h-full overflow-hidden shadow-sm", variantStyles[variant], className)}>
      <CardHeader className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-background text-[11px] font-semibold tracking-[0.16em] text-muted-foreground sm:h-10 sm:w-10 sm:text-xs">
            {step}
          </div>
          <div className="h-px flex-1 bg-border/80" />
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
          <CardDescription className="leading-6">{description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
