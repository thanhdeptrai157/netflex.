"use client"

import MovieCard from "@/components/movie-card"
import { useEffect, useState } from "react"
import { useLikedMovies } from "@/hooks/useLikedMovie"
import Pagination from "@/components/pagination"

const MAX_LENGTH = 10

const LikedMoviesSection = ({ likedMovies, uid }: { likedMovies: string[]; uid: string }) => {
  const { data, error, loading } = useLikedMovies(likedMovies)
  const [page, setPage] = useState(1)

  const movies = data || []
  const totalPages = Math.ceil(movies.length / MAX_LENGTH)
  const filteredMovies = movies.slice((page - 1) * MAX_LENGTH, page * MAX_LENGTH)

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 bg-slate-950 h-fit p-6 rounded-xl shadow-xl border border-slate-700">
        {loading ? (
          <div className="flex items-center justify-center col-span-4">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center col-span-5">Đã xảy ra lỗi khi tải phim 😢</div>
        ) : filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))
        ) : (
          <div className="text-slate-white text-center col-span-5">Chưa có phim nào trong danh sách</div>
        )}
      </div>

      {movies.length > MAX_LENGTH && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => {
            setPage(newPage)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      )}
    </>
  )
}

export default LikedMoviesSection
