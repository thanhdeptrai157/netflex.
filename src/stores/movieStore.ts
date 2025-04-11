import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MovieDetail, Episode, EpisodeData } from "@/types/movie";

interface MovieState {
    movieDetail: MovieDetail | null;
    episodes: Episode[];
    currentEpisode: EpisodeData | null;
    setMovieDetail: (detail: MovieDetail) => void;
    setEpisodes: (eps: Episode[]) => void;
    setCurrentEpisode: (ep: EpisodeData) => void;
    clearCurrentEpisode: () => void;
    clearMovie: () => void;
}

export const useMovieStore = create<MovieState>()(
    persist(
        (set) => ({
            currentEpisode: null,
            movieDetail: null,
            episodes: [],
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
