import { useEffect, useState } from "react";
import MovieService from "@/services/movieService" ;
import { APP_DOMAIN_CDN_IMAGE } from "@/configs/env";
import { Movie } from "@/types/movie";
export const useMovie = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const data = await MovieService.getSeriesMovies() as { status: string; data: { items: any[] } };
                if (data.status === "success") {
                    const updatedMovies = data.data.items.map((item: any) => ({
                        ...item,
                        poster_url: APP_DOMAIN_CDN_IMAGE + item.poster_url,
                    }));
                    setMovies(updatedMovies);
                } else {
                    setMovies([]);
                }
            } catch (err) {
                setError("Có lỗi xảy ra khi tải phim.");
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);
    
    return { movies, loading, error };
};

