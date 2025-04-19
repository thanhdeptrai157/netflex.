// "use client";
// import { useEffect, useState } from "react";
// import MovieService from "@/services/movieService" ;
// import { Episode, Movie, MovieDetail } from "@/types/movie";


// export const useWatchedMovies = (watchedMovies: string[]) => {
//     const [data, setData] = useState<MovieDetail[] | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const 
//     useEffect(() => {
//         const fetchMovies = async () => {
//             try {
//                const responses = await Promise.all(watchedMovies.map(slug => MovieService.getMovieBySlug(slug) as Promise<MovieDetail>));
//                const movies = responses.map((response : any) => {
//                 if (response.status) {
//                     return response.movie;
//                 } else {
//                     return null;
//                 }
//                }).filter(movie => movie !== null) as MovieDetail[];
//                setData(movies);
//             } catch (err) {
//                 setError("Có lỗi xảy ra khi tải phim.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchMovies();
//     }, [watchedMovies]);
//     return { data, loading, error };
// };
