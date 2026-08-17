export interface FormState {
  email: string;
  password: string;
  emailError: string;
  passwordError: string;
  emailTouched: boolean;
  passwordTouched: boolean;
  showPassword: boolean;
  rememberMe: boolean;
}

export interface AuthState {
  name: string;
  photoUrl: string;
  error: string;
  isSignUp: boolean;
}

export type LoadingAction = "email" | "google" | "reset" | "signout" | null;
