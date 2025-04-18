import { getLikedMovies } from "@/services/userService";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  likedMovies: string[];
  setLikedMovies: () => Promise<void>;
  removeLikedMovie: (movieId: string) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      likedMovies: [],
      setLikedMovies: async () => {
        const { user } = get();
        if (!user?.uid) return;
        const likedMovies = await getLikedMovies(user.uid);
        console.log(likedMovies);
        set({ likedMovies });
      },
      removeLikedMovie: (movieId) => {
        const { likedMovies } = get();
        const updated = likedMovies.filter((id) => id !== movieId);
        set({ likedMovies: updated });
      },
    }),
    {
      name: "user",
    }
  )
);
