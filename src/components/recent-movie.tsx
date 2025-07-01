"use client"

import { useMovieStore } from "@/stores/movieStore"
import { useRouter } from "next/navigation"
import type { Movie } from "@/types/movie"
import { motion } from "framer-motion"
import { Clock, Film } from "lucide-react"

const RecentMovie = () => {
  const { watchedMovie } = useMovieStore()
  const router = useRouter()

  const handleClick = (slug: string) => {
    router.push(`/movie/${slug}`)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-4 p-4">
      {watchedMovie.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center p-8 rounded-lg border border-white/10 bg-slate-800/50 text-center"
        >
          <Film className="h-12 w-12 text-green-500 mb-3 opacity-50" />
          <p className="text-white/80 text-lg font-medium">Chưa có phim nào</p>
          <p className="text-white/50 text-sm mt-1">Your recently watched movies will appear here</p>
        </motion.div>
      ) : (
        <div className="overflow-y-auto pr-2 custom-scrollbar">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
            {watchedMovie.map((movie: Movie) => (
              <motion.div
                key={movie._id}
                variants={item}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex gap-4 bg-gradient-to-r from-slate-800 to-slate-800/80 cursor-pointer items-start p-3 rounded-lg border border-white/10 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300"
                onClick={() => handleClick(movie.slug)}
              >
                <div className="w-[60px] h-[90px] md:w-[100px] md:h-[150px] relative flex-shrink-0 overflow-hidden rounded-md shadow-md">
                  <img
                    src={movie.poster_url || "/placeholder.svg"}
                    alt={movie.name}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="flex flex-col justify-between py-1 overflow-hidden flex-1">
                  <div>
                    <h3 className="text-green-500 text-sm md:text-xl font-bold truncate">{movie.name}</h3>
                    <p className="text-white/80 text-xs md:text-sm font-medium truncate mt-1">{movie.origin_name}</p>
                  </div>

                  <div className="mt-2 md:mt-auto flex flex-wrap gap-2">
                    <span className="inline-block px-2 py-1 text-xs rounded-md bg-slate-700/50 text-white/70 border border-white/10">
                      {movie.year}
                    </span>

                    {movie.quality && (
                      <span className="inline-block px-2 py-1 text-xs rounded-md bg-green-500/20 text-green-500 border border-green-500/30">
                        {movie.quality}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default RecentMovie
