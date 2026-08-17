import React from "react";
import { SunIcon, MoonIcon } from "./index";

interface DarkModeToggleProps {
  onToggle: () => void;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="absolute top-6 right-6 p-3 rounded-full backdrop-blur-sm border transition-all duration-200 shadow-md bg-white/70 border-slate-200 hover:bg-white dark:bg-slate-800/70 dark:border-slate-700 dark:hover:bg-slate-700"
      aria-label="Toggle dark mode"
    >
      <SunIcon className="w-5 h-5 text-amber-400 hidden dark:block" />
      <MoonIcon className="w-5 h-5 text-slate-600 dark:hidden" />
    </button>
  );
};
