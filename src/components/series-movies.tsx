import { useSeriesMovie } from '@/hooks/useSeriesMovie';
import React from 'react'
import MovieCard from './movie-card';

const SeriesMovie = () => {
    const { movies, loading, error } = useSeriesMovie();
    return (
        <div className="mt-10 w-full">
            <div className="flex items-center ">
                <h2 className="text-white text-[18px] font-bold mb-0">Phim Bộ</h2>
                <button className="text-white ml-auto items-center bg-gradient-red-orange px-3 rounded-xl">Xem thêm</button>
            </div>
            <div className='flex gap-6 mt-5 flex-wrap justify-center'>
                {loading ? (
                    [...Array(12)].map((_, index) => (
                        <div key={index} className="animate-pulse bg-gray-200 h-60 w-[45%] sm:w-[30%] md:w-[17%] lg:w-[15%] rounded-lg" />
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