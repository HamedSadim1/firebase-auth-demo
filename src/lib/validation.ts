export const MIN_PASSWORD_LENGTH = 6;

export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const EMAIL_REQUIRED = "Voer je e-mailadres in";
export const EMAIL_INVALID = "Voer een geldig e-mailadres in";
export const RESET_EMAIL_INVALID = "Voer eerst een geldig e-mailadres in";
export const PASSWORD_REQUIRED = "Voer je wachtwoord in";
export const PASSWORD_TOO_SHORT = `Wachtwoord moet minstens ${MIN_PASSWORD_LENGTH} tekens bevatten`;

export const FILE_NOT_IMAGE = "Selecteer een afbeeldingsbestand";
export const FILE_TOO_LARGE = `Bestand moet kleiner zijn dan ${MAX_FILE_SIZE_MB}MB`;

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= MIN_PASSWORD_LENGTH;
};

export const getEmailError = (email: string): string => {
  if (!email) return EMAIL_REQUIRED;
  return validateEmail(email) ? "" : EMAIL_INVALID;
};

export const getPasswordError = (password: string): string => {
  if (!password) return PASSWORD_REQUIRED;
  return validatePassword(password) ? "" : PASSWORD_TOO_SHORT;
};
