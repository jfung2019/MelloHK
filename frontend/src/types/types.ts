// Shared types and interfaces for the chat app
import type { ReactNode } from 'react';

export interface MainLayoutProps {
  children: ReactNode;
}
export interface AuthStore {
  authUser: User | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isSavingProfileLoading: boolean;
  checkAuthentication: () => Promise<void>;
  signUp: (userData: SignUpPayload) => Promise<void>;
  login: (userData: loginPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: ProfileUpdatePayload) => Promise<void>;
}

export interface UsersStore {
  allUsers: Array<User>;
  getAllUsers: () => Promise<void>;
};

export interface ThemeStore {
  theme: string;
  setTheme: (data: string) => void;
}

export type User = {
  id: string;
  email: string;
  name: string;
  profilePicture: string;
  profileComplete: boolean;
  bio: string,
  location: string,
  friends: Array<User>
  createdAt?: string;
  updatedAt?: string;
};

export type ProfileUpdatePayload = {
  name: string;
  bio: string;
  location: string;
  profilePicture: string;
}

export type BackendUser = {
  _id: string;
  email: string;
  name: string;
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
};

export type SignUpPayload = loginPayload & {
  name: string;
};

export type loginPayload = {
  email: string;
  password: string;
};
