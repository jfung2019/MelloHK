// Shared types and interfaces for the chat app

export interface AuthStore {
  authUser: User | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  checkAuthentication: () => Promise<void>;
  signUp: (userData: SignUpPayload) => Promise<void>;
  login: (userData: loginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export interface UsersStore {
  friendList: Array<User>;
  getAllUsers: () => Promise<void>;
};

export type User = {
  id: string;
  email: string;
  name: string;
  profilePicture: string;
  createdAt?: string;
  updatedAt?: string;
};

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


