import React from "react";
import {
  CheckIcon,
  WarningIcon,
  EyeOpenIcon,
  EyeClosedIcon,
  ArrowRightIcon,
} from "../svg/index";
import { Spinner } from "./index";
import { GoogleSignInButton } from "./GoogleSignInButton";
import {
  focusRingInline,
  getButtonClasses,
  getInputClasses,
  getLabelClasses,
} from "../lib/styles";
import { FormState } from "../lib/types";

interface AuthFormProps {
  formState: FormState;
  isSignUp: boolean;
  loading: boolean;
  resetLoading: boolean;
  googleLoading: boolean;
  busy: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailBlur: () => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordBlur: () => void;
  onTogglePassword: () => void;
  onRememberMeChange: (checked: boolean) => void;
  onToggleSignUp: () => void;
  onForgotPassword: () => void;
  onGoogleSignIn: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  formState,
  isSignUp,
  loading,
  resetLoading,
  googleLoading,
  busy,
  onEmailChange,
  onEmailBlur,
  onPasswordChange,
  onPasswordBlur,
  onTogglePassword,
  onRememberMeChange,
  onToggleSignUp,
  onForgotPassword,
  onGoogleSignIn,
  onSubmit,
}) => {
  const showEmailError = formState.emailTouched && !!formState.emailError;
  const showPasswordError =
    formState.passwordTouched && !!formState.passwordError;

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="email" className={getLabelClasses()}>
            E-mailadres
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              value={formState.email}
              onChange={onEmailChange}
              onBlur={onEmailBlur}
              aria-invalid={showEmailError}
              aria-describedby={showEmailError ? "email-error" : undefined}
              className={getInputClasses(showEmailError)}
              placeholder="jij@voorbeeld.com"
            />
            <div className="absolute right-3 top-3.5">
              {formState.email && !formState.emailError && (
                <CheckIcon className="w-5 h-5 text-teal" />
              )}
            </div>
          </div>
          {showEmailError && (
            <p
              id="email-error"
              className="mt-1 text-sm text-danger flex items-center"
            >
              <WarningIcon className="w-4 h-4 mr-1" />
              {formState.emailError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className={getLabelClasses()}>
            Wachtwoord
          </label>
          <div className="relative">
            <input
              type={formState.showPassword ? "text" : "password"}
              id="password"
              value={formState.password}
              onChange={onPasswordChange}
              onBlur={onPasswordBlur}
              aria-invalid={showPasswordError}
              aria-describedby={
                showPasswordError ? "password-error" : undefined
              }
              className={`${getInputClasses(showPasswordError)} pr-12`}
              placeholder="Voer je wachtwoord in"
            />
            <button
              type="button"
              onClick={onTogglePassword}
              aria-label={
                formState.showPassword
                  ? "Verberg wachtwoord"
                  : "Toon wachtwoord"
              }
              className={`absolute right-3 top-3.5 rounded transition-all duration-200 text-muted-dim hover:text-muted hover:scale-110 active:scale-95 ${focusRingInline}`}
            >
              {formState.showPassword ? (
                <EyeClosedIcon className="w-5 h-5" />
              ) : (
                <EyeOpenIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          {showPasswordError && (
            <p
              id="password-error"
              className="mt-1 text-sm text-danger flex items-center"
            >
              <WarningIcon className="w-4 h-4 mr-1" />
              {formState.passwordError}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <label
            htmlFor="remember-me"
            className="flex items-center cursor-pointer"
          >
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={formState.rememberMe}
              onChange={(e) => onRememberMeChange(e.target.checked)}
              className="h-4 w-4 rounded accent-amber focus-visible:ring-amber bg-input border-panel-line"
            />
            <span className="ml-2 text-sm text-muted">Onthoud mij</span>
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            disabled={busy}
            className={`text-sm font-medium text-amber hover:text-amber/80 transition-colors duration-200 hover:underline underline-offset-4 ${focusRingInline} rounded disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {resetLoading ? "Versturen..." : "Wachtwoord vergeten?"}
          </button>
        </div>

        <button type="submit" disabled={busy} className={getButtonClasses()}>
          {loading ? (
            <div className="flex items-center justify-center">
              <Spinner className="border-on-amber mr-2" />
              Bezig...
            </div>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <ArrowRightIcon className="w-5 h-5" />
              {isSignUp ? "Registreren" : "Inloggen"}
            </span>
          )}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-panel-line" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 bg-panel font-mono text-xs text-muted-dim">
            of ga verder met
          </span>
        </div>
      </div>

      <GoogleSignInButton
        onClick={onGoogleSignIn}
        loading={googleLoading}
        busy={busy}
      />

      <div className="text-center text-sm text-muted">
        {isSignUp ? "Heb je al een account? " : "Nog geen account? "}
        <button
          onClick={onToggleSignUp}
          className={`font-medium text-teal hover:text-teal/80 hover:underline underline-offset-4 transition-colors duration-200 ${focusRingInline} rounded`}
        >
          {isSignUp ? "Log in" : "Registreer je"}
        </button>
      </div>
    </div>
  );
};
