import React from "react";
import { UserIcon, CheckIcon, SignOutIcon, FileUpload } from "./index";

interface UserProfileProps {
  name: string;
  photoUrl: string;
  onSignOut: () => void;
  onPhotoUpload: (url: string) => void;
  loading: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  name,
  photoUrl,
  onSignOut,
  onPhotoUpload,
  loading,
}) => {
  return (
    <div className="text-center">
      <div className="mb-8">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all duration-500 bg-linear-to-r from-emerald-500 to-teal-600 shadow-emerald-500/30 shadow-2xl">
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
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center bg-emerald-500">
            <CheckIcon className="w-4 h-4 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2 transition-colors duration-300 text-slate-800 dark:text-white">
          Welcome back!
        </h2>
        <p className="text-lg mb-6 transition-colors duration-300 text-slate-600 dark:text-slate-300">
          {name}
        </p>
        <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
          ✓ Successfully signed in
        </div>
      </div>

      {/* File Upload Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 transition-colors duration-300 text-slate-800 dark:text-white">
          Profile Picture
        </h3>
        <FileUpload
          onUploadComplete={onPhotoUpload}
          currentPhotoUrl={photoUrl}
        />
      </div>

      <button
        onClick={onSignOut}
        disabled={loading}
        className="w-full bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg shadow-rose-600/25 hover:shadow-rose-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 active:scale-[0.98]"
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
