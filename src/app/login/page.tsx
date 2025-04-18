"use client"

import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import { faFilm, faLock, faRightToBracket, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/stores/userStore"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAuth } from "@/hooks/useAuth"
import { motion, AnimatePresence } from "framer-motion"

const slogans = [
  "🎬 Bắt đầu hành trình điện ảnh của bạn",
  "👀 Phim chưa hết thì đừng thoát!",
  "🍿 Login cái đã, phim hay không chờ đâu",
  "🔄 Tiếp tục nơi bạn đã dừng lại",
  "📽️ Đồng bộ bộ sưu tập phim của bạn",
  "✨ Xem một lần, nhớ mãi – đừng bỏ lỡ!",
  "🌍 Tài khoản bạn – phim của bạn – mọi lúc mọi nơi",
]

const LoginPage = () => {
  const { setUser } = useUserStore()
  const router = useRouter()
  const { login, user, loading, error } = useAuth()

  const [sloganIndex, setSloganIndex] = useState(0)
  const [animatingDots, setAnimatingDots] = useState("")


  useEffect(() => {
    const interval = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % slogans.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])


  useEffect(() => {
    if (loading) {
      const dotsInterval = setInterval(() => {
        setAnimatingDots((prev) => {
          if (prev === "...") return ""
          return prev + "."
        })
      }, 300)
      return () => clearInterval(dotsInterval)
    }
  }, [loading])


  useEffect(() => {
    if (user) {
      setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      })
      toast.success("Đăng nhập thành công 🎉", { autoClose: 1000 })
      setTimeout(() => router.push("/"), 1000)
    }
  }, [user, setUser, router])


  useEffect(() => {
    if (error) {
      toast.error("Đăng nhập thất bại ❌")
    }
  }, [error])

  const handleGoogleLogin = () => {
    login()
  }


  const floatingElements = [
    { icon: "🎬", delay: 0, duration: 15 },
    { icon: "🍿", delay: 2, duration: 20 },
    { icon: "🎥", delay: 5, duration: 18 },
    { icon: "🎞️", delay: 8, duration: 22 },
    { icon: "📽️", delay: 3, duration: 17 },
    { icon: "🎭", delay: 7, duration: 19 },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">

      <div className="absolute inset-0 overflow-hidden">
        {floatingElements.map((el, index) => (
          <motion.div
            key={index}
            className="absolute text-3xl opacity-10"
            initial={{
              x: `${Math.random() * 100}%`,
              y: "110%",
            }}
            animate={{
              y: "-10%",
              x: `${Math.random() * 100}%`,
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: el.duration,
              delay: el.delay,
              ease: "linear",
            }}
          >
            {el.icon}
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-0 bg-radial-gradient"></div>

      <ToastContainer position="top-center" theme="dark" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 ring-1 ring-slate-600/30 relative z-10"
      >

        <div className="flex flex-col justify-center items-center p-10 md:p-14 text-center space-y-8 relative">

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg mb-2"
          >
            <FontAwesomeIcon icon={faFilm} className="text-white text-2xl" />
          </motion.div>

          <div className="h-16 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={sloganIndex}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5 }}
                className="text-xl md:text-2xl text-indigo-200 italic font-light"
              >
                {slogans[sloganIndex]}
              </motion.div>
            </AnimatePresence>
          </div>


          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300"
          >
            Đăng nhập
          </motion.h2>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoogleLogin}
            disabled={loading || !!user}
            className="w-full max-w-xs flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                <span className="relative z-10">Đang đăng nhập{animatingDots}</span>
              </>
            ) : user ? (
              <>
                <FontAwesomeIcon icon={faRightToBracket} />
                <span className="relative z-10">Đăng nhập thành công</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faGoogle} className="text-lg" />
                <span className="relative z-10">Đăng nhập với Google</span>
              </>
            )}


            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
          </motion.button>

 
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-slate-400 text-sm flex items-center justify-center gap-2 mt-4"
          >
            <FontAwesomeIcon icon={faLock} className="text-xs" />
            Đăng nhập an toàn với tài khoản Google
          </motion.p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm bg-red-500/10 py-2 px-4 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <div className="absolute top-10 left-10 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="hidden md:block relative overflow-hidden">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"
          ></motion.div>

          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src="/og.png"
            alt="Movie streaming"
            className="w-full h-full object-cover"
          />

          <div className="absolute bottom-0 left-0 right-0 p-10 z-20">
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-bold text-white mb-2"
            >
              Trải nghiệm điện ảnh không giới hạn
            </motion.h3>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-gray-300"
            >
              Hàng ngàn bộ phim đang chờ bạn khám phá
            </motion.p>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        .bg-radial-gradient {
          background: radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0) 70%);
        }
        
        @keyframes shine {
          100% {
            left: 125%;
          }
        }
        
        .animate-shine {
          animation: shine 1.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  )
}

export default LoginPage
