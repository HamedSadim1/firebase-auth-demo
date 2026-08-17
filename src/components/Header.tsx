import React from "react";
import { FirebaseLogo } from "./index";

interface HeaderProps {
  isSignUp: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isSignUp }) => {
  const appTitle = import.meta.env.VITE_APP_TITLE || "Firebase Auth Demo";

  return (
    <div className="mb-8">
      <div className="lg:hidden flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-linear-to-br from-orange-500 to-red-600 shadow-orange-500/30 dark:from-orange-400 dark:to-red-500 text-white">
          <FirebaseLogo className="w-6 h-6" />
        </div>
        <span className="text-lg font-bold text-slate-800 dark:text-white">
          {appTitle}
        </span>
      </div>

      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
        {isSignUp ? "Create your account" : "Sign in to your account"}
      </h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        {isSignUp
          ? "Fill in your details to get started"
          : "Welcome back! Please enter your details"}
      </p>
    </div>
  );
};
