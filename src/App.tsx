import React, { useEffect, useRef, useState } from "react";
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
  UserProfile,
} from "./components/index";

type LoadingAction = "email" | "google" | "reset" | "signout" | null;

const TIMEOUT_MS = 30_000;
const TIMEOUT_MESSAGE = "De verbinding duurt te lang. Probeer het opnieuw.";

const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(TIMEOUT_MESSAGE)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (reason: unknown) => {
        clearTimeout(timer);
        reject(reason instanceof Error ? reason : new Error(String(reason)));
      },
    );
  });

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
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    emailError: "",
    passwordError: "",
    emailTouched: false,
    passwordTouched: false,
    showPassword: false,
    rememberMe: true,
  });

  const [authState, setAuthState] = useState({
    name: "",
    photoUrl: "",
    error: "",
    isSignUp: false,
  });

  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);
  const operationInFlight = useRef(false);
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
      emailTouched: false,
      passwordTouched: false,
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
    if (operationInFlight.current) return;
    operationInFlight.current = true;
    setLoadingAction(action);
    setResetMessage("");
    setAuthState((prev) => ({ ...prev, error: "" }));
    try {
      await withTimeout(operation(), TIMEOUT_MS);
    } catch (error: unknown) {
      console.error(error);
      const errorMessage =
        error instanceof Error && error.message === TIMEOUT_MESSAGE
          ? TIMEOUT_MESSAGE
          : getErrorMessage(error);
      setAuthState((prev) => ({ ...prev, error: errorMessage }));
    } finally {
      setLoadingAction(null);
      operationInFlight.current = false;
    }
  };

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setResetMessage("");
    setAuthState((prev) => ({ ...prev, error: "" }));
    setFormState((prev) => ({
      ...prev,
      email: value,
      emailError:
        value && !validateEmail(value) ? "Voer een geldig e-mailadres in" : "",
    }));
  };

  const handleEmailBlur = () => {
    setFormState((prev) => ({ ...prev, emailTouched: true }));
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAuthState((prev) => ({ ...prev, error: "" }));
    setFormState((prev) => ({
      ...prev,
      password: value,
      passwordError:
        value && !validatePassword(value)
          ? "Wachtwoord moet minstens 6 tekens bevatten"
          : "",
    }));
  };

  const handlePasswordBlur = () => {
    setFormState((prev) => ({ ...prev, passwordTouched: true }));
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = formState.email
      ? validateEmail(formState.email)
        ? ""
        : "Voer een geldig e-mailadres in"
      : "Voer je e-mailadres in";
    const passwordError = formState.password
      ? validatePassword(formState.password)
        ? ""
        : "Wachtwoord moet minstens 6 tekens bevatten"
      : "Voer je wachtwoord in";
    setFormState((prev) => ({
      ...prev,
      emailTouched: true,
      passwordTouched: true,
      emailError,
      passwordError,
    }));
    if (emailError || passwordError) return;

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
      setAuthState((prev) => ({ ...prev, error: "", isSignUp: false }));
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
      <div
        role="main"
        className="relative w-full max-w-[960px] overflow-hidden rounded-2xl shadow-2xl border border-panel-line bg-panel grid grid-cols-1 md:grid-cols-2 animate-fade-in-up"
      >
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
              <ErrorMessage error={authState.error} />

              {!authState.name ? (
                <>
                  <Header isSignUp={authState.isSignUp} />

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

                  <AuthForm
                    formState={formState}
                    isSignUp={authState.isSignUp}
                    loading={loadingAction === "email"}
                    resetLoading={loadingAction === "reset"}
                    googleLoading={loadingAction === "google"}
                    busy={loadingAction !== null}
                    onEmailChange={handleEmail}
                    onEmailBlur={handleEmailBlur}
                    onPasswordChange={handlePassword}
                    onPasswordBlur={handlePasswordBlur}
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
                    onGoogleSignIn={() => void signIn()}
                    onSubmit={(e) => void handleEmailAuth(e)}
                  />
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
