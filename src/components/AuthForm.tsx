import React from "react";
import {
  CheckIcon,
  WarningIcon,
  EyeOpenIcon,
  EyeClosedIcon,
  ArrowRightIcon,
} from "./index";

interface FormState {
  email: string;
  password: string;
  emailError: string;
  passwordError: string;
  showPassword: boolean;
  rememberMe: boolean;
}

interface AuthState {
  loading: boolean;
  isSignUp: boolean;
}

interface AuthFormProps {
  formState: FormState;
  authState: AuthState;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
  onRememberMeChange: (checked: boolean) => void;
  onToggleSignUp: () => void;
  onSubmit: (e: React.FormEvent) => void;
  getInputClasses: (hasError?: boolean) => string;
  getLabelClasses: () => string;
  getButtonClasses: (variant?: "primary" | "secondary") => string;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  formState,
  authState,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onRememberMeChange,
  onToggleSignUp,
  onSubmit,
  getInputClasses,
  getLabelClasses,
  getButtonClasses,
}) => {
  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-5">
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
              required
              className={getInputClasses(!!formState.emailError)}
              placeholder="jij@voorbeeld.com"
            />
            <div className="absolute right-3 top-3.5">
              {formState.email && !formState.emailError && (
                <CheckIcon className="w-5 h-5 text-teal" />
              )}
            </div>
          </div>
          {formState.emailError && (
            <p className="mt-1 text-sm text-danger flex items-center">
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
              required
              minLength={6}
              className={`${getInputClasses(!!formState.passwordError)} pr-12`}
              placeholder="Voer je wachtwoord in"
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 top-3.5 transition-all duration-200 text-muted-dim hover:text-muted hover:scale-110 active:scale-95"
            >
              {formState.showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
            </button>
          </div>
          {formState.passwordError && (
            <p className="mt-1 text-sm text-danger flex items-center">
              <WarningIcon className="w-4 h-4 mr-1" />
              {formState.passwordError}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
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
              className="h-4 w-4 rounded accent-amber focus:ring-amber bg-input border-panel-line"
            />
            <span className="ml-2 text-sm text-muted">Onthoud mij</span>
          </label>
          <button
            type="button"
            className="text-sm font-medium text-amber hover:text-amber/80 transition-colors duration-200 hover:underline underline-offset-4"
          >
            Wachtwoord vergeten?
          </button>
        </div>

        <button
          type="submit"
          disabled={
            authState.loading ||
            !!formState.emailError ||
            !!formState.passwordError
          }
          className={getButtonClasses()}
        >
          {authState.loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#14100a] mr-2"></div>
              Bezig...
            </div>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <ArrowRightIcon className="w-5 h-5" />
              {authState.isSignUp ? "Registreren" : "Inloggen"}
            </span>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-muted">
        {authState.isSignUp ? "Heb je al een account? " : "Nog geen account? "}
        <button
          onClick={onToggleSignUp}
          className="font-medium text-teal hover:text-teal/80 hover:underline underline-offset-4 transition-colors duration-200"
        >
          {authState.isSignUp ? "Log in" : "Registreer je"}
        </button>
      </p>

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
    </div>
  );
};
