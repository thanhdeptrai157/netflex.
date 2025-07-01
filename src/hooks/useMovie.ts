"use client";
import { useEffect, useState } from "react";
import MovieService from "@/services/movieService" ;
import { Episode, MovieDetail } from "@/types/movie";
import { toast } from "react-toastify";

export interface MovieDetailResponse {
    status: boolean;
    msg: string;
    movie: MovieDetail;
    episodes: Episode[];
  }
export const useMovie = (slug: string) => {
    const [data, setData] = useState<MovieDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchMovies = async () => {
            try {
               const response = await MovieService.getMovieBySlug(slug) as MovieDetailResponse;
               if(response.status) {
                setData(response);
               }
            } catch (err) {
                toast.error("Có lỗi xảy ra khi tải phim." + (err instanceof Error ? `: ${err.message}` : ""));
                setError("Có lỗi xảy ra khi tải phim.");
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [slug]);
    return { data, loading, error };
};
