import { cn } from "@/lib/utils";

type LoadingIndicatorProps = {
  label?: string;
  announce?: boolean;
  size?: "sm" | "md";
  className?: string;
  spinnerClassName?: string;
  textClassName?: string;
};

export function LoadingIndicator({
  label,
  announce = false,
  size = "md",
  className,
  spinnerClassName,
  textClassName
}: LoadingIndicatorProps) {
  const spinnerSizeClass = size === "sm" ? "h-3.5 w-3.5 border-[1.5px]" : "h-4 w-4 border-2";

  return (
    <span
      className={cn("inline-flex items-center gap-2", className)}
      {...(announce ? { role: "status", "aria-live": "polite" as const } : {})}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block shrink-0 animate-spin rounded-full border-current border-r-transparent",
          spinnerSizeClass,
          spinnerClassName
        )}
      />
      {label ? (
        <span className={cn("text-sm font-medium", textClassName)}>{label}</span>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </span>
  );
}
