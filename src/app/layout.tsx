import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { getThemeInitScript } from "@/lib/theme";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Client Intake System",
    template: "%s | Client Intake System"
  },
  description: "Structured client intake and review workspace for agencies and service businesses."
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script id="theme-init" dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
