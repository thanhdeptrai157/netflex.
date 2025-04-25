"use client"
import { useEffect, useRef, useState } from "react"
import { useHeader } from "@/hooks/useHeader"
import DropdownMenu from "@/components/dropdown-menu"
import SeachBar from "./search-bar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faUser, faX, faSignOutAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import RecentMovie from "./recent-movie"
import { useUserStore } from "@/stores/userStore"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

const Header = () => {
  const { categories, countries } = useHeader()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showFirstTimeModal, setShowFirstTimeModal] = useState(false)
  const { user } = useUserStore()
  const { logout } = useAuth()
  const router = useRouter()


  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem("hasVisitedBefore")
    if (!hasVisitedBefore && !user) {
      setShowFirstTimeModal(true)
      localStorage.setItem("hasVisitedBefore", "true")
    }
  }, [user])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false)
      }

      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <>
      <header className="bg-slate-950 fixed top-0 left-0 w-full h-[70px] flex items-center px-[4%] z-50 text-white md:h-[60px]">
      
        <span className="mr-[5%]">
          <Link href="/" className="cursor-pointer">
            <img src="/logo.png" alt="Logo" className="h-[40px] hidden lg:block cursor-pointer" />
            <img src="/logo-small.png" alt="Logo" className="h-[40px] lg:hidden cursor-pointer" />
          </Link>
        </span>

        <nav className="items-center space-x-5 hidden lg:flex">
          <Link href="/" className="hover:text-red-600 transition-colors">
            Trang chủ
          </Link>
          <Link href="/list/phim-le" className="hover:text-red-600 transition-colors">
            Phim Lẻ
          </Link>
          <Link href="/list/phim-bo" className="hover:text-red-600 transition-colors">
            Phim Bộ
          </Link>
          <Link href="/list/tv-shows" className="hover:text-red-600 transition-colors">
            TV Shows
          </Link>

          {categories.length > 0 && <DropdownMenu label="Thể loại" items={categories} hrefBase="/category" />}
          {countries.length > 0 && <DropdownMenu label="Quốc gia" items={countries} hrefBase="/country" />}
        </nav>

        <div className="ml-auto flex items-center">
          <SeachBar />

          <div className="lg:hidden ml-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:text-red-600 transition-colors"
            >
              <FontAwesomeIcon icon={faBars} className="cursor-pointer" size="lg" />
            </button>
          </div>

          <div className="hidden lg:flex ml-2 relative" ref={userMenuRef}>
            <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center focus:outline-none">
              {user ? (
                <img
                  src={user.photoURL || "/logo.png"}
                  alt="Avatar"
                  className="w-[40px] h-[40px] rounded-full cursor-pointer border-2 border-transparent hover:border-red-600 transition-colors"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-white cursor-pointer hover:text-red-600 transition-colors"
                  size="lg"
                />
              )}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-100 bg-slate-800 text-white rounded-md shadow-lg z-50 overflow-hidden">
                {user ? (
                  <div className="flex flex-col">
                    <div className="p-4 border-b border-slate-700">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.photoURL || "/logo.png"}
                          alt="Avatar"
                          className="w-[40px] h-[40px] rounded-full"
                        />
                        <div>
                          <p className="font-medium">{user.displayName || "User"}</p>
                          {user.email && <p className="text-sm text-slate-400 truncate">{user.email}</p>}
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-3 hover:bg-slate-700 transition-colors"
                    >
                      <FontAwesomeIcon icon={faUserCircle} className="mr-3 w-4" />
                      <span>Trang cá nhân</span>
                    </Link>

                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        logout()
                        toast.success("Đăng xuất thành công 🎉", { autoClose: 1000 })
                      }}
                      className="flex items-center px-4 py-3 text-red-500 hover:bg-slate-700 transition-colors w-full text-left cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 w-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-white">
                    <p className="mb-3 text-center">Đăng nhập để lưu lại bộ phim yêu thích</p>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        router.push("/login")
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
                    >
                      Đăng nhập
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <div
        ref={sidebarRef}
        className={`w-[280px] bg-slate-950 h-screen fixed top-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-800">
          <img src="/logo.png" alt="Logo" className="h-[30px] cursor-pointer" />
          <button onClick={() => setSidebarOpen(false)} className="text-white hover:text-red-600 transition-colors">
            <FontAwesomeIcon icon={faX} className="cursor-pointer" size="lg" />
          </button>
        </div>
        <div className="p-4 border-b border-slate-800 text-white">
          {user ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <img src={user.photoURL || "/logo.png"} alt="Avatar" className="w-[40px] h-[40px] rounded-full" />
                <div onClick={() => {
                  router.push('/profile')
                  setSidebarOpen(false)
                }
                }>
                  <p className="font-medium">{user.displayName || "User"}</p>
                  {user.email && <p className="text-sm text-slate-400 truncate">{user.email}</p>}
                </div>
              </div>
              <div className="flex gap-2 mt-1">
                <button
                  className="flex-1 py-1 px-3 bg-red-600 hover:bg-red-700 rounded text-white transition-colors"
                  onClick={() => {
                    logout()
                    setSidebarOpen(false)
                    toast.success("Đăng xuất thành công 🎉", { autoClose: 1000 })
                  }}
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 text-white">
              <div className="flex items-center gap-3">
                <div className="w-[40px] h-[40px] rounded-full bg-slate-800 flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} className="text-white" />
                </div>
                <p className="text-sm">Đăng nhập để lưu phim yêu thích</p>
              </div>
              <button
                className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded text-white transition-colors"
                onClick={() => {
                  setSidebarOpen(false)
                  router.push("/login")
                }}
              >
                Đăng nhập
              </button>
            </div>
          )}
        </div>

        <nav className="flex flex-col p-4 !text-white">
          <Link href="/" className="py-2 hover:text-red-600 transition-colors" onClick={() => setSidebarOpen(false)}>
            Trang chủ
          </Link>
          <Link
            href="/list/phim-le"
            className="py-2 hover:text-red-600 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            Phim Lẻ
          </Link>
          <Link
            href="/list/phim-bo"
            className="py-2 hover:text-red-600 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            Phim Bộ
          </Link>
          <Link
            href="/list/tv-shows"
            className="py-2 hover:text-red-600 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            TV Shows
          </Link>

          <hr className="my-3 border-slate-800" />
          <h3 className="font-medium mb-2">Phim Xem Gần Đây</h3>
          <div className="max-h-[370px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900 pr-2">
            <RecentMovie />
          </div>
        </nav>
      </div>

      {showFirstTimeModal && (
        <>
          <div className="fixed inset-0 bg-black/70 z-50" onClick={() => setShowFirstTimeModal(false)}></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-50 w-full max-w-md p-6 text-white">
            <h2 className="text-xl font-bold mb-2">Chào mừng đến với trang phim của chúng tôi!</h2>
            <p className="text-slate-400 mb-4">
              Đăng nhập để lưu lại bộ phim yêu thích và theo dõi lịch sử xem phim của bạn.
            </p>

            <div className="flex justify-center py-4">
              <img src="/logo.png" alt="Logo" className="h-16" />
            </div>

            <div className="space-y-3 text-center">
              <p>Với tài khoản, bạn có thể:</p>
              <ul className="text-left space-y-2 pl-5">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Lưu phim yêu thích để xem sau</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Theo dõi lịch sử xem phim</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Nhận thông báo về phim mới</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Bình luận và đánh giá phim</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              <button
                onClick={() => setShowFirstTimeModal(false)}
                className="flex-1 py-2 px-4 border border-slate-700 rounded text-white hover:bg-slate-800 transition-colors"
              >
                Để sau
              </button>
              <button
                onClick={() => {
                  setShowFirstTimeModal(false)
                  router.push("/login")
                }}
                className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 rounded text-white transition-colors"
              >
                Đăng nhập ngay
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Header
