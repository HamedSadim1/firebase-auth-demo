import { useEffect, useRef, useState } from "react";
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
} from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { getAuthErrorMessage } from "@/lib/errors";
import { validateEmail } from "@/lib/validation";
import { getUserDisplayName } from "@/lib/user";
import { AuthState, LoadingAction } from "@/lib/types";
import { withTimeout } from "@/lib/async";
import {
  RESET_EMAIL_INVALID,
  TIMEOUT_MS,
  TIMEOUT_MESSAGE,
} from "@/lib/constants";

export interface AuthApi {
  authState: AuthState;
  loadingAction: LoadingAction;
  resetMessage: string;
  authInitialized: boolean;
  clearError: () => void;
  clearResetMessage: () => void;
  toggleSignUp: () => void;
  signInWithEmail: (
    email: string,
    password: string,
    isSignUp: boolean,
    rememberMe: boolean,
  ) => Promise<void>;
  signInWithGoogle: (
    rememberMe: boolean,
    clearForm: () => void,
  ) => Promise<void>;
  signOutUser: (clearForm: () => void) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  handlePhotoUpload: (url: string) => void;
}

export const useAuth = (): AuthApi => {
  const [authState, setAuthState] = useState<AuthState>({
    name: "",
    photoUrl: "",
    error: "",
    isSignUp: false,
  });

  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);
  const [resetMessage, setResetMessage] = useState("");
  const [authInitialized, setAuthInitialized] = useState(false);
  const operationInFlight = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthState((prev) => ({
          ...prev,
          name: getUserDisplayName(user),
          photoUrl: user.photoURL ?? "",
        }));
      } else {
        setAuthState((prev) => ({ ...prev, name: "", photoUrl: "" }));
      }
      setAuthInitialized(true);
    });
    return unsubscribe;
  }, []);

  const applyPersistence = async (rememberMe: boolean) => {
    await setPersistence(
      auth,
      rememberMe ? browserLocalPersistence : browserSessionPersistence,
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
          : getAuthErrorMessage(error);
      setAuthState((prev) => ({ ...prev, error: errorMessage }));
    } finally {
      setLoadingAction(null);
      operationInFlight.current = false;
    }
  };

  const signInWithEmail = async (
    email: string,
    password: string,
    isSignUp: boolean,
    rememberMe: boolean,
  ) => {
    await handleAsyncOperation("email", async () => {
      await applyPersistence(rememberMe);
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    });
  };

  const signInWithGoogle = async (
    rememberMe: boolean,
    clearForm: () => void,
  ) => {
    await handleAsyncOperation("google", async () => {
      await applyPersistence(rememberMe);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      clearForm();
    });
  };

  const signOutUser = async (clearForm: () => void) => {
    await handleAsyncOperation("signout", async () => {
      await signOut(auth);
      setAuthState((prev) => ({ ...prev, error: "", isSignUp: false }));
      clearForm();
    });
  };

  const sendPasswordReset = async (email: string) => {
    setResetMessage("");
    if (!validateEmail(email)) {
      setAuthState((prev) => ({ ...prev, error: RESET_EMAIL_INVALID }));
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
    setAuthState((prev) => ({ ...prev, photoUrl: url }));
  };

  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: "" }));
  };

  const clearResetMessage = () => {
    setResetMessage("");
  };

  const toggleSignUp = () => {
    setAuthState((prev) => ({ ...prev, isSignUp: !prev.isSignUp }));
  };

  return {
    authState,
    loadingAction,
    resetMessage,
    authInitialized,
    clearError,
    clearResetMessage,
    toggleSignUp,
    signInWithEmail,
    signInWithGoogle,
    signOutUser,
    sendPasswordReset,
    handlePhotoUpload,
  };
};
