import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminDetailFieldProps = {
  label: string;
  value: ReactNode;
  helper?: ReactNode;
  className?: string;
  valueClassName?: string;
};

export function AdminDetailField({ label, value, helper, className, valueClassName }: AdminDetailFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <div className={cn("text-sm leading-6 text-foreground", valueClassName)}>{value}</div>
      {helper ? <p className="text-xs text-muted-foreground">{helper}</p> : null}
    </div>
  );
}
