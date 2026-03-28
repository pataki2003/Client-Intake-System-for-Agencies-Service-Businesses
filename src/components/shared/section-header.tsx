import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  contentClassName?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
  titleClassName,
  descriptionClassName,
  contentClassName
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className={cn("max-w-3xl space-y-1.5 sm:space-y-2", contentClassName)}>
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:text-sm">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-1.5 sm:space-y-2">
          <h2 className={cn("text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl", titleClassName)}>{title}</h2>
          {description ? (
            <div className={cn("max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base", descriptionClassName)}>
              {description}
            </div>
          ) : null}
        </div>
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
