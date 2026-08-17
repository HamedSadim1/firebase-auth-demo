import { type User } from "firebase/auth";
import { DISPLAY_NAME_FALLBACK } from "@/lib/constants";

export const getUserDisplayName = (user: User): string =>
  user.displayName ?? user.email ?? DISPLAY_NAME_FALLBACK;
