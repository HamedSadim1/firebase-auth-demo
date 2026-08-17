import React from "react";
import { WarningIcon, CheckIcon, IconProps } from "../../svg/index";
import { cn } from "../../lib/cn";

interface BannerProps {
  tone: "error" | "success";
  message: string;
}

interface ToneConfig {
  role: "alert" | "status";
  ariaLive?: "polite";
  Icon: React.FC<IconProps>;
  container: string;
  accent: string;
}

const TONES: Record<BannerProps["tone"], ToneConfig> = {
  error: {
    role: "alert",
    Icon: WarningIcon,
    container: "bg-danger/10 border-danger/30",
    accent: "text-danger",
  },
  success: {
    role: "status",
    ariaLive: "polite",
    Icon: CheckIcon,
    container: "bg-teal/10 border-teal/30",
    accent: "text-teal",
  },
};

export const Banner: React.FC<BannerProps> = ({ tone, message }) => {
  if (!message) return null;

  const { role, ariaLive, Icon, container, accent } = TONES[tone];

  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={cn("mb-6 p-4 border rounded-xl", container)}
    >
      <div className="flex items-start">
        <Icon className={cn("w-5 h-5 mr-3 mt-0.5 shrink-0", accent)} />
        <p className={cn("text-sm font-medium", accent)}>{message}</p>
      </div>
    </div>
  );
};
