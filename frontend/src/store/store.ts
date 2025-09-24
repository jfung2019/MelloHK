import { create } from "zustand";
import axiosInstance from "../services/axios";
import toast from "react-hot-toast";
import type { AuthStore, loginPayload, ProfileUpdatePayload, SignUpPayload, ThemeStore, UsersStore } from "../types/types";

const THEME_KEY = "saved-theme";

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isSavingProfileLoading: false,
  checkAuthentication: async () => {
    console.log("checking Authentication...");
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
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
      set({ authUser: authUserData });
      console.log("useAuthStore signUp authUserData", authUserData);
      toast.success("Account created successfully!");
    } catch (error) {
      console.log("useAuthStore signUp error", error);
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data: loginPayload) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      const authUserData = res.data.user;
      set({ authUser: authUserData });
      console.log("login suc", authUserData)
      toast.success("Login successfully!");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("useAuthStore login error", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout")
      set({ authUser: null, })
      useUserStore.getState().clearUserData();
      toast.success("Logout Successfull!")
    } catch {
      toast.success("Something went wrong!")
    }
  },
  updateProfile: async (data: ProfileUpdatePayload) => {
    set({ isSavingProfileLoading: true });
    try {
      const userId = get().authUser?._id;
      const payload = { ...data, id: userId };
      const res = await axiosInstance.put("/auth/profileUpdate", payload);
      set({ authUser: res.data });
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
  streamToken: '',
  friendRequestDataLoading: false,
  isFriendListLoading: false,
  getAllUsers: async () => {
    try {
      const res = await axiosInstance.get("/users/all-friends");
      set({ allUsers: res.data });
      console.log("allUsers", res.data)
    } catch (error) {
      console.log("get all users error", error)
      toast.success("Something went wrong!")
    }
  },
  getFriends: async () => {
    set({ isFriendListLoading: true });
    try {
      const res = await axiosInstance.get("/users/friends");
      set({ friends: res.data });
    } catch (error) {
      console.log("error in getFriends", error)
    } finally {
      set({ isFriendListLoading: false });
    }
  },
  getAllFriendRequests: async () => {
    set({ friendRequestDataLoading: true })
    try {
      const res = await axiosInstance.get("/users/all-friend-requests");
      console.log("friendRequestData", res.data);
      set({ friendRequestData: res.data });
    } catch (error) {
      console.log("error in upDateAllFriendRequest", error);
    } finally {
      set({ friendRequestDataLoading: false })
    }
  },
  sendFriendRequest: async (friendUserId) => {
    try {
      console.log("friendUserId", friendUserId);
      const res = await axiosInstance.post(`/users/friend-request/${friendUserId}`)
      console.log("sendFriendRequest", res.data);
    } catch (error) {
      console.log("error in sendFriendRequest", error);
      toast.error(error.response.data.message);
    } finally {
      await get().getAllFriendRequests();
    }
  },
  acceptFriendRequest: async (friendUserId) => {
    try {
      console.log("acceptFriendRequest friendUserId", friendUserId);
      const res = await axiosInstance.put(`/users/friend-request/${friendUserId}/accept`)
      console.log("acceptFriendRequest", res.data);
    } catch (error) {
      console.log("error in sendFriendRequest", error);
    } finally {
      // todo: maybe just update the local state instead of calling the api
      await get().getAllFriendRequests();
      await get().getFriends();
    }
  },
  getStreamToken: async () => {
    try {
      const res = await axiosInstance.get("/chat/token");
      set({ streamToken: res.data })
    } catch (error) {
      console.log("error in sendFriendRequest", error);
    }
  },
  clearUserData: () => {
    set({
      allUsers: [],
      friends: [],
      friendRequestData: null
    })
  }
}));

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: localStorage.getItem(THEME_KEY) || "dark",
  setTheme: (theme: string) => {
    localStorage.setItem(THEME_KEY, theme);
    set({ theme });
  }
}))