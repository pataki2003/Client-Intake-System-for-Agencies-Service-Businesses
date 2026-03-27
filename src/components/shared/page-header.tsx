import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <section className="flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl space-y-2">
        {eyebrow ? (
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-2">
          <h1>{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      {actions ? <div className="shrink-0">{actions}</div> : null}
    </section>
  );
}
