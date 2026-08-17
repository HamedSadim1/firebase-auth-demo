import React, { useState } from "react";
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
  const [avatarError, setAvatarError] = useState(false);

  return (
    <div className="text-center">
      <div className="mb-8">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full mx-auto p-1 bg-linear-to-r from-amber to-amber-dark shadow-amber/25 shadow-2xl">
            <div className="w-full h-full rounded-full overflow-hidden bg-panel flex items-center justify-center">
              {photoUrl && !avatarError ? (
                <img
                  src={photoUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <UserIcon className="w-12 h-12 text-muted" />
              )}
            </div>
          </div>
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight mb-2 text-text">
          Welkom terug!
        </h1>
        <p className="text-lg mb-6 text-muted">{name}</p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-teal/15 text-teal border border-teal/30">
          <CheckIcon className="w-3.5 h-3.5" />
          Succesvol ingelogd
        </div>
      </div>

      {/* File Upload Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-text">Profielfoto</h2>
        <FileUpload
          onUploadComplete={onPhotoUpload}
          currentPhotoUrl={photoUrl}
        />
      </div>

      <button
        onClick={onSignOut}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-lg border border-panel-line bg-transparent px-4 py-3 text-sm font-medium text-muted hover:border-danger/40 hover:text-danger hover:bg-danger/5 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
            Bezig met afmelden...
          </div>
        ) : (
          <span className="flex items-center justify-center">
            <SignOutIcon className="w-5 h-5 mr-2" />
            Afmelden
          </span>
        )}
      </button>
    </div>
  );
};
