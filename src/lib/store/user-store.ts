import { create } from "zustand";
import { User } from "../types";

interface UserStoreState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  resetUser: () =>
    set(() => ({
      user: null,
      isLoading: false,
    })),
}));
