// ============================================================
// App config defaults (fallbacks when no env var is provided)
// ============================================================
export const APP_TITLE_DEFAULT = "Firebase Auth Demo";
export const APP_VERSION_DEFAULT = "auth.demo.v2";
export const STORAGE_UPLOAD_PATH_DEFAULT = "profile-images";

// ============================================================
// Auth
// ============================================================
export const DISPLAY_NAME_FALLBACK = "Gebruiker";

// ============================================================
// Validation
// ============================================================
export const MIN_PASSWORD_LENGTH = 6;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ============================================================
// File upload
// ============================================================
export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const IMAGE_MIME_PREFIX = "image/";
export const IMAGE_INPUT_ACCEPT = "image/*";
export const UPLOAD_FILENAME_PREFIX = "profile";

// ============================================================
// Timeout
// ============================================================
export const TIMEOUT_MS = 30_000;

// ============================================================
// Validation messages
// ============================================================
export const EMAIL_REQUIRED = "Voer je e-mailadres in";
export const EMAIL_INVALID = "Voer een geldig e-mailadres in";
export const RESET_EMAIL_INVALID = "Voer eerst een geldig e-mailadres in";
export const PASSWORD_REQUIRED = "Voer je wachtwoord in";
export const PASSWORD_TOO_SHORT = `Wachtwoord moet minstens ${MIN_PASSWORD_LENGTH} tekens bevatten`;
export const FILE_NOT_IMAGE = "Selecteer een afbeeldingsbestand";
export const FILE_TOO_LARGE = `Bestand moet kleiner zijn dan ${MAX_FILE_SIZE_MB}MB`;

// ============================================================
// Error messages
// ============================================================
export const TIMEOUT_MESSAGE =
  "De verbinding duurt te lang. Probeer het opnieuw.";
export const AUTH_ERROR_FALLBACK = "Er is iets misgegaan. Probeer het opnieuw.";
export const STORAGE_ERROR_FALLBACK = "Uploaden mislukt. Probeer het opnieuw.";

export const AUTH_ERROR_MESSAGES: Record<string, string> = {
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

export const STORAGE_ERROR_MESSAGES: Record<string, string> = {
  "storage/quota-exceeded":
    "Opslaglimiet bereikt. Maak ruimte vrij en probeer opnieuw.",
  "storage/unauthorized": "Je hebt geen rechten om te uploaden.",
  "storage/canceled": "Uploaden geannuleerd.",
};
