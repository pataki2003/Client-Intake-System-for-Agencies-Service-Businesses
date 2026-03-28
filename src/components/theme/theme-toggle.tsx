"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { mounted, effectiveTheme, preference, toggleTheme } = useTheme();
  const nextTheme = effectiveTheme === "dark" ? "light" : "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      aria-label={mounted ? `Switch to ${nextTheme} theme` : "Toggle theme"}
      className="w-full justify-between gap-3 px-3 sm:w-auto sm:min-w-[132px]"
    >
      <span className="flex min-w-0 flex-col items-start leading-none">
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Theme</span>
        <span className="text-sm font-medium text-foreground">
          {mounted ? (effectiveTheme === "dark" ? "Dark" : "Light") : "Theme"}
        </span>
      </span>

      <span
        aria-hidden="true"
        className="relative flex h-5 w-9 shrink-0 items-center rounded-full border border-border bg-muted/70"
      >
        <span
          className={cn(
            "absolute h-3.5 w-3.5 rounded-full bg-foreground transition-transform duration-150",
            mounted ? (effectiveTheme === "dark" ? "translate-x-[18px] bg-primary" : "translate-x-[3px]") : "translate-x-[3px]"
          )}
        />
      </span>

      <span className="sr-only">
        {mounted
          ? `Current theme is ${effectiveTheme}. Preference is ${preference ?? "system"}.`
          : "Theme preference is loading."}
      </span>
    </Button>
  );
}
