"use client"
import { useMovieStore } from '@/stores/movieStore';
import { Movie } from '@/types/movie';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation';
import React from 'react'

// item for each movie
const MovieCard = ({ movie }: { movie: Movie }) => {

    const router = useRouter();
    const { clearCurrentEpisode } = useMovieStore()
    const handleNavigate = () => {
        router.push(`/movie/${movie.slug}`);
        clearCurrentEpisode()
    }

  return (
    // <div className='text-center rounded-xl bg-slate-800 overflow-hidden w-[190px] sm:w-[190px] md:w-[170px] lg:w-[170px] xl:w-[200px]' >
    <div className='relative text-center rounded-xl bg-slate-800 overflow-hidden' 
    onClick={handleNavigate}>
      <div className='w-full overflow-hidden cursor-pointer relative group'>
        <div className='absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10'>
          <button className='text-white w-[50px] h-[50px] text-[14px] rounded-full border border-white mr-5 ml-5 cursor-pointer'>
            <FontAwesomeIcon icon={faPlay} color='white' size='xl' />
          </button>
        </div>
        <img src={movie.poster_url} alt={movie.name} className="w-full block object-cover aspect-[4/5] transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:opacity-60"
         />
        <span className='font-bold absolute top-1 left-2 text-white bg-gradient-blue-purple p-[2px] rounded-md px-2 text-[13px] max-w-[90%] truncate'>
          {movie.quality ? `${movie.quality} + ${movie.lang}` : `Năm ${movie.year}`}
        </span>
        <span className='font-medium absolute bottom-1 right-2 text-white bg-gradient-red-orange p-[2px] rounded-sm text-[12px]
        px-2 '>
          {movie.episode_current}
        </span>
      </div>
      <h4 className='truncate ml-1 font-bold mt-3 cursor-pointer text-[15px] text-green-yellow'>{movie.name}</h4>
      <h5 className='truncate ml-2 mb-2 text-[14px] text-white'>{movie.origin_name}</h5>
    </div>
  )
}

export default MovieCard