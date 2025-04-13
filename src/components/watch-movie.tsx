'use client'

import React, { useEffect, useRef, useState } from 'react'
import EpisodeList from './episode-board'
import { useMovieStore } from '@/stores/movieStore'
import Hls from 'hls.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faForward, faForwardStep, faPause, faPlay, faVolumeMute } from '@fortawesome/free-solid-svg-icons'
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons/faVolumeUp'

const LoadMovie = ({ slug }: { slug: string }) => {
    const { episodes, movieDetail, currentEpisode } = useMovieStore()
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

    const controlTimeout = useRef<NodeJS.Timeout | null>(null)
    const seekRef = useRef<HTMLInputElement>(null)

    const isAndroid = /Android/i.test(navigator.userAgent)

    useEffect(() => {
        setIsPlaying(false)
        const video = videoRef.current
        const link = currentEpisode?.link_m3u8
        if (!video || !link) return
    
        let hls: Hls | null = null
    
        const onLoadedMetadata = () => {
            setDuration(video.duration)
            setCurrentTime(video.currentTime)
            setIsReady(true)
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
            const isTyping = active && (
                active.tagName === 'INPUT' ||
                active.tagName === 'TEXTAREA' ||
                (active as HTMLElement).isContentEditable
            )
        
            if (isTyping) return 
        
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
        if (controlTimeout.current) clearTimeout(controlTimeout.current)
        controlTimeout.current = setTimeout(() => setShowControls(false), 2000)
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60).toString().padStart(2, '0')
        const seconds = Math.floor(time % 60).toString().padStart(2, '0')
        return `${minutes}:${seconds}`
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

    return (
        <div className="w-full flex flex-col gap-3 lg:flex-row">
            <div className="w-full lg:w-[75%] flex flex-col gap-3">
                <div
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    className="relative shadow-lg border border-gray-700 bg-black aspect-video group"
                >
                    <video
                        ref={videoRef}
                        tabIndex={0}
                        className="w-full h-full object-contain"
                        onClick={() => {
                            videoRef.current?.focus()
                        
                            if (isAndroid) {
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
                        className={`absolute bottom-0 left-0 right-0 transition-opacity duration-500 p-4 bg-gradient-to-t from-black/80 via-black/30 to-transparent ${
                            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                    >
                        <div className="relative">
                            <input
                                ref={seekRef}
                                type="range"
                                min="0"
                                max={duration || 0}
                                value={currentTime}
                                step="0.1"
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
                                className={`px-3 py-1 rounded-md ${
                                    !isReady ? 'opacity-50 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20'
                                } transition`}
                            >
                                {isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                            </button>

                            <button
                                onClick={() => {
                                    const video = videoRef.current
                                    if (!video || !isReady) return
                                    video.currentTime += 90
                                }}
                                className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 transition text-xs flex items-center cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faForwardStep} /> <span className="hidden md:block ml-1">Bỏ dạo đầu</span>
                            </button>

                            <button
                                onClick={() => {
                                    const video = videoRef.current
                                    if (!video || !isReady) return
                                    video.currentTime += 30
                                }}
                                className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 transition text-xs flex items-center cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faForward} /> <span className="hidden md:block ml-1">Bỏ quảng cáo</span>
                            </button>

                            <div className="flex items-center gap-2">
                                {isAndroid ? (
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
                                ) : (
                                    <div className="flex items-center gap-2">
                                        {volume === 0 ? <FontAwesomeIcon icon={faVolumeMute} /> : <FontAwesomeIcon icon={faVolumeUp} />}
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={volume}
                                            onChange={handleVolume}
                                            className="accent-lime-300 w-[60%] sm:w-full cursor-pointer"
                                        />
                                    </div>
                                )}
                            </div>

                            <span className="flex-1 text-center whitespace-nowrap">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>

                            {!isAndroid && (
                                <button
                                    onClick={handlePlaybackRate}
                                    className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 transition"
                                >
                                    {playbackRate}x
                                </button>
                            )}

                            <button
                                onClick={toggleFullscreen}
                                className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 transition"
                            >
                                ⛶
                            </button>
                        </div>
                    </div>
                </div>

                {movieDetail?.content && (
                    <div className="bg-gray-800 p-4 rounded-xl shadow text-gray-300">
                        <h2 className="text-2xl font-semibold text-green-yellow">{movieDetail.name}</h2>
                        <br />
                        <h3 className="text-lg font-semibold text-white mb-2">Nội dung</h3>
                        <p className="text-sm leading-relaxed">{movieDetail.content}</p>
                    </div>
                )}
            </div>

            <div className="w-full lg:w-[30%]">
                <EpisodeList episodes={episodes} name={slug} />
            </div>
        </div>
    )
}

export default LoadMovie
