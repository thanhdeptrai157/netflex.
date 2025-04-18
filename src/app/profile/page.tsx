"use client"

import MovieCard from "@/components/movie-card"
import { useLikedMovies } from "@/hooks/useLikedMovie"
import { useUserStore } from "@/stores/userStore"
import { Calendar, Clock, Film, Star, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"


const ProfilePage = () => {
  const { user } = useUserStore()
  const [activeTab, setActiveTab] = useState("watched")
  const { likedMovies } = useUserStore()
  const { data, error, loading } = useLikedMovies(likedMovies)
  const movies = data ? data : []
  const router = useRouter()
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="text-center p-8 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 max-w-md mx-auto">
          <User className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h1 className="text-3xl font-bold text-white mb-2">Chưa đăng nhập</h1>
          <p className="text-slate-300 mb-6">Vui lòng đăng nhập để xem thông tin cá nhân</p>
          <button className="px-6 py-3 cursor-pointer bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all"
            onClick={() => {
              router.push('/login')
            }}>
            Đăng nhập ngay
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900  to-slate-950 text-white pb-20">
      <div className="h-50 bg-gradient-to-r from-purple-900 to-indigo-900 relative">
        <div className="absolute inset-0 bg-[url('/bg-profile.jpg')] opacity-20 bg-cover bg-center"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-900 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
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
                <p className="text-slate-400">{user.email}</p>
              </div>

              <div className="grid grid-cols-2 divide-x divide-slate-700 border-b border-slate-700">
                <div className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">42</div>
                  <div className="text-xs text-slate-400">Phim đã xem</div>
                </div>
                <div className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">{movies.length}</div>
                  <div className="text-xs text-slate-400">Phim yêu thích</div>
                </div>
              </div>

              <div className="p-6 border-b border-slate-700">
                <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-2">Giới thiệu</h3>
                <p className="text-slate-300 text-sm">
                  Người yêu điện ảnh, đặc biệt là phim khoa học viễn tưởng và phim của Christopher Nolan.
                </p>
              </div>

              <div className="p-6">
                <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-3">Thể loại yêu thích</h3>
                <div className="flex flex-wrap gap-2">
                  {["Khoa học viễn tưởng", "Hành động", "Tâm lý", "Kinh dị", "Hoạt hình"].map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-slate-700 rounded-full text-xs font-medium text-slate-300"
                    >
                      {genre}
                    </span>
                  ))}
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
                  Phim đã xem
                </button>
                <button
                  onClick={() => setActiveTab("watchlist")}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === "watchlist"
                      ? "text-purple-400 border-b-2 border-purple-500"
                      : "text-slate-400 hover:text-slate-200"
                    }`}
                >
                  <Clock className="w-4 h-4" />
                  Muốn xem
                </button>
                <button
                  onClick={() => setActiveTab("favorites")}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === "favorites"
                      ? "text-purple-400 border-b-2 border-purple-500"
                      : "text-slate-400 hover:text-slate-200"
                    }`}
                >
                  <Star className="w-4 h-4" />
                  Yêu thích
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {loading ? (
                <div className="flex items-center justify-center col-span-4">
                  <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="text-red-500 text-center col-span-4">Đã xảy ra lỗi khi tải phim 😢</div>
              ) : movies.length > 0 ? (
                movies.map((movie) => (
                  <MovieCard key={movie._id} movie={movie} />
                ))
              ) : (
                <div className="text-slate-400 text-center col-span-4">Chưa có phim nào trong danh sách</div>
              )}
            </div>
            <div className="mt-8 text-center">
              <button className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors">
                Xem thêm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
