import React from "react";
import { WarningIcon } from "./index";

interface ErrorMessageProps {
  error: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="mb-6 p-4 border rounded-xl bg-danger/10 border-danger/30">
      <div className="flex items-start">
        <WarningIcon className="w-5 h-5 mr-3 mt-0.5 shrink-0 text-danger" />
        <p className="text-sm font-medium text-danger">{error}</p>
      </div>
    </div>
  );
};
