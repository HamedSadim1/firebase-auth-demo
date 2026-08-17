import React, { useState } from "react";
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
    w-full px-4 py-3 rounded-lg border bg-input text-text placeholder-muted-dim text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber/30 focus:border-amber caret-amber ${
      hasError
        ? "border-danger/60 focus:border-danger focus:ring-danger/30"
        : "border-panel-line"
    }
  `;

  const getLabelClasses = () => `
    block text-sm font-medium mb-2 text-muted
  `;

  const getButtonClasses = (variant: "primary" | "secondary" = "primary") => {
    const baseClasses =
      "w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-60 disabled:cursor-not-allowed";
    if (variant === "secondary") {
      return `${baseClasses} bg-panel text-text border border-panel-line hover:bg-panel-line/30`;
    }
    return `${baseClasses} bg-linear-to-r from-amber to-amber-dark text-[#14100a] hover:-translate-y-0.5 shadow-lg shadow-amber/20`;
  };

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormState((prev) => ({
      ...prev,
      email: value,
      emailError:
        value && !validateEmail(value) ? "Voer een geldig e-mailadres in" : "",
    }));
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormState((prev) => ({
      ...prev,
      password: value,
      passwordError:
        value && !validatePassword(value)
          ? "Wachtwoord moet minstens 6 tekens bevatten"
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
    <div
      className="min-h-screen bg-bg flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px),
          radial-gradient(circle at 15% 10%, rgba(245,166,35,0.07), transparent 40%),
          radial-gradient(circle at 85% 90%, rgba(42,217,197,0.05), transparent 45%)
        `,
        backgroundSize: "42px 42px, 42px 42px, 100% 100%, 100% 100%",
      }}
    >
      <DarkModeToggle />

      <div className="relative w-full max-w-[960px] overflow-hidden rounded-2xl shadow-2xl border border-panel-line bg-panel grid grid-cols-1 md:grid-cols-2 animate-fade-in-up">
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
