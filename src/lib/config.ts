export const APP_TITLE = import.meta.env.VITE_APP_TITLE ?? "Firebase Auth Demo";

export const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? "auth.demo.v2";

export const STORAGE_UPLOAD_PATH = (
  import.meta.env.VITE_STORAGE_UPLOAD_PATH ?? "profile-images"
).replace(/\/+$/, "");
