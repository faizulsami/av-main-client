"use client"; // store/userStore.ts
import { create } from "zustand";
import api from "@/config/axios.config";
import { toast } from "sonner";

interface UserState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  fetchUserById: (id: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  initialized: false,
  error: null,

  fetchUserById: async (id: string) => {
    set({ loading: true, error: null });

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await api.get<any>(`/api/v1/users/${id}`);

      set({ user: res.data, loading: false, initialized: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("needsPasswordChange");
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      window.location.replace("/");

      setTimeout(() => {
        toast.error("You're removed as a listener by admin!", {
          duration: 10000,
        });
      }, 5000);

      set({
        error: error?.response?.data?.message || "Something went wrong",
        loading: false,
        initialized: true,
      });
    }
  },
}));
