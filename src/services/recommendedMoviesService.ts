import { Movie, MovieDetail } from "@/types/movie";
import MovieService from "./movieService";
import { getAllWatchedMovieProgress, getFavoriteGenres } from "./userService";
import { getMoviesByFilter } from "./filterService";
import { searchMovies } from "./searchService";
import { APP_DOMAIN_CDN_IMAGE } from "@/configs/env";
interface Data {
    movie: MovieDetail;
}
// lấy danh sách phim đã xem gần đây
async function getRecentlyWatchedMovies(uid: string) {
    const watched = await getAllWatchedMovieProgress(uid);
    return Object.keys(watched);
}

// chi tiet phim da xem
async function getWatchedMoviesDetail(slugs: string[]) {
    return Promise.all(slugs.map(slug => MovieService.getMovieBySlug(slug)));
}


// đè xuất dựa trên phim đã xem ( phần 2, 3)
function cleanMovieName(name: string) {
    // Xoá các cụm: (Phần1), Phần 1, Season1, SS2, P.1, Ep3, Tập 4 (bỏ luôn dấu ngoặc nếu có)
    return name
      ?.replace(/\(?\b(Phần|Season|Tập|Movie|SS|P\.|Ep)\s*\d+\)?/gi, "")
      .replace(/\s{2,}/g, " ") // xoá khoảng trắng thừa
      .trim();
  }
  

async function getRelatedMoviesByName(watchedMovies: any) {
    const related: MovieDetail[] =[];

    for (const movie of watchedMovies) {
        const baseName = cleanMovieName(movie?.movie?.name);
        const result = await searchMovies(baseName, 1, 5) as {
            status: string
            data: any
        };
        if(result.status === "success") {
            const movies = result.data.items.map((item: MovieDetail) => ({
                ...item,
                poster_url: item.poster_url?.startsWith(APP_DOMAIN_CDN_IMAGE ? APP_DOMAIN_CDN_IMAGE : "") ? item.poster_url : APP_DOMAIN_CDN_IMAGE + item.poster_url,
                thumb_url: item.thumb_url?.startsWith(APP_DOMAIN_CDN_IMAGE ? APP_DOMAIN_CDN_IMAGE : "") ? item.thumb_url : APP_DOMAIN_CDN_IMAGE + item.thumb_url,
            }));
            related.push(...movies);
        }

    }
    return related;
}


async function getMoviesByFavoriteGenres(favouriteGenres: string[]){
    const genreMovies: MovieDetail[] = [];
        for (const genre of favouriteGenres) {
            const response = await getMoviesByFilter({
                type_list: "phim-le",
                page: 1,
                limit: 10,
                sort_field: "modified.time",
                sort_type: "desc",
                category: genre,
            }) as {
                status: string
                data: any
            };
            if(response.status === "success") {
                const movies = response.data.items.map((item: MovieDetail) => ({
                    ...item,
                    poster_url: item.poster_url?.startsWith(APP_DOMAIN_CDN_IMAGE ? APP_DOMAIN_CDN_IMAGE : "") ? item.poster_url : APP_DOMAIN_CDN_IMAGE + item.poster_url,
                        thumb_url: item.thumb_url?.startsWith(APP_DOMAIN_CDN_IMAGE ? APP_DOMAIN_CDN_IMAGE : "") ? item.thumb_url : APP_DOMAIN_CDN_IMAGE + item.thumb_url,
                }));
                genreMovies.push(...movies);
            }
        }
        return genreMovies;

}

export const getRecommendedMovies = async (uid: string) : Promise<MovieDetail[]> => {
    const watchedSlugs = await getRecentlyWatchedMovies(uid);
    const watchedMovies = await getWatchedMoviesDetail(watchedSlugs) as Data[];
    const favouriteGenres = await getFavoriteGenres(uid);
    const relatedMovies = await getRelatedMoviesByName(watchedMovies);
    const genreMovies = await getMoviesByFavoriteGenres(favouriteGenres);

    const allMovies = [...relatedMovies, ...genreMovies];

    const watchedIds = new Set(watchedMovies.map(data => data.movie._id));

    // loại bỏ phim đã xem rồi
    const uniqueMovies = Array.from(
        new Map(
            allMovies.filter(movie => !watchedIds.has(movie._id)).map(movie => [movie._id, movie])
        ).values()
    )
    return uniqueMovies;
}



