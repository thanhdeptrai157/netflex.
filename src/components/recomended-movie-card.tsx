"use client"

import type { MovieDetail } from "@/types/movie"
import { Info, Star } from "lucide-react"
import { useRouter } from "next/navigation"



const RecommendedMovieCard = ({ movie }: { movie: MovieDetail }) => {
  const router = useRouter();
  const onSelect = (movie: MovieDetail) => {
    router.push(`/movie/${movie.slug}`)
  }
  return (
    <div
      className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-purple-500 transition-all shadow-lg hover:shadow-purple-900/20 cursor-pointer group"
      onClick={() => onSelect(movie)}
    >
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <img
          src={movie.thumb_url || movie.poster_url}
          alt={movie.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80"></div>
        <div className="absolute bottom-0 left-0 p-3">
          <h3 className="text-white font-bold line-clamp-1">{movie.name}</h3>
          <p className="text-slate-300 text-xs">{movie.origin_name}</p>
        </div>
        <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-md">
          {movie.quality}
        </div>
      </div>

      <div className="p-3 space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">{movie.year}</span>
            <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">
              {movie.episode_current}/{movie.episode_total || "?"}
            </span>
          </div>
          
        </div>

        <div className="flex flex-wrap gap-1">
          {movie.category?.slice(0, 3).map((cat) => (
            <span key={cat._id} className="text-xs text-slate-400">
              {cat.name}
              {movie.category.indexOf(cat) < Math.min(2, movie.category.length - 1) ? "," : ""}
            </span>
          ))}
          {movie.category?.length > 3 && <span className="text-xs text-slate-500">+{movie.category.length - 3}</span>}
        </div>

        <div className="pt-2 flex justify-between items-center border-t border-slate-700">
          <span className="text-xs text-slate-400">{movie.time}</span>
          <button className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-xs">
            <Info className="w-3 h-3" /> Chi tiết
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecommendedMovieCard
