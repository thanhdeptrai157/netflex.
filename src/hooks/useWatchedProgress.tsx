import { useEffect, useState } from "react";
import MovieService from "@/services/movieService";
import { MovieDetail } from "@/types/movie";

interface WatchedMovieItem {
    episode: string;
    currentTime: number;
}

interface WatchedMovies {
    [slug: string]: WatchedMovieItem;
}

interface WatchedMovieData {
    movie: MovieDetail;
    episode: string;
    currentTime: number;
}

export const useWatchedMovies = (uid: string, watchedMovies: WatchedMovies) => {
    const [data, setData] = useState<WatchedMovieData[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            if (!uid || !watchedMovies || Object.keys(watchedMovies).length === 0) {
                setData([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const slugs = Object.keys(watchedMovies);

                const responses = await Promise.all(
                    slugs.map(slug => MovieService.getMovieBySlug(slug) as Promise<MovieDetail>)
                );

                const moviesData: WatchedMovieData[] = responses
                    .map((response: any, index) => {
                        const slug = slugs[index];
                        const movieInfo = watchedMovies[slug];

                        if (response?.status && response?.movie) {
                            return {
                                movie: response.movie,
                                episode: movieInfo.episode,
                                currentTime: movieInfo.currentTime,
                            };
                        }

                        return null;
                    })
                    .filter(Boolean) as WatchedMovieData[];

                setData(moviesData);
            } catch (err) {
                console.error(err);
                setError("Có lỗi xảy ra khi tải danh sách phim đã xem.");
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [uid, watchedMovies]);

    return { data, loading, error };
};
