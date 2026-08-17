import React from "react";
import { WarningIcon } from "./index";

interface ErrorMessageProps {
  error: string;
  isDarkMode: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="mx-8 mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-start">
        <WarningIcon className="w-5 h-5 text-red-500 mr-3 mt-0.5 shrink-0" />
        <p className="text-red-700 text-sm font-medium">{error}</p>
      </div>
    </div>
  );
};
