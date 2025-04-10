import React, { useState, useEffect } from 'react';
import { useSlider } from '@/hooks/useSlider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faLanguage, faPlay } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

const Slider = () => {
    const { movies, loading, error } = useSlider();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 5000);
        return () => clearInterval(interval);
    }, [currentIndex]);

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex(prev => (prev === 0 ? movies.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex(prev => (prev === movies.length - 1 ? 0 : prev + 1));
    };

    if (loading) {
        return (
            <div className="animate-pulse bg-gray-500 h-60 sm:h-100 md:h-150 w-full rounded-xl"></div>
        );
    }

    if (error) {
        return <p className="text-red-500 text-center mt-10">{error}</p>;
    }

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -300 : 300,
            opacity: 0,
        }),
    };

    const movie = movies[currentIndex];

    return (
        <div className="w-full rounded-xl overflow-hidden relative text-white transition-all duration-300 aspect-[4/2]">
            <AnimatePresence initial={false} custom={direction}>
                <motion.img
                    key={movie._id}
                    src={movie.thumb_url}
                    alt={movie.name}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.6 }}
                    className="absolute w-full object-cover aspect-[4/2] top-0 left-0"
                />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/40 z-10" />

            <div className="absolute top-1/2 -translate-y-1/2 left-10 sm:left-20 z-20 max-w-[90%] sm:max-w-[70%] md:max-w-[50%]">
                <h2 className="text-green-yellow font-black text-sm sm:text-3xl md:text-4xl mb-2">{movie.name}</h2>
                <p className="text-white hidden sm:block sm:text-xl md:text-2xl font-semibold mb-4">
                    {movie.origin_name}
                </p>

                <div className="flex items-center gap-3 flex-wrap text-xs sm:text-sm mb-3">
                    <span className="px-2 py-0.5 sm:px-3 sm:py-1 border border-white rounded-full">T13</span>
                    <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faCalendar} /> {movie.year}
                    </span>
                </div>

                <div className="flex items-center gap-4 text-xs sm:text-sm mb-4 flex-wrap">
                    <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faLanguage} /> Ngôn ngữ: {movie.lang || 'Cập nhật'}
                    </span>
                    <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faPlay} /> Chất lượng: {movie.quality}
                    </span>
                </div>

                <button className="mt-2 px-3 py-2 sm:px-4 sm:py-2 bg-red-500 text-black font-semibold rounded-md flex items-center gap-2 hover:bg-red-600 transition-all text-sm sm:text-base cursor-pointer">
                    <FontAwesomeIcon icon={faPlay} /> Xem
                </button>
            </div>


            <div
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 text-white text-2xl sm:text-4xl cursor-pointer hover:scale-125 transition-all"
            >
                &#10094;
            </div>
            <div
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 text-white text-2xl sm:text-4xl cursor-pointer hover:scale-125 transition-all"
            >
                &#10095;
            </div>
        </div>
    );
};

export default Slider;
