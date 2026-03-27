import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type InfoTileProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  variant?: "default" | "muted" | "accent";
};

const variantStyles = {
  default: "border-border/70 bg-background",
  muted: "border-border/70 bg-secondary/20",
  accent: "border-primary/10 bg-primary/[0.04]"
};

export function InfoTile({
  eyebrow,
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
  variant = "default"
}: InfoTileProps) {
  return (
    <div className={cn("rounded-2xl border p-4 sm:p-5", variantStyles[variant], className)}>
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{eyebrow}</p>
        ) : null}
        <div className="space-y-1.5">
          <div className={cn("text-sm font-semibold text-foreground sm:text-base", titleClassName)}>{title}</div>
          {description ? (
            <div className={cn("text-sm leading-6 text-muted-foreground", descriptionClassName)}>{description}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
