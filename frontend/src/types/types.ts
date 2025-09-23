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
  isSavingProfileLoading: boolean;
  checkAuthentication: () => Promise<void>;
  signUp: (userData: SignUpPayload) => Promise<void>;
  login: (userData: loginPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: ProfileUpdatePayload) => Promise<void>;
}

export interface UsersStore {
  allUsers: User[];
  friends: Friend[];
  friendRequestData: FriendRequestData | null,
  streamToken: string;
  friendRequestDataLoading: boolean,
  isFriendListLoading: boolean,
  getFriends: () => Promise<void>;
  getAllUsers: () => Promise<void>;
  getAllFriendRequests: () => Promise<void>;
  sendFriendRequest: (id: string) => Promise<void>;
  acceptFriendRequest: (id: string) => Promise<void>;
  messageFriend: (id: string) => Promise<void>;
  getStreamToken: () => Promise<void>;
  clearUserData: () => void;
};

export interface ThemeStore {
  theme: string;
  setTheme: (data: string) => void;
}

type FriendRequest = {
  _id: string;
  sender: { 
    profilePicture: string;
    bio: string;
    name: string;
  },
}

type OutgoingFriendRequest = {
  _id: string;
  recipient: {
    _id: string;
    name: string;
  };
}

type FriendRequestData = {
  allFriendRequests: FriendRequest[];
  acceptedFriendRequests: [];
  acceptedSentRequests: [];
  outgoingSentFriendRequests: OutgoingFriendRequest[];
}

export type User = {
  _id: string;
  name: string;
  profilePicture: string;
  bio: string,
  email?: string;
  location?: string,
  friends?: Array<User>
  profileComplete?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ProfileUpdatePayload = {
  name: string;
  bio: string;
  location: string;
  profilePicture: string;
}

export type Friend = {
  _id: string;
  name: string;
  bio: string;
  profilePicture: string;
};

export type SignUpPayload = loginPayload & {
  name: string;
};

export type loginPayload = {
  email: string;
  password: string;
};
