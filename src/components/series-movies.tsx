import { useSeriesMovie } from "@/hooks/useSeriesMovie";
import React from "react";
import MovieCard from "./movie-card";
import { useRouter } from "next/navigation";

const NUM_MOVIES = 12;
const SeriesMovie = () => {
  const { movies, loading, error } = useSeriesMovie(NUM_MOVIES);
  const router = useRouter();
  const handleLoadMore = () => {
    router.push("/list/phim-bo");
  };
  return (
    <div className="mt-10 w-full">
      <div className="flex items-center ">
        <h2 className="text-white text-xl font-bold mb-0">Phim Bộ</h2>
        <button
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white font-semibold shadow-lg hover:brightness-110 transition-all duration-300 cursor-pointer hover:transform hover:scale-105"
          onClick={handleLoadMore}
        >
          <span>🔥 Xem thêm</span>
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-3 mt-5 ">
        {loading ? (
          [...Array(12)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-200 h-60 rounded-lg aspect-[2/3] w-full"
            />
          ))
        ) : error ? (
          <p className="text-red-500 text-center mt-10">{error}</p>
        ) : (
          movies.map((movie) => <MovieCard key={movie._id} movie={movie} />)
        )}
      </div>
    </div>
  );
};

export default SeriesMovie;
