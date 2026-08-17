import React from "react";
import { FirebaseLogo, CheckIcon } from "./index";

interface HeaderProps {
  isDarkMode: boolean;
  isSignUp: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, isSignUp }) => {
  return (
    <div className="text-center pt-8 pb-6 px-8">
      <div className="relative mb-6">
        <div
          className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto transition-all duration-500 ${
            isDarkMode
              ? "bg-linear-to-br from-orange-400 to-red-500 shadow-orange-500/30"
              : "bg-linear-to-br from-orange-500 to-red-600 shadow-orange-500/30"
          } shadow-2xl`}
        >
          <FirebaseLogo />
        </div>
        <div
          className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${
            isDarkMode ? "bg-green-500" : "bg-green-500"
          }`}
        >
          <CheckIcon className="w-4 h-4 text-white" />
        </div>
      </div>
      <h1
        className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        {import.meta.env.VITE_APP_TITLE || "Firebase Auth Demo"}
      </h1>
      <p
        className={`transition-colors duration-300 ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        {isSignUp ? "Create your account" : "Welcome back! Please sign in"}
      </p>
    </div>
  );
};
