import { cn } from "@/lib/cn";

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

export const focusRingInline =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber";

export const getInputClasses = (hasError = false): string =>
  cn(
    "w-full px-4 py-3 rounded-lg border bg-input text-text placeholder-muted-dim text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber/30 focus:border-amber caret-amber",
    hasError
      ? "border-danger/60 focus:border-danger focus:ring-danger/30"
      : "border-panel-line",
  );

export const getLabelClasses = (): string =>
  "block text-sm font-medium mb-2 text-muted";

export const getButtonClasses = (
  variant: "primary" | "secondary" = "primary",
): string => {
  const baseClasses = cn(
    "w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200",
    focusRing,
    "disabled:opacity-60 disabled:cursor-not-allowed",
  );
  if (variant === "secondary") {
    return cn(
      baseClasses,
      "bg-panel text-text border border-panel-line hover:bg-panel-line/30",
    );
  }
  return cn(
    baseClasses,
    "bg-linear-to-r from-amber to-amber-dark text-on-amber hover:-translate-y-0.5 shadow-lg shadow-amber/20",
  );
};
