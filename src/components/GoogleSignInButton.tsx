import React from "react";
import { GoogleLogo } from "../svg/index";
import { Spinner } from "./index";
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
        <Spinner className="border-current" />
      ) : (
        <>
          <GoogleLogo className="w-6 h-6" />
          <span>Doorgaan met Google</span>
        </>
      )}
    </button>
  );
};
