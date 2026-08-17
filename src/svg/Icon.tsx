import React from "react";

export interface IconProps {
  className?: string;
}

export const Svg: React.FC<React.SVGProps<SVGSVGElement>> = ({
  children,
  ...rest
}) => (
  <svg {...rest} aria-hidden="true">
    {children}
  </svg>
);
