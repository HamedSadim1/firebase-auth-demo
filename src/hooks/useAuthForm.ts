import { useState, type ChangeEvent } from "react";
import {
  getEmailError,
  getPasswordError,
  validateEmail,
  validatePassword,
} from "@/lib/validation";
import { EMAIL_INVALID, PASSWORD_TOO_SHORT } from "@/lib/constants";
import { FormState } from "@/lib/types";

const INITIAL_FORM_STATE: FormState = {
  email: "",
  password: "",
  emailError: "",
  passwordError: "",
  emailTouched: false,
  passwordTouched: false,
  showPassword: false,
  rememberMe: true,
};

export interface AuthFormApi {
  formState: FormState;
  handleEmail: (e: ChangeEvent<HTMLInputElement>) => void;
  handleEmailBlur: () => void;
  handlePassword: (e: ChangeEvent<HTMLInputElement>) => void;
  handlePasswordBlur: () => void;
  togglePassword: () => void;
  setRememberMe: (checked: boolean) => void;
  clearForm: () => void;
  validate: () => { emailError: string; passwordError: string };
}

export const useAuthForm = (): AuthFormApi => {
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);

  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormState((prev) => ({
      ...prev,
      email: value,
      emailError: value && !validateEmail(value) ? EMAIL_INVALID : "",
    }));
  };

  const handleEmailBlur = () => {
    setFormState((prev) => ({ ...prev, emailTouched: true }));
  };

  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormState((prev) => ({
      ...prev,
      password: value,
      passwordError:
        value && !validatePassword(value) ? PASSWORD_TOO_SHORT : "",
    }));
  };

  const handlePasswordBlur = () => {
    setFormState((prev) => ({ ...prev, passwordTouched: true }));
  };

  const togglePassword = () => {
    setFormState((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const setRememberMe = (checked: boolean) => {
    setFormState((prev) => ({ ...prev, rememberMe: checked }));
  };

  const clearForm = () => {
    setFormState((prev) => ({
      ...prev,
      email: "",
      password: "",
      emailError: "",
      passwordError: "",
      emailTouched: false,
      passwordTouched: false,
      showPassword: false,
    }));
  };

  const validate = () => {
    const emailError = getEmailError(formState.email);
    const passwordError = getPasswordError(formState.password);
    setFormState((prev) => ({
      ...prev,
      emailTouched: true,
      passwordTouched: true,
      emailError,
      passwordError,
    }));
    return { emailError, passwordError };
  };

  return {
    formState,
    handleEmail,
    handleEmailBlur,
    handlePassword,
    handlePasswordBlur,
    togglePassword,
    setRememberMe,
    clearForm,
    validate,
  };
};
