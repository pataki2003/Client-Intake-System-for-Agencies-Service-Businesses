import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type InfoTileProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  variant?: "default" | "muted" | "accent" | "highlight";
};

const variantStyles = {
  default: "border-border/75 bg-background shadow-sm",
  muted: "border-border/75 bg-muted/45 shadow-sm",
  accent: "border-border/75 bg-muted/35 shadow-sm",
  highlight: "border-primary/20 bg-background shadow-[0_20px_36px_-28px_rgba(15,23,42,0.28)]"
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
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{eyebrow}</p>
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
