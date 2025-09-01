import { create } from "zustand";
import axiosFetcher from "../services/axios";
import toast from "react-hot-toast";
import type { AuthStore, BackendUser, loginPayload, SignUpPayload, UsersStore } from "../types/types";

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  checkAuthentication: async () => {
    console.log("checking Authentication...");
    try {
      const res = await axiosFetcher.get("/auth/check");
      const authUserData = res.data;
      set({
        authUser: {
          id: authUserData._id,
          name: authUserData.name,
          email: authUserData.email,
          profilePicture: authUserData.profilePicture,
          createdAt: authUserData.createdAt,
          updatedAt: authUserData.updatedAt
        }
      });
      await userStore.getState().getAllUsers();
      console.log("friendlist", userStore.getState().friendList)
    } catch (error) {
      set({ authUser: null });
      if (error instanceof Error) {
        console.log("useAuthStore checkAuthentication error 1", error.response.data.message);
      } else {
        console.log("useAuthStore checkAuthentication error 2", error);
      }
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signUp: async (data: SignUpPayload) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosFetcher.post("/auth/signup", data);
      const authUserData = res.data;
      set({
        authUser: {
          id: authUserData._id,
          name: authUserData.name,
          email: authUserData.email,
          profilePicture: authUserData.profilePicture
        }
      });
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
      const res = await axiosFetcher.post("/auth/login", data)
      const authUserData = res.data;
      set({
        authUser: {
          id: authUserData._id,
          name: authUserData.name,
          email: authUserData.email,
          profilePicture: authUserData.profilePicture
        }
      });
      toast.success("Login successfully!");
    } catch (error) {
      console.log("useAuthStore login error", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosFetcher.post("/auth/logout")
      set({ authUser: null })
      toast.success("Logout Successfull!")
    } catch {
      toast.success("Something went wrong!")
    }
  }
}));

export const userStore = create<UsersStore>((set) => ({
  friendList: [],
  getAllUsers: async () => {
    try {
      const res = await axiosFetcher.get("/message/users");
      const friendListData = res.data;
      const mappedFriendList = friendListData.map((user: BackendUser) => ({
        id: user._id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));
      set({ friendList: mappedFriendList });
      console.log("friendlist", mappedFriendList)
    } catch (error) {
      console.log("get all users error", error)
      toast.success("Something went wrong!")
    }
  }
}));