"use client"

import { useState, useEffect, useRef } from "react"
import type { Episode, EpisodeData, Movie } from "@/types/movie"
import { useMovieStore } from "@/stores/movieStore"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLayerGroup, faPlay, faServer } from "@fortawesome/free-solid-svg-icons"

const EpisodeList = ({ episodes, name }: { episodes: Episode[]; name: string }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [selectedServerIndex, setSelectedServerIndex] = useState(0)
  const [isScrollable, setIsScrollable] = useState(false)
  const episodeGridRef = useRef<HTMLDivElement>(null)
  const { setEpisodes, setCurrentEpisode, addWatchedMovie, currentEpisode, movieDetail } = useMovieStore()

  useEffect(() => {
    const checkScrollable = () => {
      if (episodeGridRef.current) {
        setIsScrollable(episodeGridRef.current.scrollHeight > episodeGridRef.current.clientHeight)
      }
    }

    checkScrollable()
    window.addEventListener("resize", checkScrollable)
    return () => window.removeEventListener("resize", checkScrollable)
  }, [episodes, selectedServerIndex])

  useEffect(() => {
    if (episodeGridRef.current && currentEpisode) {
      const currentEpisodeElement = episodeGridRef.current.querySelector(".current-episode")
      if (currentEpisodeElement) {
        currentEpisodeElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }
    }
  }, [currentEpisode, selectedServerIndex])

  const handleSaveStore = (e: EpisodeData) => {
    setEpisodes(episodes)
    setCurrentEpisode(e)

    const watchPath = `/watch/${name}`
    if (pathname !== watchPath) {
      router.push(watchPath)
    }

    addWatchedMovie(movieDetail as Movie)
  }

  const selectedServer = episodes?.[selectedServerIndex]
  const totalEpisodes = selectedServer?.server_data?.length || 0

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faLayerGroup} className="text-green-400" />
          <h4 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-yellow-300">
            Danh sách tập phim
          </h4>
          {totalEpisodes > 0 && (
            <span className="bg-slate-700 text-white text-xs px-2 py-1 rounded-full">{totalEpisodes} tập</span>
          )}
        </div>

        {episodes?.length > 1 && (
          <div className="text-sm text-slate-400 flex items-center gap-1">
            <FontAwesomeIcon icon={faServer} className="text-slate-500" />
            <span>Server:</span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {episodes?.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap gap-2 mb-4"
          >
            {episodes?.map((server, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 font-medium cursor-pointer shadow-md flex items-center gap-2 ${
                  index === selectedServerIndex
                    ? "bg-gradient-to-r from-green-600 to-green-500 text-white"
                    : "bg-slate-700 text-gray-200 hover:bg-slate-600"
                }`}
                onClick={() => setSelectedServerIndex(index)}
              >
                {index === selectedServerIndex && <FontAwesomeIcon icon={faPlay} className="text-xs" />}
                {server.server_name}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50 shadow-lg"
      >
        {isScrollable && (
          <div className="w-full flex justify-center mb-2">
            <div className="bg-slate-700/50 rounded-full h-1 w-16">
              <div className="bg-green-500 h-1 w-1/2 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}

        <div
          ref={episodeGridRef}
          className="max-h-[300px] lg:max-h-[570px] overflow-y-auto pr-2 custom-scrollbar"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#22c55e #1f2937",
          }}
        >
          <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {selectedServer?.server_data?.map((ep, epIndex) => {
              const isCurrentEpisode = currentEpisode?.name?.trim() === ep.name?.trim()
              return (
                <motion.div
                  key={epIndex}
                  whileHover={{ scale: 1.00 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative group ${isCurrentEpisode ? "current-episode" : ""}`}
                >
                  <div
                    className={`
                      flex items-center justify-center py-2 px-1 rounded-lg cursor-pointer transition-all duration-300
                      ${
                        isCurrentEpisode
                          ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/20"
                          : "bg-slate-700 text-gray-200 hover:bg-slate-600 group-hover:shadow-md"
                      }
                    `}
                    title={ep.name}
                    onClick={() => handleSaveStore(ep)}
                  >
                    <div className="font-medium text-center">
                      {isCurrentEpisode && (
                        <motion.div
                          className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                        />
                      )}
                      {ep.name}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {selectedServer?.server_data?.length === 0 && (
          <div className="py-8 text-center text-slate-400">
            <div className="text-5xl mb-3 opacity-50">📺</div>
            <p>Chưa có tập phim nào được cập nhật</p>
          </div>
        )}
      </motion.div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #22c55e;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #16a34a;
        }
      `}</style>
    </div>
  )
}

export default EpisodeList
