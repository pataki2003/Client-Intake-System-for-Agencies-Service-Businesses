import { Badge } from "@/components/ui/badge";
import {
  formatBudgetRange,
  formatDateTime,
  formatIntakeStatus,
  formatProjectTimeline,
  formatRelativeTimeToNow
} from "@/lib/intake/formatters";
import { cn } from "@/lib/utils";
import type { BudgetRange, IntakeStatus, ProjectTimeline } from "@/types";

const statusClassNameMap: Record<IntakeStatus, string> = {
  new: "border-[hsl(var(--status-new-border))] bg-[hsl(var(--status-new-bg))] text-[hsl(var(--status-new-foreground))]",
  reviewing:
    "border-[hsl(var(--status-reviewing-border))] bg-[hsl(var(--status-reviewing-bg))] text-[hsl(var(--status-reviewing-foreground))]",
  brief_ready:
    "border-[hsl(var(--status-brief-ready-border))] bg-[hsl(var(--status-brief-ready-bg))] text-[hsl(var(--status-brief-ready-foreground))]",
  contacted:
    "border-[hsl(var(--status-contacted-border))] bg-[hsl(var(--status-contacted-bg))] text-[hsl(var(--status-contacted-foreground))]",
  archived:
    "border-[hsl(var(--status-archived-border))] bg-[hsl(var(--status-archived-bg))] text-[hsl(var(--status-archived-foreground))]"
};

const statusDotClassNameMap: Record<IntakeStatus, string> = {
  new: "bg-[hsl(var(--status-new-dot))]",
  reviewing: "bg-[hsl(var(--status-reviewing-dot))]",
  brief_ready: "bg-[hsl(var(--status-brief-ready-dot))]",
  contacted: "bg-[hsl(var(--status-contacted-dot))]",
  archived: "bg-[hsl(var(--status-archived-dot))]"
};

type IntakeStatusBadgeProps = {
  status: IntakeStatus;
  className?: string;
};

export function IntakeStatusBadge({ status, className }: IntakeStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.02em] shadow-sm",
        statusClassNameMap[status],
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", statusDotClassNameMap[status])} aria-hidden="true" />
      {formatIntakeStatus(status)}
    </Badge>
  );
}

type FormattedBudgetRangeProps = {
  value: BudgetRange | null;
  className?: string;
  fallback?: string;
  fallbackClassName?: string;
};

export function FormattedBudgetRange({
  value,
  className,
  fallback = "Not provided",
  fallbackClassName
}: FormattedBudgetRangeProps) {
  if (!value) {
    return <span className={cn("text-muted-foreground", fallbackClassName ?? className)}>{fallback}</span>;
  }

  return <span className={className}>{formatBudgetRange(value)}</span>;
}

type FormattedTimelineProps = {
  value: ProjectTimeline | null;
  className?: string;
  fallback?: string;
  fallbackClassName?: string;
};

export function FormattedTimeline({
  value,
  className,
  fallback = "Not set",
  fallbackClassName
}: FormattedTimelineProps) {
  if (!value) {
    return <span className={cn("text-muted-foreground", fallbackClassName ?? className)}>{fallback}</span>;
  }

  return <span className={className}>{formatProjectTimeline(value)}</span>;
}

type FormattedDateTimeProps = {
  value: string | null;
  className?: string;
  valueClassName?: string;
  relativeClassName?: string;
  fallback?: string;
  fallbackClassName?: string;
  showRelative?: boolean;
};

export function FormattedDateTime({
  value,
  className,
  valueClassName,
  relativeClassName,
  fallback = "Not set",
  fallbackClassName,
  showRelative = false
}: FormattedDateTimeProps) {
  if (!value) {
    return <span className={cn("text-muted-foreground", fallbackClassName ?? className)}>{fallback}</span>;
  }

  const absoluteValue = formatDateTime(value);

  if (!showRelative) {
    return <span className={cn(valueClassName ?? className)}>{absoluteValue}</span>;
  }

  const relativeValue = formatRelativeTimeToNow(value);
  const shouldShowRelative = relativeValue !== value;

  return (
    <div className={cn("space-y-1", className)}>
      <p className={cn("text-sm", valueClassName)}>{absoluteValue}</p>
      {shouldShowRelative ? (
        <p className={cn("text-xs text-muted-foreground", relativeClassName)}>{relativeValue}</p>
      ) : null}
    </div>
  );
}
