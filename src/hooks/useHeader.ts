import { useEffect, useState } from "react";
import axios from "../configs/axios";
import { useHeaderStore} from "@/stores/headerStore";
import { Category, Country } from "@/types/header";
import CategoryService from "@/services/categoryService";
import CountryService from "@/services/countryService";


export const useHeader = () => {
    const {categories, countries, setCategories, setCountries} = useHeaderStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    useEffect(() => {
        const fetchCountries = async () => {
            if(countries.length > 0) return;
            try {
                const response = await CountryService.getAllCountries() as Country[];
                setCountries(response);
            } catch (err) {
                setError("Failed to fetch countries");
            }
        };

        const fetchCategories = async () => {
            if(categories.length > 0) return;
            try {
                const response = await CategoryService.getAllCategories() as Category[];
                setCategories(response);
            } catch (err) {
                setError("Failed to fetch categories");
            }
        };

        Promise.all([fetchCountries(), fetchCategories()])
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    }, []);

    return {
        countries,
        categories,
        loading,
        error,
    };
}
