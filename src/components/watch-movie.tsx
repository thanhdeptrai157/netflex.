'use client'

import React, { useEffect, useRef } from 'react'
import EpisodeList from './episode-board'
import { useMovieStore } from '@/stores/movieStore'
import Hls from 'hls.js'

const LoadMovie = ({ slug }: { slug: string }) => {
    const { episodes, movieDetail, currentEpisode } = useMovieStore()
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const video = videoRef.current
        const link = currentEpisode?.link_m3u8
        if (!video || !link) return

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = link
            video.play()
        } else {
            const hls = new Hls()
            hls.loadSource(link)
            hls.attachMedia(video)
        }
    }, [currentEpisode])

    return (
        <div className="w-full flex flex-col gap-3 lg:flex-row">
            <div className="w-full lg:w-[75%] flex flex-col gap-3">
                <div className="shadow-lg border border-gray-700">
                    <video
                        ref={videoRef}
                        controls
                        className="w-full h-full aspect-video object-contain bg-black"
                    />
                </div>

                {movieDetail?.content && (
                    
                    <div className="bg-gray-800 p-4 rounded-xl shadow text-gray-300">
                        <h2 className='text-2xl font-semibold text-green-yellow'>{movieDetail.name}</h2>
                        <br></br>
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
