import { create } from "zustand";
import { GetCurrentUserResponse, User } from "../types";

interface UserStoreState {
  user: User | null;
  isLoading: boolean;
  setUser: (data: GetCurrentUserResponse) => void;
  setUserDirect: (user: User) => void;
  setLoading: (loading: boolean) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  user: null,
  isLoading: false,
  setUser: (userData) => set({ user: userData.data, isLoading: false }),
  setUserDirect: (user) => set({ user, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  resetUser: () =>
    set(() => ({
      user: null,
      isLoading: false,
    })),
}));
