import { useEffect } from "react";
import { useNavigate } from "react-router";

export function useAuthGuard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth/login", { replace: true });
      }
    }
  }, [navigate]);

  // Return whether user is authenticated
  const isAuthenticated = () => {
    // Check if we're on the client side
    if (typeof window === "undefined") {
      return false; // Assume not authenticated on server side
    }
    return !!localStorage.getItem("token");
  };

  // Logout function
  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      navigate("/auth/login", { replace: true });
    }
  };

  return { isAuthenticated, logout };
}

// Higher-order component for protecting routes
export function withAuthGuard<T extends object>(
  Component: React.ComponentType<T>
) {
  return function AuthGuardedComponent(props: T) {
    const { isAuthenticated } = useAuthGuard();

    // Don't render the component if not authenticated
    // The useAuthGuard hook will handle the redirect
    if (!isAuthenticated()) {
      return null;
    }

    return <Component {...props} />;
  };
}

// Utility functions that can be used anywhere
export const authUtils = {
  isAuthenticated: () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    }
  },
  getToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },
};
