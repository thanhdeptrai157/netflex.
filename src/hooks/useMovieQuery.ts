import { queryKeys } from "@/lib/queryKeys";
import MovieService from "@/services/movieService";
import { Episode, MovieDetail } from "@/types/movie";
import { useQuery } from "@tanstack/react-query";

export interface MovieDetailResponse {
    status: boolean;
    msg: string;
    movie: MovieDetail;
    episodes: Episode[];
}

export const useMovieQuery = (slug: string) => {
    return useQuery({
        queryKey: queryKeys.movie.detail(slug),
        queryFn: async (): Promise<MovieDetailResponse> => {
            const response = await MovieService.getMovieBySlug(slug) as MovieDetailResponse;
            if(!response.status) {
                throw new Error(response.msg || "Lấy dữ liệu thất bại");
            }
            return response;
        },
        enabled : !!slug,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 20,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        throwOnError: true,
    });
}