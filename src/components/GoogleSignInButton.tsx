import React from "react";
import { GoogleLogo } from "./index";
import { getButtonClasses } from "../lib/styles";

interface GoogleSignInButtonProps {
  onClick: () => void;
  loading: boolean;
  busy: boolean;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onClick,
  loading,
  busy,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      aria-label="Doorgaan met Google"
      aria-busy={loading}
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
