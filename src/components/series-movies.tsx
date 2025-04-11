import { useSeriesMovie } from '@/hooks/useSeriesMovie';
import React from 'react'
import MovieCard from './movie-card';

const NUM_MOVIES = 12
const SeriesMovie = () => {
    const { movies, loading, error } = useSeriesMovie(NUM_MOVIES);
    return (
        <div className="mt-10 w-full">
            <div className="flex items-center ">
                <h2 className="text-white text-[18px] font-bold mb-0">Phim Bộ</h2>
                <button className="text-white ml-auto items-center bg-gradient-red-orange px-3 rounded-xl">Xem thêm</button>
            </div>
            <div className='grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-3 mt-5 '>
                {loading ? (
                    [...Array(12)].map((_, index) => (
                        <div key={index} className="animate-pulse bg-gray-200 h-60 rounded-lg aspect-[2/3] w-full" />
                    ))
                ) : error ? (
                    <p className="text-red-500 text-center mt-10">{error}</p>
                ) : (
                    movies.map((movie) => (
                        <MovieCard key={movie._id} movie={movie} />
                    ))
                )}
            </div>
        </div>
    )
}

export default SeriesMovie