"use client";
import { useNewUpdateMovie } from '@/hooks/useNewUpdateMovie';
import React from 'react';
import MovieCard from './movie-card';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const NewUpdateMovie = () => {
    const { movies, loading, error } = useNewUpdateMovie();

    return (
        <div className="mt-10 w-full">
            <div className="flex items-center">
                <h2 className="text-white text-[18px] font-bold mb-0">Phim mới cập nhật</h2>
                <button className="text-white ml-auto items-center bg-gradient-red-orange px-3 rounded-xl">Xem thêm</button>
            </div>

            <div className="mt-5">
                {loading ? (
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-3 mt-5">
                        {[...Array(6)].map((_, index) => (
                            <div
                                key={index}
                                className="animate-pulse bg-gray-700 rounded-lg aspect-[2/3] w-full"
                            />
                        ))}
                    </div>

                ) : error ? (
                    <p className="text-red-500 text-center mt-10">{error}</p>
                ) : (
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={16}
                        slidesPerView={2}
                        navigation
                        breakpoints={{
                            640: { slidesPerView: 3 },
                            768: { slidesPerView: 4 },
                            1024: { slidesPerView: 6 },
                        }}
                    >
                        {movies.map((movie) => (
                            <SwiperSlide key={movie._id}>
                                <MovieCard movie={movie} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
        </div>
    );
};

export default NewUpdateMovie;
