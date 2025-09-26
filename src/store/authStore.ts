import { create } from 'zustand';

export type UserRole = 'patient' | 'doctor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    email: 'patient@demo.com',
    name: 'John Smith',
    role: 'patient',
  },
  {
    id: '2',
    email: 'doctor@demo.com',
    name: 'Dr. Sarah Johnson',
    role: 'doctor',
  },
];

export const useAuthStore = create<AuthState>()((set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string, role: UserRole) => {
        // Mock authentication - in real app, this would call an API
        const user = mockUsers.find(u => u.email === email && u.role === role);
        
        if (user && password === 'demo123') {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      register: async (email: string, password: string, name: string, role: UserRole) => {
        // Mock registration
        const newUser: User = {
          id: Date.now().toString(),
          email,
          name,
          role,
        };
        
        set({ user: newUser, isAuthenticated: true });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
    }));