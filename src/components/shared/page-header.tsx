import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <section className="flex flex-col gap-5 border-b pb-7 md:flex-row md:items-end md:justify-between md:pb-8">
      <div className="max-w-3xl space-y-3">
        {eyebrow ? (
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">{description}</p>
        </div>
      </div>

      {actions ? <div className="shrink-0 md:pb-1">{actions}</div> : null}
    </section>
  );
}
