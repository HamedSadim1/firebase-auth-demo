import React from "react";
import { WarningIcon } from "./index";

interface ErrorMessageProps {
  error: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="mb-6 p-4 border rounded-xl animate-in slide-in-from-top-2 duration-300 bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/30">
      <div className="flex items-start">
        <WarningIcon className="w-5 h-5 mr-3 mt-0.5 shrink-0 text-rose-500 dark:text-rose-400" />
        <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
          {error}
        </p>
      </div>
    </div>
  );
};
