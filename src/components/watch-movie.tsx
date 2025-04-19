'use client'

import React, { useEffect, useRef, useState } from 'react'
import EpisodeList from './episode-board'
import { useMovieStore } from '@/stores/movieStore'
import Hls from 'hls.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackward, faForward, faForwardStep, faPause, faPlay, faVolumeMute } from '@fortawesome/free-solid-svg-icons'
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons/faVolumeUp'
import { useUserStore } from '@/stores/userStore'
import { addWatchedMovieProgress, getWatchedMovieProgress } from '@/services/userService'
import { motion, AnimatePresence } from "framer-motion"

const LoadMovie = ({ slug }: { slug: string }) => {
    const { episodes, movieDetail, currentEpisode, setCurrentEpisode } = useMovieStore()
    const { user } = useUserStore()
    const videoRef = useRef<HTMLVideoElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const [isPlaying, setIsPlaying] = useState(false)
    const [isReady, setIsReady] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [showControls, setShowControls] = useState(true)
    const [playbackRate, setPlaybackRate] = useState(1)
    const [hoverTime, setHoverTime] = useState(0)
    const [hoverX, setHoverX] = useState(0)
    const [showTooltip, setShowTooltip] = useState(false)
    const [controlsClickedOnce, setControlsClickedOnce] = useState(false)
    const [isHideCursor, setIsHideCursor] = useState(false)
    const [showResumeModal, setShowResumeModal] = useState(false)
    const [resumeTime, setResumeTime] = useState<number | null>(null)
    const [resumeEpisode, setResumeEpisode] = useState<string | null>(null)
    const [hasCheckedProgress, setHasCheckedProgress] = useState(false)
    const [pendingResumeEpisode, setPendingResumeEpisode] = useState<any>(null)

    const controlTimeout = useRef<NodeJS.Timeout | null>(null)
    const seekRef = useRef<HTMLInputElement>(null)

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

    useEffect(() => {
        let ignore = false;
        async function checkProgress() {
            if (user && movieDetail && episodes && episodes.length > 0) {
                try {
                    const progress = await getWatchedMovieProgress(user.uid, slug)
                    if (!ignore && progress && progress.episode) {
                        let foundEp = null
                        for (const server of episodes) {
                            foundEp = server.server_data.find(ep => ep.name?.trim() === progress.episode?.trim())
                            if (foundEp) break
                        }
                        if (foundEp) {
                            setResumeTime(progress.currentTime)
                            setResumeEpisode(progress.episode)
                            // Lưu lại episode để resume sau
                            setPendingResumeEpisode(foundEp)
                            setShowResumeModal(true)
                        }
                    }
                } catch (e) {
                    // ignore error
                } finally {
                    setHasCheckedProgress(true)
                }
            } else {
                setHasCheckedProgress(true)
            }
        }
        checkProgress()
        return () => { ignore = true }
    }, [user, movieDetail, episodes, slug])

    useEffect(() => {
        setIsPlaying(false)
        setIsReady(false)
        setCurrentTime(0)
        const video = videoRef.current
        const link = currentEpisode?.link_m3u8
        if (!video || !link) return

        let hls: Hls | null = null

        const onLoadedMetadata = () => {
            setDuration(video.duration)
            setCurrentTime(video.currentTime)
            setIsReady(true)
            video.play().then(() => {
                setIsPlaying(true)
            }).catch((err) => {
                console.warn("Autoplay failed:", err)
            })
        }

        // ép android dùng native
        if (/Android/i.test(navigator.userAgent)) {
            video.src = link
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = link
        } else {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: false,
                maxBufferLength: 60,
                maxMaxBufferLength: 120,
                liveSyncDurationCount: 3,
            })
            hls.loadSource(link)
            hls.attachMedia(video)
        }

        video.addEventListener('loadedmetadata', onLoadedMetadata)

        const interval = setInterval(() => {
            if (video.readyState >= 1 && !video.paused && !video.seeking) {
                setCurrentTime(video.currentTime)
            }
        }, 200)

        return () => {
            clearInterval(interval)
            if (hls) hls.destroy()
            video.removeEventListener('loadedmetadata', onLoadedMetadata)
        }
    }, [currentEpisode])

    useEffect(() => {
        if (!user || !movieDetail || !currentEpisode || !videoRef.current) return;
    
        const intervalId = setInterval(() => {
            const video = videoRef.current;
            if (video && !video.paused && !video.ended) {
                const currentTime = Math.floor(video.currentTime);
                addWatchedMovieProgress(
                    user.uid,
                    movieDetail.slug,
                    currentEpisode.name,
                    currentTime
                );
            }
        }, 30000); 
    
        return () => clearInterval(intervalId);
    }, [user, movieDetail, currentEpisode]);
    

    const togglePlay = () => {
        const video = videoRef.current
        if (!video || !isReady) return

        if (video.paused) {
            video.play()
            setIsPlaying(true)
        } else {
            video.pause()
            setIsPlaying(false)
        }
    }

    const toggleFullscreen = () => {
        const container = containerRef.current
        if (!container) return
        if (document.fullscreenElement) {
            document.exitFullscreen()
        } else {
            container.requestFullscreen()
        }
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const video = videoRef.current
            if (!video) return

            const active = document.activeElement

            const isInput = active?.tagName === 'INPUT'
            const isRange = isInput && (active as HTMLInputElement).type === 'range'
            const isTyping = (
                (!isRange && isInput) || // đang gõ ở input trừ range
                active?.tagName === 'TEXTAREA' ||
                (active as HTMLElement)?.isContentEditable
            )

            if (isTyping) return

            // nếu đang focus ở range thì không xử lý arrow keys
            if (isRange && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return

            switch (e.key) {
                case ' ':
                    e.preventDefault()
                    togglePlay()
                    break
                case 'ArrowRight':
                    video.currentTime += 10
                    break
                case 'ArrowLeft':
                    video.currentTime -= 10
                    break
                case 'f':
                    toggleFullscreen()
                    break
                case 'm':
                    video.muted = !video.muted
                    setVolume(video.muted ? 0 : 1)
                    break
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [togglePlay, toggleFullscreen])


    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current
        if (!video || !isReady) return
        const value = Number(e.target.value)
        video.currentTime = value
        setCurrentTime(value)
    }

    const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current
        if (!video) return
        const vol = Number(e.target.value)
        video.volume = vol
        setVolume(vol)
    }

    const handleMouseMove = () => {
        setShowControls(true)
        setControlsClickedOnce(false)
        setIsHideCursor(false)
        if (controlTimeout.current) clearTimeout(controlTimeout.current)
        controlTimeout.current = setTimeout(() => {
            setShowControls(false)
            setIsHideCursor(true)
        }, 2000)
    }


    // format thời gian thành giờ phút giây
    const formatTime = (time: number) => {
        const date = new Date(time * 1000);
        const hours = date.getUTCHours();
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        return hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
    }

    const handlePlaybackRate = () => {
        const video = videoRef.current
        if (!video) return
        const next = playbackRate >= 2 ? 0.5 : playbackRate + 0.5
        video.playbackRate = next
        setPlaybackRate(next)
    }

    const handleSeekHover = (e: React.MouseEvent<HTMLInputElement>) => {
        const input = seekRef.current
        const video = videoRef.current
        if (!input || !video) return

        const rect = input.getBoundingClientRect()
        const percent = (e.clientX - rect.left) / rect.width
        const time = percent * video.duration

        setHoverTime(time)
        setHoverX(e.clientX - rect.left)
        setShowTooltip(true)
    }

    const handleSeekLeave = () => {
        setShowTooltip(false)
    }

    // Resume handler
    const handleResume = () => {
        if (pendingResumeEpisode) {
            setCurrentEpisode(pendingResumeEpisode)
            setTimeout(() => {
                const video = videoRef.current
                if (video && resumeTime) {
                    video.currentTime = resumeTime
                    video.play()
                    setIsPlaying(true)
                }
            }, 200) // Đợi episode load xong mới seek
        }
        setShowResumeModal(false)
    }
    const handleStartOver = () => {
        setShowResumeModal(false)
        setPendingResumeEpisode(null)
    }

    return (
        <div className="w-full flex flex-col gap-3 lg:flex-row">
            <AnimatePresence>
                {showResumeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center text-white"
                        >
                            <h2 className="text-2xl font-bold mb-2">Tiếp tục xem?</h2>
                            <p className="mb-6 text-slate-300">Bạn đã xem đến <span className="text-green-400 font-semibold">{formatTime(resumeTime || 0)}</span> trong tập <span className="text-yellow-400 font-semibold">{resumeEpisode}</span>.<br/>Bạn có muốn tiếp tục từ vị trí này không?</p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={()=>{handleResume()}}
                                    className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-semibold shadow-md transition-all"
                                >
                                    Tiếp tục xem
                                </button>
                                <button
                                    onClick={handleStartOver}
                                    className="bg-slate-700 hover:bg-slate-800 px-5 py-2 rounded-lg font-semibold shadow-md transition-all"
                                >
                                    Xem từ đầu
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="w-full lg:w-[75%] flex flex-col gap-3">
                <div
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    className="relative shadow-lg border border-gray-700 bg-black aspect-video group"
                >
                    {!isReady && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 ">
                            <div className='animate-bounce text-center'><img
                                src="/cat.gif"
                                alt="Loading..."
                                className="w-25 h-25 object-contain md:w-40 md:h-40 lg:w-50 lg:h-50"
                            />
                                <span className='text-white text-center text-[12px] md:text-[16px]'>Đang tải phim...</span></div>
                        </div>
                    )}
                    <video
                        ref={videoRef}
                        tabIndex={0}
                        className={`w-full h-full object-contain ${isHideCursor ? 'cursor-none' : 'cursor-default'}`}
                        onClick={() => {
                            videoRef.current?.focus()

                            if (isMobile) {
                                if (!showControls) {
                                    setShowControls(true)
                                    setControlsClickedOnce(true)
                                } else if (controlsClickedOnce) {
                                    togglePlay()
                                    setControlsClickedOnce(false)
                                } else {
                                    setControlsClickedOnce(true)
                                }
                            } else {
                                togglePlay()
                            }
                        }}
                    />
                    
                    <div
                        className={`absolute bottom-0 left-0 right-0 transition-opacity duration-500 p-4 bg-gradient-to-t from-black/80 via-black/30 to-transparent ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}
                    >
                        <div className="relative">
                            <input
                                ref={seekRef}
                                type="range"
                                min="0"
                                max={duration || 0}
                                value={currentTime}
                                step="5"
                                onChange={handleSeek}
                                onMouseMove={handleSeekHover}
                                onMouseLeave={handleSeekLeave}
                                disabled={!isReady}
                                className="w-full accent-lime-400 cursor-pointer"
                            />
                            {showTooltip && (
                                <div
                                    className="absolute -top-8 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs pointer-events-none"
                                    style={{ left: `${hoverX}px` }}
                                >
                                    {formatTime(hoverTime)}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center mt-2 gap-2 text-sm text-white">
                            <button
                                onClick={togglePlay}
                                disabled={!isReady}
                                className={`px-3 py-1 rounded-md ${!isReady ? 'opacity-50 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20'
                                    } transition`}
                            >
                                {isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                            </button>

                            <button
                                onClick={() => {
                                    const video = videoRef.current
                                    if (!video || !isReady) return
                                    video.currentTime += 85
                                }}
                                className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 transition text-xs flex items-center cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faForwardStep} /> <span className="hidden md:block ml-1">Bỏ dạo đầu</span>
                            </button>

                            <button
                                onClick={() => {
                                    const video = videoRef.current
                                    if (!video || !isReady) return
                                    video.currentTime += 25
                                }}
                                className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 transition text-xs flex items-center cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faForward} /> <span className="hidden md:block ml-1">Bỏ quảng cáo</span>
                            </button>


                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        const video = videoRef.current
                                        if (!video) return
                                        video.muted = !video.muted
                                        setVolume(video.muted ? 0 : 1)
                                    }}
                                    className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 transition"
                                >
                                    {volume === 0 ? <FontAwesomeIcon icon={faVolumeMute} /> : <FontAwesomeIcon icon={faVolumeUp} />}
                                </button>

                                {!isMobile && (
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={volume}
                                        onChange={handleVolume}
                                        className="accent-lime-300 w-[60%] sm:w-full cursor-pointer"
                                    />
                                )}
                            </div>


                            <span className="flex-1 text-center whitespace-nowrap text-xs sm:text-sm">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>

                            {!isMobile && (
                                <button
                                    onClick={handlePlaybackRate}
                                    className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 transition"
                                >
                                    {playbackRate}x
                                </button>
                            )}

                            <button
                                onClick={toggleFullscreen}
                                className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 transition"
                            >
                                ⛶
                            </button>
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <h1 className="text-xl lg:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-yellow-300">
                        {movieDetail?.name}
                    </h1>
                    <h2 className="text-sm lg:text-xl font-medium text-gray-400 italic">{movieDetail?.origin_name}</h2>
                </div>
                <div className="mt-1">
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-yellow-300 mb-3">
                        Nội dung
                    </h3>
                    <div className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50">
                        <p className="text-gray-200 leading-relaxed">{movieDetail?.content || "Nội dung đang được cập nhật..."}</p>
                    </div>
                </div>

            </div>

            <div className="w-full lg:w-[30%]">
                <EpisodeList episodes={episodes} name={slug} />
            </div>
        </div>
    )
}

export default LoadMovie
