import React, { useEffect, useState } from "react";
import { auth } from "./firebaseConfig";
import { FirebaseError } from "firebase/app";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  User,
} from "firebase/auth";

import {
  BrandPanel,
  CheckIcon,
  ErrorMessage,
  Header,
  AuthForm,
  GoogleSignInButton,
  UserProfile,
} from "./components/index";

type LoadingAction = "email" | "google" | "reset" | "signout" | null;

const getUserDisplayName = (user: User): string => {
  return user.displayName ?? user.email ?? "Gebruiker";
};

const getErrorMessage = (error: unknown): string => {
  const code = error instanceof FirebaseError ? error.code : "";
  switch (code) {
    case "auth/invalid-credential":
      return "Ongeldige inloggegevens. Controleer je e-mailadres en wachtwoord.";
    case "auth/invalid-email":
      return "Ongeldig e-mailadres.";
    case "auth/user-not-found":
      return "Geen account gevonden met dit e-mailadres.";
    case "auth/wrong-password":
      return "Onjuist wachtwoord.";
    case "auth/email-already-in-use":
      return "Er bestaat al een account met dit e-mailadres.";
    case "auth/weak-password":
      return "Wachtwoord is te zwak. Gebruik minstens 6 tekens.";
    case "auth/user-disabled":
      return "Dit account is uitgeschakeld.";
    case "auth/too-many-requests":
      return "Te veel pogingen. Probeer het later opnieuw.";
    case "auth/network-request-failed":
      return "Geen netwerkverbinding. Controleer je verbinding en probeer opnieuw.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Aanmelden geannuleerd.";
    case "auth/operation-not-allowed":
      return "Deze aanmeldmethode is niet ingeschakeld.";
    case "auth/requires-recent-login":
      return "Log opnieuw in om deze actie uit te voeren.";
    case "auth/account-exists-with-different-credential":
      return "Er bestaat al een account met een andere aanmeldmethode.";
    default:
      return "Er is iets misgegaan. Probeer het opnieuw.";
  }
};

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
    error: "",
    isSignUp: false,
  });

  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);

  const [resetMessage, setResetMessage] = useState("");
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthState((prev) => ({
          ...prev,
          name: getUserDisplayName(user),
          photoUrl: user.photoURL ?? "",
        }));
      } else {
        setAuthState((prev) => ({
          ...prev,
          name: "",
          photoUrl: "",
        }));
      }
      setAuthInitialized(true);
    });
    return unsubscribe;
  }, []);

  // DRY: Helper functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const clearForm = () => {
    setFormState((prev) => ({
      ...prev,
      email: "",
      password: "",
      emailError: "",
      passwordError: "",
      showPassword: false,
    }));
  };

  const applyPersistence = async () => {
    await setPersistence(
      auth,
      formState.rememberMe
        ? browserLocalPersistence
        : browserSessionPersistence,
    );
  };

  const handleAsyncOperation = async (
    action: Exclude<LoadingAction, null>,
    operation: () => Promise<void>,
  ) => {
    setLoadingAction(action);
    setAuthState((prev) => ({ ...prev, error: "" }));
    try {
      await operation();
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = getErrorMessage(error);
      setAuthState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
    } finally {
      setLoadingAction(null);
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
    setResetMessage("");
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
    await handleAsyncOperation("email", async () => {
      await applyPersistence();
      if (authState.isSignUp) {
        await createUserWithEmailAndPassword(
          auth,
          formState.email,
          formState.password,
        );
      } else {
        await signInWithEmailAndPassword(
          auth,
          formState.email,
          formState.password,
        );
      }
    });
  };
  const signIn = async () => {
    await handleAsyncOperation("google", async () => {
      await applyPersistence();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      clearForm();
    });
  };

  const signOutUser = async () => {
    await handleAsyncOperation("signout", async () => {
      await signOut(auth);
      setAuthState((prev) => ({ ...prev, error: "" }));
      setResetMessage("");
      clearForm();
    });
  };

  const handleForgotPassword = async () => {
    const email = formState.email.trim();
    setResetMessage("");
    if (!validateEmail(email)) {
      setAuthState((prev) => ({
        ...prev,
        error: "Voer eerst een geldig e-mailadres in",
      }));
      return;
    }
    await handleAsyncOperation("reset", async () => {
      await sendPasswordResetEmail(auth, email);
      setResetMessage(
        `Er is een reset-link verstuurd naar ${email}. Check je inbox.`,
      );
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
      <div className="relative w-full max-w-[960px] overflow-hidden rounded-2xl shadow-2xl border border-panel-line bg-panel grid grid-cols-1 md:grid-cols-2 animate-fade-in-up">
        <BrandPanel />

        <div className="p-6 sm:p-10">
          {!authInitialized ? (
            <div
              role="status"
              className="flex min-h-[360px] flex-col items-center justify-center gap-3 text-muted"
            >
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-amber"></div>
              <span className="text-sm">Laden...</span>
            </div>
          ) : (
            <>
              <Header isSignUp={authState.isSignUp} />

              <ErrorMessage error={authState.error} />

              {resetMessage && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mb-6 p-4 border rounded-xl bg-teal/10 border-teal/30"
                >
                  <div className="flex items-start">
                    <CheckIcon className="w-5 h-5 mr-3 mt-0.5 shrink-0 text-teal" />
                    <p className="text-sm font-medium text-teal">
                      {resetMessage}
                    </p>
                  </div>
                </div>
              )}

              {!authState.name ? (
                <>
                  <AuthForm
                    formState={formState}
                    isSignUp={authState.isSignUp}
                    loading={loadingAction === "email"}
                    resetLoading={loadingAction === "reset"}
                    busy={loadingAction !== null}
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
                    onForgotPassword={() => void handleForgotPassword()}
                    onSubmit={(e) => void handleEmailAuth(e)}
                    getInputClasses={getInputClasses}
                    getLabelClasses={getLabelClasses}
                    getButtonClasses={getButtonClasses}
                  />

                  <div className="mt-6">
                    <GoogleSignInButton
                      onClick={() => void signIn()}
                      loading={loadingAction === "google"}
                      busy={loadingAction !== null}
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
                  loading={loadingAction === "signout"}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
