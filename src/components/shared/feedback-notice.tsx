import type { ReactNode } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type FeedbackNoticeProps = {
  tone?: "error" | "info" | "success";
  title?: string;
  description: ReactNode;
  className?: string;
};

const toneStyles = {
  error: {
    variant: "destructive" as const,
    className: "border-destructive/20 bg-destructive/[0.05] text-foreground shadow-sm",
    titleClassName: "text-destructive"
  },
  info: {
    variant: "default" as const,
    className: "border-border/70 bg-surface-cool text-foreground shadow-sm",
    titleClassName: "text-foreground"
  },
  success: {
    variant: "default" as const,
    className: "border-primary/15 bg-primary/5 text-foreground shadow-sm",
    titleClassName: "text-foreground"
  }
};

export function FeedbackNotice({
  tone = "info",
  title,
  description,
  className
}: FeedbackNoticeProps) {
  const styles = toneStyles[tone];

  return (
    <Alert variant={styles.variant} className={cn("rounded-2xl px-4 py-3.5", styles.className, className)}>
      {title ? <AlertTitle className={cn("text-sm font-semibold", styles.titleClassName)}>{title}</AlertTitle> : null}
      <AlertDescription className="text-sm leading-6 text-muted-foreground">{description}</AlertDescription>
    </Alert>
  );
}
