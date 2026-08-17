import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-8 w-8",
} as const;

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  className = "",
}) => (
  <div
    aria-hidden="true"
    className={`animate-spin rounded-full border-b-2 ${SIZE_CLASSES[size]} ${className}`}
  />
);
