import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

const navigationItems = [
  { href: "/", label: "Home", variant: "ghost" as const },
  { href: "/start-project", label: "Start Project", variant: "ghost" as const },
  { href: "/admin", label: "Admin", variant: "outline" as const }
];

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container flex min-h-16 flex-col gap-4 py-4 md:min-h-[4.5rem] md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <Link href="/" className="text-lg font-semibold tracking-tight transition-colors hover:text-primary">
              Client Intake System
            </Link>
            <p className="text-sm text-muted-foreground">
              Structured intake and review for agencies and service teams
            </p>
          </div>

          <nav className="flex flex-wrap gap-2">
            {navigationItems.map((item) => (
              <Button key={item.href} asChild size="sm" variant={item.variant}>
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container py-8 md:py-10 lg:py-12">{children}</main>
    </div>
  );
}
