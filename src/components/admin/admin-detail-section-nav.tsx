import { cn } from "@/lib/utils";

type AdminDetailSectionNavProps = {
  items: Array<{
    id: string;
    label: string;
  }>;
};

export function AdminDetailSectionNav({ items }: AdminDetailSectionNavProps) {
  return (
    <nav aria-label="Intake detail sections" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={cn(
            "whitespace-nowrap rounded-full border bg-background px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
