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
  new: "border-sky-200 bg-sky-50 text-sky-700",
  reviewing: "border-amber-200 bg-amber-50 text-amber-700",
  brief_ready: "border-emerald-200 bg-emerald-50 text-emerald-700",
  contacted: "border-slate-200 bg-slate-100 text-slate-700",
  archived: "border-zinc-200 bg-zinc-100 text-zinc-600"
};

const statusDotClassNameMap: Record<IntakeStatus, string> = {
  new: "bg-sky-500",
  reviewing: "bg-amber-500",
  brief_ready: "bg-emerald-500",
  contacted: "bg-slate-500",
  archived: "bg-zinc-500"
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
        "gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.02em]",
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
