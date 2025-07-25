import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '~/interfaces/user';
import { authUtils } from '~/lib/auth-middleware';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  clearUser: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (savedUser && token) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    }
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    }
  }, [user]);

  // Redirect to login when user becomes null (after initial load)
  useEffect(() => {
    if (typeof window !== 'undefined' && !loading) {
      const token = localStorage.getItem('token');
      const currentPath = window.location.pathname;
      
      // Auth pages that should NOT redirect
      const authPages = ['/auth/login', '/auth/register', '/', '/pages/welcome'];
      const isAuthPage = authPages.some(page => currentPath.startsWith(page));
      
      // If user is null, no token, not on auth page, and not loading - redirect to login
      if (!user && !token && !isAuthPage) {
        window.location.href = '/auth/login';
      }
    }
  }, [user, loading]);

  const clearUser = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      loading, 
      clearUser,
      updateUser 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Convenience hooks
export function useCurrentUser() {
  const { user } = useUser();
  return user;
}

export function useIsAuthenticated() {
  const { user } = useUser();
  return !!user && authUtils.isAuthenticated();
}

// Hook for components that want manual control over auth redirects
export function useAuthRedirect() {
  const { user, loading } = useUser();
  
  const redirectToLogin = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  };

  const shouldRedirectToLogin = () => {
    if (loading) return false;
    
    const token = localStorage.getItem('token');
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const authPages = ['/auth/login', '/auth/register', '/', '/pages/welcome'];
    const isAuthPage = authPages.some(page => currentPath.startsWith(page));
    
    return !user && !token && !isAuthPage;
  };

  return {
    redirectToLogin,
    shouldRedirectToLogin: shouldRedirectToLogin(),
    isAuthenticated: !!user && authUtils.isAuthenticated()
  };
}
