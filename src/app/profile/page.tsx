"use client"

import { useUserStore } from "@/stores/userStore"
import { Calendar, Clock, Film, Star, User } from "lucide-react"
import { useState } from "react"


const ProfilePage = () => {
  const { user } = useUserStore()
  const [activeTab, setActiveTab] = useState("watched")

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="text-center p-8 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 max-w-md mx-auto">
          <User className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h1 className="text-3xl font-bold text-white mb-2">Chưa đăng nhập</h1>
          <p className="text-slate-300 mb-6">Vui lòng đăng nhập để xem thông tin cá nhân</p>
          <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all">
            Đăng nhập ngay
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-20">
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
                  <div className="text-2xl font-bold text-purple-400">8</div>
                  <div className="text-xs text-slate-400">Phim đã lưu</div>
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
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === "watched"
                      ? "text-purple-400 border-b-2 border-purple-500"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Film className="w-4 h-4" />
                  Phim đã xem
                </button>
                <button
                  onClick={() => setActiveTab("watchlist")}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === "watchlist"
                      ? "text-purple-400 border-b-2 border-purple-500"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Muốn xem
                </button>
                <button
                  onClick={() => setActiveTab("favorites")}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === "favorites"
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
              {/* {mockWatchedMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="group bg-slate-800 rounded-lg overflow-hidden shadow-lg border border-slate-700 hover:border-purple-500 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={movie.poster || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-3 w-full">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-medium">{movie.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span className="text-xs">{movie.year}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold line-clamp-1 group-hover:text-purple-400 transition-colors">
                      {movie.title}
                    </h3>
                  </div>
                </div>
              ))} */}
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
