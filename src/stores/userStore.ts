import { getLikedMovies, getWatchedMoviesCount } from "@/services/userService";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  likedMovies: string[];
  setLikedMovies: () => Promise<void>;
  removeLikedMovie: (movieId: string) => void;
  clearLikedMovies: () => void;
  watchedMoviesCount: number;
  setWatchedMoviesCount: () => Promise<void>;

}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () =>
        set({ user: null, likedMovies: [], watchedMoviesCount: 0 }),
      likedMovies: [],
      setLikedMovies: async () => {
        const { user } = get();
        if (!user?.uid) return;
        const likedMovies = await getLikedMovies(user.uid);
        set({ likedMovies });
      },
      removeLikedMovie: (movieId) => {
        const { likedMovies } = get();
        const updated = likedMovies.filter((id) => id !== movieId);
        set({ likedMovies: updated });
      },
      clearLikedMovies: () => set({ likedMovies: [] }),

      watchedMoviesCount: 0,
      setWatchedMoviesCount: async () => {
        const { user } = get();
        if (!user?.uid) return;
        const count = await getWatchedMoviesCount(user.uid);
        set({ watchedMoviesCount: count });
      },

    }),
    {
      name: "user",
    }
  )
);
