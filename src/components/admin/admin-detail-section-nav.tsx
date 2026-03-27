import { cn } from "@/lib/utils";

type AdminDetailSectionNavProps = {
  items: Array<{
    id: string;
    label: string;
  }>;
};

export function AdminDetailSectionNav({ items }: AdminDetailSectionNavProps) {
  return (
    <nav aria-label="Intake detail sections" className="flex flex-wrap gap-2">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={cn(
            "rounded-full border bg-background px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
