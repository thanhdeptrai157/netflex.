import { getLikedMovies, getWatchedMoviesCount } from "@/services/userService";
import { MovieDetail } from "@/types/movie";
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
  userTimestamp: number | null;
  recommendedMovies: MovieDetail[];
  setRecommendedMovies: (movies: MovieDetail[]) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      userTimestamp: null,
      setUser: (user) => set({ user, userTimestamp: Date.now() }),
      clearUser: () =>
        set({ user: null, likedMovies: [], watchedMoviesCount: 0, userTimestamp: null }),
      likedMovies: [],

      // set lại số lượng phim đã thích từ Firestore
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
      // set lại số lượng phim đã xem từ Firestore
      setWatchedMoviesCount: async () => {
        const { user } = get();
        if (!user?.uid) return;
        const count = await getWatchedMoviesCount(user.uid);
        set({ watchedMoviesCount: count });
      },

      recommendedMovies: [],
      setRecommendedMovies: (movies) => set(
        { recommendedMovies: movies }
      ),

    }),
    {
      name: "user",
    }
  )
);
