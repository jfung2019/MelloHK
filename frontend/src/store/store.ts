import { create } from "zustand";
import axiosInstance from "../services/axios";
import toast from "react-hot-toast";
import type { AuthStore, BackendUser, loginPayload, ProfileUpdatePayload, SignUpPayload, ThemeStore, UsersStore } from "../types/types";

const THEME_KEY = "saved-theme";

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isSavingProfileLoading: false,
  checkAuthentication: async () => {
    console.log("checking Authentication...");
    try {
      const res = await axiosInstance.get("/auth/check");
      const authUserData = res.data;
      set({
        authUser: {
          id: authUserData._id,
          name: authUserData.name,
          email: authUserData.email,
          profilePicture: authUserData.profilePicture,
          profileComplete: authUserData.profileComplete,
          bio: authUserData.bio,
          location: authUserData.location,
          friends: authUserData.friends,
          createdAt: authUserData.createdAt,
          updatedAt: authUserData.updatedAt,
        }
      });
    } catch (error) {
      set({ authUser: null });
      console.log("useAuthStore checkAuthentication error 1", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signUp: async (data: SignUpPayload) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      const authUserData = res.data.user;
      set({
        authUser: {
          id: authUserData._id,
          name: authUserData.name,
          email: authUserData.email,
          profilePicture: authUserData.profilePicture,
          profileComplete: authUserData.profileComplete,
          bio: authUserData.bio,
          location: authUserData.location,
          friends: authUserData.friends
        }
      });
      console.log("useAuthStore signUp authUserData", authUserData);
      toast.success("Account created successfully!");
    } catch (error) {
      console.log("useAuthStore signUp error", error);
      // set({authUser: null })
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data: loginPayload) => {
    // set({ authUser: null })
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      const authUserData = res.data.user;
      set({
        authUser: {
          id: authUserData._id,
          name: authUserData.name,
          email: authUserData.email,
          profilePicture: authUserData.profilePicture,
          profileComplete: authUserData.profileComplete,
          bio: authUserData.bio,
          location: authUserData.location,
          friends: authUserData.friends
        }
      });
      console.log("login suc", authUserData)
      toast.success("Login successfully!");
    } catch (error) {
      console.log("useAuthStore login error", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout")
      set({ authUser: null })
      toast.success("Logout Successfull!")
    } catch {
      toast.success("Something went wrong!")
    }
  },
  updateProfile: async (data: ProfileUpdatePayload) => {
    set({ isSavingProfileLoading: true });
    try {
      const userId = useAuthStore.getState().authUser?.id;
      const payload = { ...data, id: userId };
      const res = await axiosInstance.put("/auth/profileUpdate", payload);
      const authUserData = res.data;
      set({
        authUser: {
          id: authUserData._id,
          name: authUserData.name,
          email: authUserData.email,
          profilePicture: authUserData.profilePicture,
          profileComplete: authUserData.profileComplete,
          bio: authUserData.bio,
          location: authUserData.location,
          friends: authUserData.friends
        }
      });
      toast.success("Account updated successfully!");
    } catch (error) {
      console.log("error in updateProfile", error)
    } finally {
      set({ isSavingProfileLoading: false });
    }
  }
}));

export const useUserStore = create<UsersStore>((set, get) => ({
  allUsers: [],
  friends: [],
  friendRequestData: null,
  sentFriendRequest: null,
  acceptedFriendRequest: null,
  getAllUsers: async () => {
    try {
      const res = await axiosInstance.get("/users/all-friends");
      const friendListData = res.data;
      const mappedFriendList = friendListData.map((user: BackendUser) => ({
        id: user._id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));
      set({ allUsers: mappedFriendList });
      console.log("friendlist", mappedFriendList)
    } catch (error) {
      console.log("get all users error", error)
      toast.success("Something went wrong!")
    }
  },
  getFriends: async () => {
    try {
      const res = await axiosInstance.get("/users/friends");
      set({ friends: res.data })
    } catch (error) {
      console.log("error in getFriends", error)
    }
  },
  getAllFriendRequests: async () => {
    try {
      const res = await axiosInstance.put("/users/all-friend-requests");
      console.log("all-friend-requests", res);
      set({ friendRequestData: res.data });
    } catch (error) {
      console.log("error in upDateAllFriendRequest", error);
    }
  },
  sendFriendRequest: async (friendUserId) => {
    try {
      const res = await axiosInstance.post(`/users/friend-request/${friendUserId}`)
      console.log("all-friend-requests", res.data);
    } catch (error) {
      console.log("error in sendFriendRequest", error);
    } finally {
      await get().getAllFriendRequests();
    }
  },
  acceptFriendRequest: async (friendUserId) => {
    try {
      const res = await axiosInstance.put(`/users/friend-request/${friendUserId}/accept`)
      console.log("all-friend-requests", res.data);
    } catch (error) {
      console.log("error in sendFriendRequest", error);
    }
  }
}));

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: localStorage.getItem(THEME_KEY) || "dark",
  setTheme: (theme: string) => {
    localStorage.setItem(THEME_KEY, theme);
    set({ theme });
  }
}))