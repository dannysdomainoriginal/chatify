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
  signUp: (data: FormData) => Promise<void>
}

interface AuthState {
  authUser: User | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  actions: AuthActions;
}

const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isCheckingAuth: true,

  // SignUp
  isSigningUp: false,

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
        const res = await api.post("/auth/signup", data);
        set({ authUser: res.data });

        toast.success("Account created successfully")
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message ||
            "Unable to create account. Please try again."
        );
      } finally {
        set({ isSigningUp: false });
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