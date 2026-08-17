import {
  EMAIL_INVALID,
  EMAIL_REGEX,
  EMAIL_REQUIRED,
  MIN_PASSWORD_LENGTH,
  PASSWORD_REQUIRED,
  PASSWORD_TOO_SHORT,
} from "./constants";

export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
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
