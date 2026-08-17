import React from "react";

interface LightningIconProps {
  className?: string;
}

export const LightningIcon: React.FC<LightningIconProps> = ({
  className = "w-5 h-5",
}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
