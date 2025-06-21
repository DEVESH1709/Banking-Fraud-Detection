import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useAuthStore } from "./store/authStore";
import {
  FloatingShape,
  LoadingSpinner,
  ProtectedRoute,
  RedirectAuthenticatedUser,
} from "./components";
import {
  SignUpPage,
  LoginPage,
  EmailVerificationPage,
  DashboardPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from "./pages";

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <main
      className="min-h-screen flex items-center justify-center relative overflow-hidden
      bg-gradient-to-br from-blue-800 to-violet-900 text-white"
    >
      <FloatingShape
        color={"bg-blue-500"}
        size={"w-64 h-64"}
        top={"-5%"}
        left={"10%"}
        delay={0}
      />
      <FloatingShape
        color={"bg-purple-500"}
        size={"w-48 h-48"}
        top={"70%"}
        left={"80%"}
        delay={5}
      />
      <FloatingShape
        color={"bg-violet-500"}
        size={"w-32 h-32"}
        top={"40%"}
        left={"-10%"}
        delay={2}
      />


      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/verify-email"
          element={
            <RedirectAuthenticatedUser>
              <EmailVerificationPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/forget-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster />
    </main>
  );
}

export default App;
