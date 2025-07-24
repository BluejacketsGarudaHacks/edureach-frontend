import { redirect } from "react-router";

export function requireAuth() {
  // This function should be used as a loader for protected routes
  return () => {
    // Only check on client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw redirect('/auth/login');
      }
    }
    
    return null;
  };
}

export function checkAuth() {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
}
