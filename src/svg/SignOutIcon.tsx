import React from "react";
import { IconProps, Svg } from "@/svg/Icon";

export const SignOutIcon: React.FC<IconProps> = ({ className }) => (
  <Svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m-4 4h14m0 0v-2a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-2"
    />
  </Svg>
);
