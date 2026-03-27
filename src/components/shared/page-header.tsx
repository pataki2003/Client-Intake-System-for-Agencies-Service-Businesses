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
    <section className="border-b pb-6 md:pb-8">
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
