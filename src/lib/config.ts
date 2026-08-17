import {
  APP_TITLE_DEFAULT,
  APP_VERSION_DEFAULT,
  STORAGE_UPLOAD_PATH_DEFAULT,
} from "@/lib/constants";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE ?? APP_TITLE_DEFAULT;

export const APP_VERSION =
  import.meta.env.VITE_APP_VERSION ?? APP_VERSION_DEFAULT;

export const STORAGE_UPLOAD_PATH = (
  import.meta.env.VITE_STORAGE_UPLOAD_PATH ?? STORAGE_UPLOAD_PATH_DEFAULT
).replace(/\/+$/, "");
