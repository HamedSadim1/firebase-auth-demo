import React from "react";

interface HeaderProps {
  isSignUp: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isSignUp }) => {
  return (
    <div className="mb-8">
      <h1 className="font-display text-2xl font-bold tracking-tight text-text">
        {isSignUp ? "Registreer je account" : "Log in op je account"}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {isSignUp
          ? "Vul je gegevens in om te beginnen"
          : "Welkom terug — vul je gegevens in om verder te gaan."}
      </p>
    </div>
  );
};
