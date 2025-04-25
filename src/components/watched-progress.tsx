"use client"

import { useWatchedMovies } from "@/hooks/useWatchedProgress"
import { getAllWatchedMovieProgress } from "@/services/userService"
import { Clock, Film, Play } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Pagination from "@/components/pagination"

const MAX_ITEM = 6;

const WatchedProgress = ({ uid }: { uid: string }) => {
    const [watchedProgress, setWatchedProgress] = useState<{
        [slug: string]: { episode: string; currentTime: number }
    }>({})
    const router = useRouter()
    const [page, setPage] = useState(1)
    useEffect(() => {
        const fetchWatchedProgress = async () => {
            const watchedProgressData = await getAllWatchedMovieProgress(uid)
            setWatchedProgress(watchedProgressData || {})
        }
        if (uid) fetchWatchedProgress()
    }, [uid])

    // doi thoi gian thanh giay
    const formatTimeProgress = (time: string): number => {
        const timePart = time.split(" ")[0]
        return parseInt(timePart) * 60
    }

    const { data, loading, error } = useWatchedMovies(uid, watchedProgress)
    if (loading)
        return (
            <div className="flex items-center justify-center col-span-4 bg-slate-950 h-fit p-6 rounded-xl shadow-xl border border-slate-700">
                <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )

    if (error) return <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">{error}</div>

    function handleClick(slug: string): void {
        router.push(`/movie/${slug}`)
    }

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = Math.floor(seconds % 60)
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
    }
    if (!data) {
        return (
            <div className="text-center p-8  rounded-lg border border-white/10 bg-slate-950  ">
                <Film className="w-12 h-12 mx-auto mb-3 text-green-400/50" />
                <div className="text-green-400 text-lg font-medium">Chưa có phim nào</div>
                <p className="text-white/50 text-sm mt-2">Bạn chưa xem phim nào gần đây</p>
            </div>
        )
    }
    // Phân trang
    const totalPages = Math.ceil(data.length / MAX_ITEM)
    const pagedData = data.slice((page - 1) * MAX_ITEM, page * MAX_ITEM)
    return (
        <>
        <div className="space-y-4 bg-slate-950 h-fit rounded-xl p-6 shadow-xl border border-slate-700">
            {data.length === 0 ? (
                <div className="text-center p-8 bg-slate-800/50 rounded-lg border border-white/10">
                    <Film className="w-12 h-12 mx-auto mb-3 text-green-400/50" />
                    <div className="text-green-400 text-lg font-medium">Chưa có phim nào</div>
                    <p className="text-white/50 text-sm mt-2">Bạn chưa xem phim nào gần đây</p>
                </div>
            ) : (
                <>
                <div className="grid gap-4 sm:grid-cols-1 xl:grid-cols-2 ">
                    {pagedData.map((movie: any) => {
                        const progress = watchedProgress[movie.movie.slug] || {}
                        return (
                            <div
                                key={movie.movie._id}
                                className="flex gap-4 bg-slate-800 cursor-pointer items-start p-3 rounded-lg border border-white/10 hover:bg-slate-700 transition-all duration-300 hover:shadow-lg hover:shadow-green-400/5 group"
                                onClick={() => handleClick(movie.movie.slug)}
                            >
                                <div className="w-[60px] h-[90px] md:w-[80px] md:h-[120px] relative flex-shrink-0 overflow-hidden rounded-md group-hover:scale-105 transition-transform duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                                    <img
                                        src={movie.movie.poster_url || "/placeholder.svg"}
                                        alt={movie.movie.name}
                                        className="object-cover w-full h-full"
                                    />
                                    <div className="absolute bottom-1 right-1 z-20 bg-green-400 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Play className="w-3 h-3 text-slate-900 fill-current" />
                                    </div>
                                </div>
                                <div className="flex flex-col justify-between overflow-hidden flex-1">
                                    <div>
                                        <h3 className="text-green-400 text-sm md:text-lg font-semibold ">{movie.movie.name}</h3>
                                        <div className="text-white/80 text-xs md:text-sm ">{movie.movie.origin_name}</div>
                                        <p className="text-white/50 text-xs">{movie.movie.year}</p>
                                    </div>

                                    {progress.episode && (
                                        <div className="mt-2 space-y-1">
                                            <div className="flex items-center text-xs text-white/70 gap-1">
                                                <Film className="w-3 h-3" />
                                                <span>{progress.episode}</span>
                                            </div>
                                            {progress.currentTime > 0 && (
                                                <div className="flex items-center text-xs text-white/70 gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>Đã xem: {formatTime(progress.currentTime)}</span>
                                                </div>
                                            )}
                                            {progress.currentTime > 0 && (
                                                <div className="w-full bg-slate-700 rounded-full h-1 mt-1">
                                                    <div
                                                        className="bg-green-400 h-1 rounded-full"
                                                        style={{ width: `${Math.min((progress.currentTime / (formatTimeProgress(movie.movie.time))) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
                
                </>
            )}
            
        </div>
        {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
        )}
        </>
    )
}

export default WatchedProgress
