import { FirebaseError } from "firebase/app";
import { MIN_PASSWORD_LENGTH } from "./validation";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-credential":
    "Ongeldige inloggegevens. Controleer je e-mailadres en wachtwoord.",
  "auth/invalid-email": "Ongeldig e-mailadres.",
  "auth/user-not-found": "Geen account gevonden met dit e-mailadres.",
  "auth/wrong-password": "Onjuist wachtwoord.",
  "auth/email-already-in-use": "Er bestaat al een account met dit e-mailadres.",
  "auth/weak-password": `Wachtwoord is te zwak. Gebruik minstens ${MIN_PASSWORD_LENGTH} tekens.`,
  "auth/user-disabled": "Dit account is uitgeschakeld.",
  "auth/too-many-requests": "Te veel pogingen. Probeer het later opnieuw.",
  "auth/network-request-failed":
    "Geen netwerkverbinding. Controleer je verbinding en probeer opnieuw.",
  "auth/popup-closed-by-user": "Aanmelden geannuleerd.",
  "auth/cancelled-popup-request": "Aanmelden geannuleerd.",
  "auth/operation-not-allowed": "Deze aanmeldmethode is niet ingeschakeld.",
  "auth/requires-recent-login": "Log opnieuw in om deze actie uit te voeren.",
  "auth/account-exists-with-different-credential":
    "Er bestaat al een account met een andere aanmeldmethode.",
};

const STORAGE_ERROR_MESSAGES: Record<string, string> = {
  "storage/quota-exceeded":
    "Opslaglimiet bereikt. Maak ruimte vrij en probeer opnieuw.",
  "storage/unauthorized": "Je hebt geen rechten om te uploaden.",
  "storage/canceled": "Uploaden geannuleerd.",
};

const mapError = (
  error: unknown,
  messages: Record<string, string>,
  fallback: string,
): string => {
  const code = error instanceof FirebaseError ? error.code : "";
  return messages[code] ?? fallback;
};

export const getAuthErrorMessage = (error: unknown): string =>
  mapError(
    error,
    AUTH_ERROR_MESSAGES,
    "Er is iets misgegaan. Probeer het opnieuw.",
  );

export const getStorageErrorMessage = (error: unknown): string =>
  mapError(
    error,
    STORAGE_ERROR_MESSAGES,
    "Uploaden mislukt. Probeer het opnieuw.",
  );
