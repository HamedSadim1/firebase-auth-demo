import React from "react";
import { GoogleLogo } from "./index";

interface GoogleSignInButtonProps {
  onClick: () => void;
  loading: boolean;
  getButtonClasses: (variant?: "primary" | "secondary") => string;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onClick,
  loading,
  getButtonClasses,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`${getButtonClasses(
        "secondary",
      )} flex items-center justify-center gap-3`}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
      ) : (
        <>
          <GoogleLogo />
          <span>Doorgaan met Google</span>
        </>
      )}
    </button>
  );
};
