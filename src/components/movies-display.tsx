'use client'

import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'

import { Movie } from '@/types/movie'
import MovieCard from './movie-card'

interface Props {
  movies: Movie[]
}

const MovieDisplay = ({ movies }: Props) => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6 lg:gap-3">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  )
}

export default MovieDisplay