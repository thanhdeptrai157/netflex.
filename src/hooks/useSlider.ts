import { APP_DOMAIN_CDN_IMAGE } from "@/configs/env";
import MovieService from "@/services/movieService";
import { Movie, MovieDetail } from "@/types/movie";
import { useEffect, useState } from "react";

// slider cho các phim mới năm hiện tại
export const useSlider = () => {
    const [movies, setMovies] = useState<MovieDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const currentYear = new Date().getFullYear(); 
                const data = await MovieService.getMoviesByYear(currentYear) as { status: string; data: { items: MovieDetail[] } };
                
                if (data.status === "success") {
                    const updatedMovies = data.data.items.slice(0, 9).map((item: any) => ({
                        ...item,
                        poster_url: APP_DOMAIN_CDN_IMAGE + item.poster_url,
                        thumb_url: APP_DOMAIN_CDN_IMAGE + item.thumb_url,
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
    console.log(movies);
    return { movies, loading, error };
};
