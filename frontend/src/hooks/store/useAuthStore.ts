import api from "@/libraries/axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { useShallow } from "zustand/shallow";

interface User {
  _id: string;
  email: string;
  profilePic: string;
  fullName: string;
}

export type FormData = {
  fullName?: string;
  email: string;
  password: string;
};

interface AuthActions {
  checkAuth: () => Promise<void>;
  signUp: (data: FormData) => Promise<void>;
  logIn: (data: FormData) => Promise<void>;
  logOut: () => Promise<void>;
  updateProfile: (data: { profilePic: Base64URLString }) => Promise<void>;
}

interface AuthState {
  authUser: User | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  actions: AuthActions;
}

const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isCheckingAuth: true,

  // SignUp
  isSigningUp: false,

  // LogIn
  isLoggingIn: false,

  actions: {
    checkAuth: async () => {
      try {
        const res = await api.get("/auth/check");
        set({ authUser: res.data });
      } catch (err) {
        console.log("User is not autenticated");
        set({ authUser: null });
      } finally {
        set({ isCheckingAuth: false });
      }
    },

    signUp: async (data) => {
      set({ isSigningUp: true });

      try {
        const res = await api.post<User>("/auth/signup", data);
        set({ authUser: res.data });

        toast.success("Account created successfully");
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message || "Error creating your account"
        );
      } finally {
        set({ isSigningUp: false });
      }
    },

    logIn: async (data) => {
      set({ isLoggingIn: true });

      try {
        const res = await api.post<User>("/auth/login", data);
        set({ authUser: res.data });

        toast.success(`User logged in successfully`);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Error logging you in");
      } finally {
        set({ isLoggingIn: false });
      }
    },

    logOut: async () => {
      try {
        const res = await api.post("/auth/logout");
        set({ authUser: null });
        toast.success("Logged out successfully");
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Error logging you out");
      }
    },

    updateProfile: async (data) => {
      try {
        const res = await api.put<User>("/auth/update-profile", data);
        set({ authUser: res.data });
        toast.success("Profile updated successfully");
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Error updating profile");
      }
    },
  },
}));

export const useAuthUser = () => useAuthStore((state) => state.authUser);
export const useAuthLoading = () =>
  useAuthStore((state) => state.isCheckingAuth);
export const useAuthActions = () => useAuthStore((state) => state.actions);

export const useSignUp = () =>
  useAuthStore(
    useShallow((state) => ({
      signUp: state.actions.signUp,
      isSigningUp: state.isSigningUp,
    }))
  );

export const useLogIn = () =>
  useAuthStore(
    useShallow((state) => ({
      logIn: state.actions.logIn,
      isLoggingIn: state.isLoggingIn,
    }))
  );

export const useLogOut = () => useAuthStore((state) => state.actions.logOut);
