import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MovieDetail, Episode, EpisodeData, Movie } from "@/types/movie";

interface MovieState {
    movieDetail: MovieDetail | null;
    episodes: Episode[];
    currentEpisode: EpisodeData | null;
    watchedMovie: Movie[];
    setMovieDetail: (detail: MovieDetail) => void;
    setEpisodes: (eps: Episode[]) => void;
    setCurrentEpisode: (ep: EpisodeData) => void;
    clearCurrentEpisode: () => void;
    clearMovie: () => void;
    addWatchedMovie: (movies: Movie) => void
}

export const useMovieStore = create<MovieState>()(
    persist(
        (set) => ({
            currentEpisode: null,
            movieDetail: null,
            episodes: [],
            watchedMovie: [], 
            addWatchedMovie: (movie) => {
                set((state) => {
                    const updatedMovies = [movie, ...state.watchedMovie.filter((s) => s._id !== movie._id)].slice(0, 10);
                    return { watchedMovie: updatedMovies};
                });
            },
            setCurrentEpisode: (ep) => set({ currentEpisode: ep }),
            setMovieDetail: (detail) => set({ movieDetail: detail }),
            setEpisodes: (eps) => set({ episodes: eps }),
            clearMovie: () => set({ movieDetail: null, episodes: [] }),
            clearCurrentEpisode: () => set({ currentEpisode: null }),
        }),
        {
            name: "movie-storage", 
        }
    )
);
