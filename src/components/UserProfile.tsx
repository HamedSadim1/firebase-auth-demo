import React from "react";
import { UserIcon, CheckIcon, SignOutIcon, FileUpload } from "./index";

interface UserProfileProps {
  name: string;
  photoUrl: string;
  isDarkMode: boolean;
  onSignOut: () => void;
  onPhotoUpload: (url: string) => void;
  loading: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  name,
  photoUrl,
  isDarkMode,
  onSignOut,
  onPhotoUpload,
  loading,
}) => {
  return (
    <div className="px-8 pb-8 text-center">
      <div className="mb-8">
        <div className="relative mb-6">
          <div
            className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all duration-500 ${
              isDarkMode
                ? "bg-linear-to-r from-green-500 to-emerald-600 shadow-green-500/30"
                : "bg-linear-to-r from-green-500 to-emerald-600 shadow-green-500/30"
            } shadow-2xl`}
          >
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <UserIcon />
            )}
          </div>
          <div
            className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${
              isDarkMode ? "bg-green-500" : "bg-green-500"
            }`}
          >
            <CheckIcon className="w-4 h-4 text-white" />
          </div>
        </div>
        <h2
          className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Welcome back!
        </h2>
        <p
          className={`text-lg mb-6 transition-colors duration-300 ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {name}
        </p>
        <div
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            isDarkMode
              ? "bg-green-100 text-green-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          ✓ Successfully signed in
        </div>
      </div>

      {/* File Upload Section */}
      <div className="mb-8">
        <h3
          className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Profile Picture
        </h3>
        <FileUpload
          onUploadComplete={onPhotoUpload}
          currentPhotoUrl={photoUrl}
          isDarkMode={isDarkMode}
        />
      </div>

      <button
        onClick={onSignOut}
        disabled={loading}
        className="w-full bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Signing out...
          </div>
        ) : (
          <span className="flex items-center justify-center">
            <SignOutIcon className="w-5 h-5 mr-2" />
            Sign Out
          </span>
        )}
      </button>
    </div>
  );
};
