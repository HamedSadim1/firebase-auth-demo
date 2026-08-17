import React from "react";
import { useAuth } from "./hooks/useAuth";
import { useAuthForm } from "./hooks/useAuthForm";
import {
  AuthShell,
  BrandPanel,
  Banner,
  Header,
  AuthForm,
  UserProfile,
  LoadingState,
} from "./components/index";

function App() {
  const {
    formState,
    handleEmail,
    handleEmailBlur,
    handlePassword,
    handlePasswordBlur,
    togglePassword,
    setRememberMe,
    clearForm,
    validate,
  } = useAuthForm();

  const {
    authState,
    loadingAction,
    resetMessage,
    authInitialized,
    clearError,
    clearResetMessage,
    toggleSignUp,
    signInWithEmail,
    signInWithGoogle,
    signOutUser,
    sendPasswordReset,
    handlePhotoUpload,
  } = useAuth();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleEmail(e);
    clearResetMessage();
    clearError();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePassword(e);
    clearError();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { emailError, passwordError } = validate();
    if (emailError || passwordError) return;
    void signInWithEmail(
      formState.email,
      formState.password,
      authState.isSignUp,
      formState.rememberMe,
    );
  };

  return (
    <AuthShell>
      <BrandPanel />
      <div className="p-6 sm:p-10">
        {!authInitialized ? (
          <LoadingState />
        ) : (
          <>
            <Banner tone="error" message={authState.error} />

            {!authState.name ? (
              <>
                <Header isSignUp={authState.isSignUp} />

                <Banner tone="success" message={resetMessage} />

                <AuthForm
                  formState={formState}
                  isSignUp={authState.isSignUp}
                  loading={loadingAction === "email"}
                  resetLoading={loadingAction === "reset"}
                  googleLoading={loadingAction === "google"}
                  busy={loadingAction !== null}
                  onEmailChange={handleEmailChange}
                  onEmailBlur={handleEmailBlur}
                  onPasswordChange={handlePasswordChange}
                  onPasswordBlur={handlePasswordBlur}
                  onTogglePassword={togglePassword}
                  onRememberMeChange={setRememberMe}
                  onToggleSignUp={toggleSignUp}
                  onForgotPassword={() =>
                    void sendPasswordReset(formState.email.trim())
                  }
                  onGoogleSignIn={() =>
                    void signInWithGoogle(formState.rememberMe, clearForm)
                  }
                  onSubmit={handleSubmit}
                />
              </>
            ) : (
              <UserProfile
                name={authState.name}
                photoUrl={authState.photoUrl}
                onSignOut={() => void signOutUser(clearForm)}
                onPhotoUpload={handlePhotoUpload}
                loading={loadingAction === "signout"}
              />
            )}
          </>
        )}
      </div>
    </AuthShell>
  );
}

export default App;
