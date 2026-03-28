import type { ReactNode } from "react";

import { SectionHeader } from "@/components/shared/section-header";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <section className="rounded-[28px] border border-border/80 bg-background px-5 py-5 shadow-sm sm:px-6 sm:py-6 md:px-8 md:py-7">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={actions}
        titleClassName="text-2xl sm:text-3xl md:text-4xl"
      />
    </section>
  );
}
