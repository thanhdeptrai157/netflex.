import { useEffect, useState } from "react";
import MovieService from "@/services/movieService" ;
import { APP_DOMAIN_CDN_IMAGE } from "@/configs/env";
import { MovieDetail } from "@/types/movie";
import { toast } from "react-toastify";
export const useNewUpdateMovie = () => {
    const [movies, setMovies] = useState<MovieDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const data = await MovieService.getNewUpdateMovies(1, 24) as { status: boolean;  items: MovieDetail[] };
                if (data.status) {
                    const updatedMovies = data.items.map((item: MovieDetail) => ({
                        ...item,       
                        poster_url: item.poster_url?.startsWith(APP_DOMAIN_CDN_IMAGE ? APP_DOMAIN_CDN_IMAGE : "") ? item.poster_url : APP_DOMAIN_CDN_IMAGE + item.poster_url,
                        thumb_url: item.thumb_url?.startsWith(APP_DOMAIN_CDN_IMAGE ? APP_DOMAIN_CDN_IMAGE : "") ? item.thumb_url : APP_DOMAIN_CDN_IMAGE + item.thumb_url,
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
