import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/start-project", label: "Start Project" },
  { href: "/login", label: "Login" },
  { href: "/admin", label: "Dashboard" }
];

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur">
        <div className="container flex min-h-16 flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Client Intake System
            </Link>
            <p className="text-sm text-muted-foreground">
              MVP scaffold for agencies and service businesses
            </p>
          </div>

          <nav className="flex flex-wrap gap-2">
            {navigationItems.map((item) => (
              <Button key={item.href} asChild size="sm" variant="ghost">
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container py-10">{children}</main>
    </div>
  );
}
