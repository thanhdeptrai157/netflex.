"use client"

import { useMovie } from "@/hooks/useMovie"
import type { EpisodeData, Movie } from "@/types/movie"
import React, { useEffect, useState } from "react"
import { useMovieStore } from "@/stores/movieStore"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBookmark,
  faCalendarDays,
  faCirclePlay,
  faFilm,
  faLanguage,
  faStar,
  faTimes,
  faX,
} from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { addLikeMovie, getLikedMovies, removeLikeMovie } from "@/services/userService"
import { useUserStore } from "@/stores/userStore"
import { toast } from "react-toastify"

const MovieDetailComponent = ({ slug }: { slug: string }) => {
  const { loading, error, data } = useMovie(slug)
  const movie = data?.movie
  const episodesServer = data?.episodes ?? []
  const router = useRouter()
  const { setMovieDetail } = useMovieStore()
  const [showTrailer, setShowTrailer] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const {user, likedMovies, setLikedMovies } = useUserStore()
  const getYoutubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/)
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : ""
  }

  
  // lấy 3 tập mới nhất
  const newEps = episodesServer[0]?.server_data?.slice(
    Math.max(0, (episodesServer[0]?.server_data?.length || 0) - 3),
    episodesServer[0]?.server_data?.length,
  )

  useEffect(() => {
    if (data) {
      setMovieDetail(data.movie)
    }
  }, [data, setMovieDetail])

  // lấy từ store ra để lưu
  const { setEpisodes, setCurrentEpisode, addWatchedMovie, movieDetail } = useMovieStore()

  // lưu store và chuyển trang
  const handleSaveStore = (e: EpisodeData) => {
    setEpisodes(episodesServer)
    setCurrentEpisode(e)
    const watchPath = `/watch/${slug}`
    router.push(watchPath)
    addWatchedMovie(movieDetail as Movie)
  }

  const handleWatchNow = () => {
    setEpisodes(episodesServer)
    setCurrentEpisode(episodesServer[0].server_data[0])
    const watchPath = `/watch/${slug}`
    router.push(watchPath)
    addWatchedMovie(movieDetail as Movie)
  }

  const handleLikeMovie = () => {
    if (user) {
      const uid = user.uid
      addLikeMovie(uid, movieDetail?.slug as string)
      toast.success("Thêm vào yêu thích thành công", {autoClose: 1000})
      setLikedMovies()
    } else {
      // thong bao nguoi dung dang nhap
      toast.warning("Vui lòng đăng nhập để thêm vào yêu thích", {autoClose: 1000})
    }
  }
  const handleUnlikeMovie = () => {
    if (user) {
      const uid = user.uid
      removeLikeMovie(uid, movieDetail?.slug as string)
      toast.success("Xóa khỏi yêu thích thành công", {autoClose: 1000})
      setLikedMovies()
    }
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-8 p-6 bg-slate-800/50 rounded-xl backdrop-blur-sm">
        <FontAwesomeIcon icon={faTimes} className="text-4xl mb-4" />
        <p className="text-xl">Đã có lỗi xảy ra khi tải dữ liệu phim.</p>
        <p className="text-sm text-gray-400 mt-2">Vui lòng thử lại sau hoặc chọn phim khác.</p>
      </div>
    )
  }

  return (
    <div className="w-full relative">

      {!loading && movie?.poster_url && (
        <div className="absolute inset-0 -z-10 opacity-20">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${movie.poster_url})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/95 to-slate-900"></div>
        </div>
      )}


      <AnimatePresence>
        {showTrailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 z-50 w-full h-full bg-black/70 backdrop-blur-sm flex justify-center items-center"
            onClick={() => setShowTrailer(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-[90%] h-[250px] md:w-[800px] md:h-[450px] bg-black rounded-xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                width="100%"
                height="100%"
                src={getYoutubeEmbedUrl(movie?.trailer_url || "")}
                title="Trailer"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="rounded-xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-8xl flex flex-col lg:flex-row gap-10 w-full">

        <div className="w-full lg:w-[40%] xl:w-[30%] relative flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative group w-full"
          >
            {loading ? (
              <div className="w-full aspect-[2/3] bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl animate-pulse shadow-xl" />
            ) : (
              <div className="relative overflow-hidden rounded-xl shadow-[0_0_25px_rgba(0,0,0,0.3)] group">

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

                <img
                  src={movie?.poster_url || "/placeholder.svg"}
                  alt={movie?.name}
                  className={`w-full h-auto rounded-xl aspect-[2/3] object-cover transition-all duration-500 group-hover:scale-105 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
                  onLoad={() => setIsImageLoaded(true)}
                />

                {!isImageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl animate-pulse" />
                )}

                {movie?.quality && (
                  <div className="absolute top-3 left-3 bg-yellow-500 text-black font-bold px-2 py-1 rounded-md text-sm z-20 shadow-lg">
                    {movie.quality}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 md:transform md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300 opacity-100 translate-y-0 bg-gradient-to-t from-black/80 to-transparent md:bg-transparent">
                  <div className="flex gap-3 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-2 px-3 md:py-3 md:px-5 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-purple-500/30 transition-all duration-300 text-sm md:text-base cursor-pointer"
                      onClick={() => setShowTrailer(true)}
                    >
                      <FontAwesomeIcon icon={faCirclePlay} className="text-lg" />
                      <span>Xem trailer</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-2 px-3 md:py-3 md:px-5 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-red-500/30 transition-all duration-300 text-sm md:text-base cursor-pointer"
                      onClick={() => handleWatchNow()}
                    >
                      <FontAwesomeIcon icon={faFilm} className="text-lg" />
                      <span>Xem ngay</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full lg:w-[70%] flex flex-col gap-4"
        >
          {loading ? (
            <div className="flex flex-col gap-6">
              <div className="h-10 w-2/3 bg-gradient-to-r from-slate-700 to-slate-600 animate-pulse rounded-lg" />
              <div className="h-6 w-1/2 bg-gradient-to-r from-slate-700 to-slate-600 animate-pulse rounded-lg" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-5 w-full bg-gradient-to-r from-slate-700 to-slate-600 animate-pulse rounded-lg"
                    />
                  ))}
                </div>
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-5 w-full bg-gradient-to-r from-slate-700 to-slate-600 animate-pulse rounded-lg"
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="h-6 w-1/4 bg-gradient-to-r from-slate-700 to-slate-600 animate-pulse rounded-lg" />
                <div className="h-32 w-full bg-gradient-to-r from-slate-700 to-slate-600 animate-pulse rounded-lg" />
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2 ">
                <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-yellow-300">
                  {movie?.name}
                </h1>
                <h2 className="text-xl font-medium text-gray-400 italic">{movie?.origin_name}</h2>

                {movie?.status && (
                  <div className="inline-block bg-gradient-to-r from-green-600 to-green-500 text-white text-sm font-medium px-3 py-1 rounded-full mt-2">
                    {movie.status}
                  </div>
                )}
                
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[60%_40%] gap-7 mt-1 bg-slate-800/40 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendarDays} className="text-green-400 w-5" />
                    <span className="font-medium text-gray-300">Năm:</span>
                    <span className="text-white">{movie?.year == 0 ? "Đang cập nhật" : movie?.year}</span>
                  </div>

                  <div className="flex items-start gap-2 ">
                    <FontAwesomeIcon icon={faStar} className="text-yellow-400 w-5 mt-1" />
                    <span className="font-medium text-gray-300">Thể loại:</span>
                    <div className="flex flex-wrap gap-1">
                      {movie?.category?.map((item, idx) => (
                        <React.Fragment key={idx}>
                          <Link
                            className="text-white hover:text-lime-400 transition-colors duration-200"
                            href={`/category/${item.slug}`}
                          >
                            {item.name}
                          </Link>
                          {idx < movie.category.length - 1 && ", "}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <p className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faFilm} className="text-blue-400 w-5" />
                    <span className="font-medium text-gray-300">Số tập:</span>
                    <span className="text-white">
                      {movie?.episode_total == "0" ? "Đang cập nhật" : movie?.episode_total}
                    </span>
                  </p>

                  <p className="text-gray-300">
                    <span className="font-medium">Đạo diễn:</span>
                    <span className="text-white ml-2">{movie?.director || "Đang cập nhật"}</span>
                  </p>

                  <div className="text-gray-300">
                    <span className="font-medium">Diễn viên:</span>
                    <div className="text-white mt-1 flex flex-wrap gap-1">
                      {movie?.actor?.length ? (
                        movie.actor.map((actor, idx) => (
                          <span key={idx} className="inline-block bg-slate-700/70 px-2 py-1 rounded-md text-sm">
                            {actor}
                          </span>
                        ))
                      ) : (
                        <span>Đang cập nhật</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-gray-300">
                    <span className="font-medium">Thời lượng:</span>
                    <span className="text-white ml-2">{movie?.time || "Đang cập nhật"}</span>
                  </p>

                  <p className="text-gray-300">
                    <span className="font-medium">Trạng thái:</span>
                    <span className="text-white ml-2">{movie?.status || "Đang cập nhật"}</span>
                  </p>

                  <p className="text-gray-300">
                    <span className="font-medium">Chất lượng:</span>
                    <span className="text-white ml-2">{movie?.quality || "Đang cập nhật"}</span>
                  </p>

                  <p className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faLanguage} className="text-purple-400 w-5" />
                    <span className="font-medium text-gray-300">Ngôn ngữ:</span>
                    <span className="text-white">{movie?.lang || "Đang cập nhật"}</span>
                  </p>

                  <p className="text-gray-300">
                    <span className="font-medium">Tập hiện tại:</span>
                    <span className="text-white ml-2 bg-green-600/80 px-2 py-0.5 rounded-md">
                      {movie?.episode_current || "Đang cập nhật"}
                    </span>
                  </p>
                  <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-lime-400 to-green-600 text-white font-bold py-1 px-3 md:py-2 md:px-5 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 text-sm md:text-base cursor-pointer"
                      onClick={() => {
                        if (likedMovies.includes(movieDetail?.slug as string)) {
                          handleUnlikeMovie()
                          
                        } else {
                          handleLikeMovie()
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faBookmark} className="text-lg" />
                      <span>{likedMovies.includes(movieDetail?.slug as string) ? "Xoá khỏi yêu thích" : "Thêm vào yêu thích"}</span>
                    </motion.button>
                </div>
              </div>

              <div className="mt-1">
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-yellow-300 mb-3">
                  Nội dung
                </h3>
                <div className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50">
                  <p className="text-gray-200 leading-relaxed">{movie?.content || "Nội dung đang được cập nhật..."}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-yellow-300 mb-3">
                  Tập mới nhất
                </h3>
                <div className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50">
                  {newEps?.length > 0 && newEps[0]?.name !== "" ? (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {newEps.map((ep, epIndex) => (
                        <motion.div
                          key={epIndex}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gradient-to-br from-slate-700 to-slate-800 hover:from-green-600 hover:to-green-700 text-white text-center py-3 px-2 rounded-lg cursor-pointer transition-all duration-300 shadow-md hover:shadow-green-500/20 border border-slate-600 hover:border-green-500"
                          title={ep.name}
                          onClick={() => handleSaveStore(ep)}
                        >
                          <div className="font-medium">{ep.name}</div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-white text-center py-4 bg-slate-700/50 rounded-lg">Đang cập nhật tập mới</div>
                  )}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default MovieDetailComponent
