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

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

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
    w-full pl-4 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
      isDarkMode
        ? `bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-800 ${
            hasError ? "border-red-400" : ""
          }`
        : `bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white ${
            hasError ? "border-red-300" : ""
          }`
    }
  `;

  const getLabelClasses = () => `
    block text-sm font-semibold mb-2 transition-colors duration-300 ${
      isDarkMode ? "text-gray-200" : "text-gray-700"
    }
  `;

  const getButtonClasses = (variant: "primary" | "secondary" = "primary") => {
    const baseClasses =
      "w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    if (variant === "secondary") {
      return `${baseClasses} ${
        isDarkMode
          ? "bg-gray-700 hover:bg-gray-600 text-gray-200 focus:ring-gray-500"
          : "bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500"
      }`;
    }
    return `${baseClasses} ${
      isDarkMode
        ? "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white focus:ring-blue-500 shadow-blue-500/25"
        : "bg-linear-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white focus:ring-blue-500 shadow-blue-500/25"
    } shadow-lg`;
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
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDarkMode
          ? "bg-linear-to-br from-gray-900 via-blue-900 to-indigo-900"
          : "bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50"
      } flex items-center justify-center p-4 relative overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500 rounded-full blur-3xl"></div>
      </div>

      <DarkModeToggle
        isDarkMode={isDarkMode}
        onToggle={() => setIsDarkMode(!isDarkMode)}
      />

      <div
        className={`relative backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full border transition-all duration-500 ${
          isDarkMode
            ? "bg-gray-900/90 border-gray-700/50 shadow-gray-900/50"
            : "bg-white/90 border-gray-200/50 shadow-gray-200/50"
        } hover:shadow-3xl transform hover:scale-[1.02] transition-all duration-300`}
      >
        <Header isDarkMode={isDarkMode} isSignUp={authState.isSignUp} />

        <ErrorMessage error={authState.error} isDarkMode={isDarkMode} />

        {!authState.name ? (
          <>
            <AuthForm
              formState={formState}
              authState={authState}
              isDarkMode={isDarkMode}
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

            <div className="px-8 pb-8">
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
            isDarkMode={isDarkMode}
            onSignOut={() => void signOutUser()}
            onPhotoUpload={handlePhotoUpload}
            loading={authState.loading}
          />
        )}
      </div>
    </div>
  );
}

export default App;
