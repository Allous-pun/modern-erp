import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authApi, User } from '@/lib/api/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Try to get the user profile using the new endpoint
        const userData = await authApi.getProfile();
        console.log('Profile loaded:', userData);
        setUser(userData);
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid token and related data
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('organizationId');
        localStorage.removeItem('organizationName');
        localStorage.removeItem('organizationSlug');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login({ email, password });
      
      console.log('Full login response:', response);
      
      // Check if response has the expected structure
      if (!response.member) {
        console.error('Unexpected response structure:', response);
        throw new Error('Invalid response from server');
      }
      
      // Transform the member data to match User type
      const userData: User = {
        id: response.member.id,
        email: response.member.email,
        firstName: response.member.name.split(' ')[0] || '',
        lastName: response.member.name.split(' ').slice(1).join(' ') || '',
        displayName: response.member.name,
        jobTitle: response.member.jobTitle,
        roles: response.member.roles,
      };
      
      console.log('Setting user:', userData);
      setUser(userData);
      
      // After successful login, try to load full profile
      try {
        const fullProfile = await authApi.getProfile();
        setUser(fullProfile);
      } catch (profileError) {
        console.warn('Could not load full profile after login:', profileError);
        // Continue with basic user data from login
      }
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}