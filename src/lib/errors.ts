import { FirebaseError } from "firebase/app";
import {
  AUTH_ERROR_FALLBACK,
  AUTH_ERROR_MESSAGES,
  STORAGE_ERROR_FALLBACK,
  STORAGE_ERROR_MESSAGES,
} from "@/lib/constants";

const mapError = (
  error: unknown,
  messages: Record<string, string>,
  fallback: string,
): string => {
  const code = error instanceof FirebaseError ? error.code : "";
  return messages[code] ?? fallback;
};

export const getAuthErrorMessage = (error: unknown): string =>
  mapError(error, AUTH_ERROR_MESSAGES, AUTH_ERROR_FALLBACK);

export const getStorageErrorMessage = (error: unknown): string =>
  mapError(error, STORAGE_ERROR_MESSAGES, STORAGE_ERROR_FALLBACK);
