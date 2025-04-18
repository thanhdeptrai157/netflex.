"use client"

import MovieCard from "@/components/movie-card"
import { useLikedMovies } from "@/hooks/useLikedMovie"
import { useUserStore } from "@/stores/userStore"
import { Clock, Film, Star, User, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getFavoriteGenres, saveFavoriteGenres } from "@/services/userService"
import { AnimatePresence, motion } from "framer-motion"
import { useHeaderStore } from "@/stores/headerStore"

const ProfilePage = () => {
  const { user } = useUserStore()
  const { likedMovies } = useUserStore()
  const { data, error, loading } = useLikedMovies(likedMovies)
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([])
  const [tempGenres, setTempGenres] = useState<string[]>([])
  const [showGenrePopup, setShowGenrePopup] = useState(false)
  const [activeTab, setActiveTab] = useState("watched")
  const movies = data ? data : []
  const router = useRouter()

  const { categories } = useHeaderStore()
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
    setTempGenres((prev) =>
      prev.includes(slug) ? prev.filter((g) => g !== slug) : [...prev, slug]
    )
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 "
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-8 w-full max-w-xl relative"
            >
              <button
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"
                onClick={() => setShowGenrePopup(false)}
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-white">🎬 Thêm thể loại yêu thích</h2>
              <p className="text-slate-400 mb-6">
                Chọn những thể loại bạn yêu thích để chúng tôi gợi ý phim phù hợp nhất!
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {genreList.map((genre) => (
                  <button
                    key={genre.label}
                    onClick={() => toggleGenre(genre.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors flex items-center gap-1
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
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
                >
                  Lưu lựa chọn
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white pb-20">
        <div className="h-50 bg-gradient-to-r from-purple-900 to-indigo-900 relative">
          <div className="absolute inset-0 bg-[url('/bg-profile.jpg')] opacity-20 bg-cover bg-center"></div>
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>

        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 -mt-25 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
                <div className="p-6 text-center border-b border-slate-700">
                  <div className="relative inline-block">
                    <img
                      src={user.photoURL || "/default-avatar.png"}
                      className="w-28 h-28 rounded-full border-4 border-purple-600 object-cover shadow-lg mx-auto"
                      alt="User Avatar"
                    />
                    <div className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-slate-800"></div>
                  </div>
                  <h1 className="text-2xl font-bold mt-4">{user.displayName}</h1>
                  <p className="text-slate-400 sm:text-sm">{user.email}</p>
                </div>

                <div className="grid grid-cols-2 divide-x divide-slate-700 border-b border-slate-700">
                  <div className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">42</div>
                    <div className="text-xs text-slate-400">Phim đã xem</div>
                  </div>
                  <div className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {loading ? <div className="flex items-center justify-center col-span-4">
                    <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  </div> : movies.length}</div>
                    <div className="text-xs text-slate-400">Phim yêu thích</div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-sm text-[16px] font-bold mb-3 flex items-center justify-between">
                    Thể loại yêu thích
                    <button
                      onClick={openEditGenres}
                      className="text-xs text-purple-400 hover:underline"
                    >
                      Chỉnh sửa
                    </button>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {favoriteGenres.map((slug) => {
                      const genre = genreList.find((g) => g.value === slug)
                      return (
                        <span
                          key={slug}
                          className="px-3 py-1 bg-slate-700 rounded-full text-xs font-medium text-slate-300"
                        >
                          {genre ? genre.label : slug}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-2/3">
              <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 mb-6">
                <div className="flex border-b border-slate-700">
                  <button
                    onClick={() => setActiveTab("watched")}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === "watched"
                      ? "text-purple-400 border-b-2 border-purple-500"
                      : "text-slate-400 hover:text-slate-200"
                      }`}
                  >
                    <Film className="w-4 h-4" />
                    Yêu thích
                  </button>
                  <button
                    onClick={() => setActiveTab("watchlist")}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === "watchlist"
                      ? "text-purple-400 border-b-2 border-purple-500"
                      : "text-slate-400 hover:text-slate-200"
                      }`}
                  >
                    <Clock className="w-4 h-4" />
                    Đề xuất
                  </button>
                  <button
                    onClick={() => setActiveTab("favorites")}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === "favorites"
                      ? "text-purple-400 border-b-2 border-purple-500"
                      : "text-slate-400 hover:text-slate-200"
                      }`}
                  >
                    <Star className="w-4 h-4" />
                    Đã xem
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 bg-slate-950 h-fit p-6 rounded-xl shadow-xl border border-slate-700">
                {loading ? (
                  <div className="flex items-center justify-center col-span-4">
                    <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center col-span-5">Đã xảy ra lỗi khi tải phim 😢</div>
                ) : movies.length > 0 ? (
                  movies.map((movie) => (
                    <MovieCard key={movie._id} movie={movie} />
                  ))
                ) : (
                  <div className="text-slate-white text-center col-span-5">Chưa có phim nào trong danh sách</div>
                )}
              </div>

              {/* <div className="mt-8 text-center">
                <button className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors">
                  Xem thêm
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfilePage
