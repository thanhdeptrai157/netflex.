"use client"
import { useUserStore } from "@/stores/userStore"
import { Clock, Film, Star, User, X } from 'lucide-react'
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getFavoriteGenres, saveFavoriteGenres } from "@/services/userService"
import { AnimatePresence, motion } from "framer-motion"
import { useHeaderStore } from "@/stores/headerStore"
import WatchedProgress from "@/components/watched-progress"
import LikedMoviesSection from "@/components/liked-movies-section"
import type { MovieDetail } from "@/types/movie"
import RecommendedMovieCard from "@/components/recomended-movie-card"



const MAX_LENGTH = 6

const ProfilePage = () => {
  const { user } = useUserStore()
  const { likedMovies, setWatchedMoviesCount, watchedMoviesCount, recommendedMovies } = useUserStore()
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([])
  const [tempGenres, setTempGenres] = useState<string[]>([])
  const [showGenrePopup, setShowGenrePopup] = useState(false)
  const [activeTab, setActiveTab] = useState("watched")
  const router = useRouter()

  useEffect(() => {
    setWatchedMoviesCount()
  }, [user])

  const { categories } = useHeaderStore()

  const [shuffledRecommended, setShuffledRecommended] = useState<MovieDetail[]>([])

  // xáo trộn danh sách phim đề xuất
  // và lấy ra tối đa MAX_LENGTH phim

  // hàm xáo trộn
  const shuffleMovies = () => {
    if (recommendedMovies.length > 0) {
      const shuffled = [...recommendedMovies].sort(() => 0.5 - Math.random())
      setShuffledRecommended(shuffled.slice(0, MAX_LENGTH))
    }
  }

  useEffect(() => {
    shuffleMovies()
  }, [recommendedMovies])


  const genreEmojis: Record<string, string> = {
    "hanh-dong": "🔥",
    "mien-tay": "🤠",
    "tre-em": "🧒",
    "lich-su": "📜",
    "co-trang": "🏯",
    "chien-tranh": "⚔️",
    "vien-tuong": "👽",
    "kinh-di": "👻",
    "tai-lieu": "📚",
    "bi-an": "🕵️",
    "phim-18": "🔞",
    "tinh-cam": "❤️",
    "tam-ly": "🧠",
    "the-thao": "🏆",
    "phieu-luu": "🧭",
    "am-nhac": "🎵",
    "gia-dinh": "👨‍👩‍👧‍👦",
    "hoc-duong": "🏫",
    "hai-huoc": "😂",
    "hinh-su": "🚓",
    "vo-thuat": "🥋",
    "khoa-hoc": "🔬",
    "than-thoai": "⚡",
    "chinh-kich": "🎭",
    "kinh-dien": "🎬",
  }

  const genreList = categories.map((genre) => ({
    label: `${genreEmojis[genre.slug] || "🎞️"} ${genre.name}`,
    value: genre.slug,
  }))

  useEffect(() => {
    const fetchGenres = async () => {
      if (user) {
        const genres = await getFavoriteGenres(user.uid)
        setFavoriteGenres(genres || [])
        if (!genres || genres.length === 0) {
          setTempGenres(genres || [])
          setShowGenrePopup(true)
        }
      }
    }
    fetchGenres()
  }, [user])

  const toggleGenre = (slug: string) => {
    setTempGenres((prev) => (prev.includes(slug) ? prev.filter((g) => g !== slug) : [...prev, slug]))
  }

  const handleSaveGenres = async () => {
    if (user) {
      setFavoriteGenres(tempGenres)
      await saveFavoriteGenres(user.uid, tempGenres)
      setShowGenrePopup(false)
    }
  }

  const openEditGenres = () => {
    setTempGenres(favoriteGenres)
    setShowGenrePopup(true)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="text-center p-8 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 max-w-md mx-auto">
          <User className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h1 className="text-3xl font-bold text-white mb-2">Chưa đăng nhập</h1>
          <p className="text-slate-300 mb-6">Vui lòng đăng nhập để xem thông tin cá nhân</p>
          <button
            className="px-6 py-3 cursor-pointer bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all"
            onClick={() => router.push("/login")}
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <AnimatePresence>
        {showGenrePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-xl relative"
            >
              <button
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"
                onClick={() => setShowGenrePopup(false)}
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">🎬 Thêm thể loại yêu thích</h2>
              <p className="text-slate-400 mb-6">
                Chọn những thể loại bạn yêu thích để chúng tôi gợi ý phim phù hợp nhất!
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {genreList.map((genre) => (
                  <button
                    key={genre.label}
                    onClick={() => toggleGenre(genre.value)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium border transition-colors flex items-center gap-1
                      ${tempGenres.includes(genre.value)
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700"
                      }`}
                  >
                    {genre.label}
                  </button>
                ))}
              </div>
              <div className="text-right">
                <button
                  onClick={handleSaveGenres}
                  className="w-full sm:w-auto px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
                >
                  Lưu lựa chọn
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white pb-20">
        <div className="h-32 sm:h-40 md:h-50 bg-gradient-to-r from-purple-900 to-indigo-900 relative">
          <div className="absolute inset-0 bg-[url('/bg-profile.jpg')] opacity-20 bg-cover bg-center"></div>
          <div className="absolute bottom-0 left-0 w-full h-16 sm:h-24 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>

        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 md:-mt-30 relative z-10">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="lg:w-1/4 w-full">
              <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
                <div className="p-4 sm:p-6 text-center border-b border-slate-700">
                  <div className="relative inline-block">
                    <img
                      src={user.photoURL || "/default-avatar.png"}
                      className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-4 border-purple-600 object-cover shadow-lg mx-auto"
                      alt="User Avatar"
                    />
                    <div className="absolute bottom-1 right-1 bg-green-500 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-slate-800"></div>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold mt-3 sm:mt-4">{user.displayName}</h1>
                  <p className="text-slate-400 text-xs sm:text-sm">{user.email}</p>
                </div>
                <div className="grid grid-cols-2 divide-x divide-slate-700 border-b border-slate-700">
                  <div className="p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-purple-400">{watchedMoviesCount}</div>
                    <div className="text-xs text-slate-400">Phim đã xem</div>
                  </div>
                  <div className="p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-purple-400">
                      <div className="flex items-center justify-center col-span-4">{likedMovies.length}</div>
                    </div>
                    <div className="text-xs text-slate-400">Phim yêu thích</div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm text-[16px] font-bold mb-3 flex items-center justify-between">
                    Thể loại yêu thích
                    <button onClick={openEditGenres} className="text-xs text-purple-400 hover:underline">
                      Chỉnh sửa
                    </button>
                  </h3>
                  <div className="flex flex-wrap gap-2 max-h-40 sm:max-h-65 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
                    {favoriteGenres.map((slug) => {
                      const genre = genreList.find((g) => g.value === slug)
                      return (
                        <span
                          key={slug}
                          className="px-2 py-1 sm:px-3 sm:py-1 bg-slate-700 rounded-full text-xs font-medium text-slate-300"
                        >
                          {genre ? genre.label : slug}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-3/4 w-full">
              <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 mb-3 overflow-x-auto">
                <div className="flex border-b border-slate-700 min-w-max justify-center gap-4 md:justify-start">
                  {[
                    { key: "watched", label: "Yêu thích", icon: <Film className="w-4 h-4" /> },
                    { key: "watchlist", label: "Đề xuất", icon: <Clock className="w-4 h-4" /> },
                    { key: "favorites", label: "Đã xem", icon: <Star className="w-4 h-4" /> },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-1 px-4 sm:px-5 md:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.key
                        ? "text-purple-400 border-b-2 border-purple-500"
                        : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                      {tab.icon}
                      <span className="ml-1">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[200px]">
                <motion.div
                  animate={{
                    opacity: activeTab === "watched" ? 1 : 0,
                    position: activeTab === "watched" ? "relative" : "absolute",
                    zIndex: activeTab === "watched" ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`${activeTab === "watched" ? "block" : "hidden"} w-full`}
                >
                  <LikedMoviesSection likedMovies={likedMovies} uid={user.uid} />
                </motion.div>

                <motion.div
                  animate={{
                    opacity: activeTab === "favorites" ? 1 : 0,
                    position: activeTab === "favorites" ? "relative" : "absolute",
                    zIndex: activeTab === "favorites" ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`${activeTab === "favorites" ? "block" : "hidden"} rounded-xl w-full`}
                >
                  <WatchedProgress uid={user.uid} />
                </motion.div>

                <motion.div
                  animate={{
                    opacity: activeTab === "watchlist" ? 1 : 0,
                    position: activeTab === "watchlist" ? "relative" : "absolute",
                    zIndex: activeTab === "watchlist" ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`${activeTab === "watchlist" ? "block" : "hidden"
                    } p-4 sm:p-6 bg-slate-950 rounded-xl w-full`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Phim đề xuất</h2>
                    {shuffledRecommended.length > 0 &&
                    <button
                      onClick={shuffleMovies}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm font-medium transition-all"
                      disabled={shuffledRecommended.length == 0}
                    >
                      Đề xuất khác
                    </button>}
                  </div>
                  {shuffledRecommended.length > 0 ? (<
                    div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 ">
                    {shuffledRecommended.map((movie) => (
                      <RecommendedMovieCard key={movie._id} movie={movie} />
                    ))}
                  </div>) 
                  : 
                  (<div className="flex items-center justify-center h-full flex-col">
                    <img src="/cat.gif" alt="" className="w-50 "/>
                    <p>Hệ thống đang đề xuất phim cho bạn....</p>
                  </div>)
                  }
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfilePage
