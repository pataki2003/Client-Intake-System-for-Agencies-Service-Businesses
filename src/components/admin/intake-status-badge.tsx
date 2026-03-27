import { Badge } from "@/components/ui/badge";
import { formatIntakeStatus } from "@/lib/intake/formatters";
import { cn } from "@/lib/utils";
import type { IntakeStatus } from "@/types";

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
};

export function IntakeStatusBadge({ status }: IntakeStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.02em]", statusClassNameMap[status])}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", statusDotClassNameMap[status])} aria-hidden="true" />
      {formatIntakeStatus(status)}
    </Badge>
  );
}
