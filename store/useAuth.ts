import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  clearError: () => void;
};

// Mock authentication - In a real app, this would connect to a backend
const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      signIn: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock validation - In a real app, this would be server-side
          if (email === 'demo@example.com' && password === 'password') {
            const mockUser: User = {
              id: '1',
              email: 'demo@example.com',
              name: 'Demo User',
              avatar: 'https://i.pravatar.cc/150?img=3',
              createdAt: new Date().toISOString(),
            };
            
            set({
              user: mockUser,
              token: 'mock-jwt-token',
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              error: 'Invalid email or password',
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: 'An error occurred during sign in',
            isLoading: false,
          });
        }
      },
      
      signUp: async (name: string, email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock registration - In a real app, this would hit an API
          const mockUser: User = {
            id: '1',
            email,
            name,
            createdAt: new Date().toISOString(),
          };
          
          set({
            user: mockUser,
            token: 'mock-jwt-token',
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: 'An error occurred during registration',
            isLoading: false,
          });
        }
      },
      
      signOut: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuth;