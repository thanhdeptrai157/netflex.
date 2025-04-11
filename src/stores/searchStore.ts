// store lưu các lượt tìm kiếm phim
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Movie } from "@/types/movie";


// lưu 5 lượt tìm kiếm gần nhất và 1 danh sách phim của lượt tìm kiếm gần nhất
interface SearchState {
    recentSearches: string[]; 
    recentMovies: Movie[]; 
    addSearch: (search: string) => void; 
    setRecentMovies: (movies: Movie[]) => void; 
    clearSearches: () => void; 
}

export const useSearchStore = create<SearchState>()(
    persist(
        (set) => ({
            recentSearches: [],
            recentMovies: [],
            addSearch: (search) => {
                set((state) => {
                    const updatedSearches = [search, ...state.recentSearches.filter((s) => s !== search)].slice(0, 5);
                    return { recentSearches: updatedSearches };
                });
            },
            setRecentMovies: (movies) => set({ recentMovies: movies }),
            clearSearches: () => set({ recentSearches: [] }),
        }),
        {
            name: "search-storage", 
        }
    )
);
