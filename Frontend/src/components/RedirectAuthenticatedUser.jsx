import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router-dom";

// Redirect to the home page if the user is authenticated
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default RedirectAuthenticatedUser
