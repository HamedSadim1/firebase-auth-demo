import React from "react";
import { Spinner } from "@/components/ui/Spinner";

export const LoadingState: React.FC = () => (
  <div
    role="status"
    className="flex min-h-[360px] flex-col items-center justify-center gap-3 text-muted"
  >
    <Spinner size="lg" className="border-amber" />
    <span className="text-sm">Laden...</span>
  </div>
);
