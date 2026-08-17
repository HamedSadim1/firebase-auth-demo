import React, { useEffect, useState } from "react";
import { auth } from "./firebaseConfig";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";

import {
  BrandPanel,
  ErrorMessage,
  DarkModeToggle,
  Header,
  AuthForm,
  GoogleSignInButton,
  UserProfile,
} from "./components/index";

function App() {
  // Group related state into objects for better organization
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    emailError: "",
    passwordError: "",
    showPassword: false,
    rememberMe: false,
  });

  const [authState, setAuthState] = useState({
    name: "",
    photoUrl: "",
    loading: false,
    error: "",
    isSignUp: false,
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // DRY: Helper functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const getUserDisplayName = (user: User): string => {
    return user.displayName ?? user.email ?? "";
  };

  const clearForm = () => {
    setFormState((prev) => ({ ...prev, email: "", password: "" }));
  };

  const handleAsyncOperation = async (operation: () => Promise<void>) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      await operation();
    } catch (error: unknown) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setAuthState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
    } finally {
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  };

  // DRY: Styling constants
  const getInputClasses = (hasError = false) => `
    w-full px-4 py-3 rounded-xl border text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 bg-white border-slate-300 text-slate-900 placeholder-slate-400 dark:bg-slate-800/60 dark:border-slate-600 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-800 ${
      hasError
        ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/30 dark:border-rose-500"
        : "focus:border-indigo-500 focus:ring-indigo-500/30 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/30"
    }
  `;

  const getLabelClasses = () => `
    block text-sm font-medium mb-2 transition-colors duration-200 text-slate-700 dark:text-slate-200
  `;

  const getButtonClasses = (variant: "primary" | "secondary" = "primary") => {
    const baseClasses =
      "w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]";
    if (variant === "secondary") {
      return `${baseClasses} bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 focus-visible:ring-indigo-500 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 dark:hover:bg-slate-700 dark:hover:border-slate-500 dark:focus-visible:ring-indigo-400`;
    }
    return `${baseClasses} bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-500 shadow-lg shadow-indigo-600/25 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:ring-indigo-400 dark:shadow-indigo-500/20`;
  };

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormState((prev) => ({
      ...prev,
      email: value,
      emailError:
        value && !validateEmail(value)
          ? "Please enter a valid email address"
          : "",
    }));
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormState((prev) => ({
      ...prev,
      password: value,
      passwordError:
        value && !validatePassword(value)
          ? "Password must be at least 6 characters"
          : "",
    }));
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAsyncOperation(async () => {
      if (authState.isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formState.email,
          formState.password,
        );
        setAuthState((prev) => ({
          ...prev,
          name: getUserDisplayName(userCredential.user),
          photoUrl: "",
        }));
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formState.email,
          formState.password,
        );
        setAuthState((prev) => ({
          ...prev,
          name: getUserDisplayName(userCredential.user),
        }));
      }
    });
  };
  const signIn = async () => {
    await handleAsyncOperation(async () => {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setAuthState((prev) => ({
        ...prev,
        name: getUserDisplayName(user),
        photoUrl: user.photoURL ?? "",
      }));
      clearForm();
    });
  };

  const signOutUser = async () => {
    await handleAsyncOperation(async () => {
      await signOut(auth);
      setAuthState((prev) => ({
        ...prev,
        name: "",
        photoUrl: "",
        error: "",
      }));
      clearForm();
    });
  };

  const handlePhotoUpload = (url: string) => {
    setAuthState((prev) => ({
      ...prev,
      photoUrl: url,
    }));
  };

  return (
    <div className="min-h-screen transition-colors duration-500 bg-linear-to-br from-slate-50 via-indigo-50/70 to-violet-100 dark:from-slate-950 dark:via-indigo-950 dark:to-violet-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-violet-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-fuchsia-400 rounded-full blur-3xl"></div>
      </div>

      <DarkModeToggle onToggle={() => setIsDarkMode((prev) => !prev)} />

      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl border grid lg:grid-cols-2 transition-colors duration-300 bg-white/90 border-slate-200/50 shadow-slate-300/40 dark:bg-slate-900/90 dark:border-slate-700/50 dark:shadow-slate-950/50">
        <BrandPanel />

        <div className="p-6 sm:p-10">
          <Header isSignUp={authState.isSignUp} />

          <ErrorMessage error={authState.error} />

          {!authState.name ? (
            <>
              <AuthForm
                formState={formState}
                authState={authState}
                onEmailChange={handleEmail}
                onPasswordChange={handlePassword}
                onTogglePassword={() =>
                  setFormState((prev) => ({
                    ...prev,
                    showPassword: !prev.showPassword,
                  }))
                }
                onRememberMeChange={(checked) =>
                  setFormState((prev) => ({ ...prev, rememberMe: checked }))
                }
                onToggleSignUp={() =>
                  setAuthState((prev) => ({
                    ...prev,
                    isSignUp: !prev.isSignUp,
                  }))
                }
                onSubmit={(e) => void handleEmailAuth(e)}
                getInputClasses={getInputClasses}
                getLabelClasses={getLabelClasses}
                getButtonClasses={getButtonClasses}
              />

              <div className="mt-6">
                <GoogleSignInButton
                  onClick={() => void signIn()}
                  loading={authState.loading}
                  getButtonClasses={getButtonClasses}
                />
              </div>
            </>
          ) : (
            <UserProfile
              name={authState.name}
              photoUrl={authState.photoUrl}
              onSignOut={() => void signOutUser()}
              onPhotoUpload={handlePhotoUpload}
              loading={authState.loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
