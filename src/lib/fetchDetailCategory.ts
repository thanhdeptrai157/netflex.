
import MovieService from "@/services/movieService";
import { Episode, MovieDetail } from "@/types/movie";

export interface MovieDetailResponse {
  status: boolean;
  msg: string;
  movie: MovieDetail;
  episodes: Episode[];
}

export const fetchMovieDetail = async (slug: string): Promise<MovieDetail | null> => {
  try {
    const response = await MovieService.getMovieBySlug(slug) as MovieDetailResponse;
    if (response.status) {
      return response.movie as MovieDetail;
    } else {
      console.warn(`Lấy dữ liệu phim thất bại: ${response.msg}`);
      return null;
    }
  } catch (err) {
    console.error("Lỗi khi gọi API lấy phim:", err);
    return null;
  }
};
