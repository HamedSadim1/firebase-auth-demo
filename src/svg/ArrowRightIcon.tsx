import React from "react";

interface ArrowRightIconProps {
  className?: string;
}

export const ArrowRightIcon: React.FC<ArrowRightIconProps> = ({
  className = "w-5 h-5",
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.5 4.5 21 12l-7.5 7.5M21 12H3"
    />
  </svg>
);
