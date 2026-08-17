import React from "react";
import {
  CheckIcon,
  WarningIcon,
  EyeOpenIcon,
  EyeClosedIcon,
  SignInIcon,
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
  isDarkMode: boolean;
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
  isDarkMode,
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
    <div className="px-8 pb-8 space-y-6">
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className={getLabelClasses()}>
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              value={formState.email}
              onChange={onEmailChange}
              required
              className={getInputClasses(!!formState.emailError)}
              placeholder="Enter your email"
            />
            <div className="absolute right-3 top-3.5">
              {formState.email && !formState.emailError && (
                <CheckIcon className="w-5 h-5 text-green-500" />
              )}
            </div>
          </div>
          {formState.emailError && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <WarningIcon className="w-4 h-4 mr-1" />
              {formState.emailError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className={getLabelClasses()}>
            Password
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
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className={`absolute right-3 top-3.5 transition-colors duration-200 ${
                isDarkMode
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {formState.showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
            </button>
          </div>
          {formState.passwordError && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <WarningIcon className="w-4 h-4 mr-1" />
              {formState.passwordError}
            </p>
          )}
        </div>

        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={formState.rememberMe}
            onChange={(e) => onRememberMeChange(e.target.checked)}
            className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
              isDarkMode ? "bg-gray-800 border-gray-600" : ""
            }`}
          />
          <label
            htmlFor="remember-me"
            className={`ml-2 block text-sm transition-colors duration-300 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Remember me
          </label>
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
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            <span className="flex items-center justify-center">
              <SignInIcon className="w-5 h-5 mr-2" />
              {authState.isSignUp ? "Create Account" : "Sign In"}
            </span>
          )}
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={onToggleSignUp}
          className={`text-sm font-medium transition-colors duration-300 ${
            isDarkMode
              ? "text-blue-400 hover:text-blue-300"
              : "text-blue-600 hover:text-blue-800"
          }`}
        >
          {authState.isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div
            className={`w-full border-t ${
              isDarkMode ? "border-gray-600" : "border-gray-300"
            }`}
          />
        </div>
        <div className="relative flex justify-center text-sm">
          <span
            className={`px-4 ${
              isDarkMode
                ? "bg-gray-900 text-gray-400"
                : "bg-white text-gray-500"
            }`}
          >
            Or continue with
          </span>
        </div>
      </div>
    </div>
  );
};
