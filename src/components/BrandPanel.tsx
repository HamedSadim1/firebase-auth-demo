import React from "react";
import { FirebaseLogo, CheckIcon } from "./index";

const FEATURES = [
  "Sign in with Google or email",
  "Upload a profile photo",
  "Light & dark mode support",
];

export const BrandPanel: React.FC = () => {
  const appTitle = import.meta.env.VITE_APP_TITLE || "Firebase Auth Demo";

  return (
    <div className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden bg-linear-to-br from-indigo-600 via-indigo-600 to-violet-700 text-white">
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-2xl"></div>
      <div className="absolute -bottom-24 -left-12 w-64 h-64 rounded-full bg-violet-400/20 blur-3xl"></div>

      <div className="relative">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-linear-to-br from-orange-500 to-red-600 shadow-orange-500/30 text-white">
          <FirebaseLogo className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold">{appTitle}</h2>
        <p className="mt-3 text-indigo-100/90 leading-relaxed">
          A modern authentication demo built with React, Firebase and Tailwind
          CSS.
        </p>
      </div>

      <ul className="relative space-y-4">
        {FEATURES.map((feature) => (
          <li key={feature} className="flex items-center gap-3 text-indigo-100">
            <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <CheckIcon className="w-3.5 h-3.5" />
            </span>
            <span className="text-sm font-medium">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
