import { Category, Country } from "@/types/header";
import { create } from "zustand";
import { persist } from "zustand/middleware";


interface HeaderState {
    countries: Country[];
    categories: Category[];
    setCountries: (countries: Country[]) => void;
    setCategories: (categories: Category[]) => void;
}

export const useHeaderStore = create<HeaderState>()(
    persist(
        (set) => ({
            countries: [],
            categories: [],
            setCountries: (countries) => set({ countries }),
            setCategories: (categories) => set({ categories }),
        }),
        {
            name: "header-storage",
        }
    )
);

