import { useEffect, useState } from "react";
import MovieService from "@/services/movieService" ;
import { APP_DOMAIN_CDN_IMAGE } from "@/configs/env";
import { Movie } from "@/types/movie";
import { toast } from "react-toastify";
export const useSeriesMovie = (num: number) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const data = await MovieService.getSeriesMovies(1, num) as { status: string; data: { items: Movie[] } };
                if (data.status) {
                    const updatedMovies = data.data.items.map((item: Movie) => ({
                        ...item,
                        poster_url: item.poster_url?.startsWith(APP_DOMAIN_CDN_IMAGE ? APP_DOMAIN_CDN_IMAGE: "") ? item.poster_url : APP_DOMAIN_CDN_IMAGE + item.poster_url,
                        
                    }));
                    setMovies(updatedMovies);
                } else {
                    setMovies([]);
                }
            } catch (err) {
                toast.error("Có lỗi xảy ra khi tải phim." + (err instanceof Error ? `: ${err.message}` : ""));
                setError("Có lỗi xảy ra khi tải phim.");
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);
    
    return { movies, loading, error };
};

