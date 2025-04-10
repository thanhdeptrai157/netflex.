"use client"
import { useMovie } from '@/hooks/useMovie'
import React from 'react'

interface Props {
    slug: string
}

const MovieDetail = ({ slug }: Props) => {
    const { loading, error, data } = useMovie(slug)
    const movie = data?.movie
    const episodes = data?.episodes

    if (error) {
        return <div className="text-red-500 text-center mt-8">Đã có lỗi xảy ra khi tải dữ liệu phim.</div>
    }

    return (
        <div>
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-[30%]">
                    {loading ? (
                        <div className="w-full aspect-[2/3] bg-slate-700 rounded-xl animate-pulse" />
                    ) : (
                        <img
                            src={movie?.poster_url}
                            alt={movie?.name}
                            className="w-full h-auto rounded-xl shadow-lg"
                        />
                    )}
                </div>

                <div className="w-full lg:w-[70%] flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-3xl font-bold text-green-yellow">{movie?.name}</h2>
                        <h3 className="text-lg font-semibold text-gray-400">{movie?.origin_name}</h3>

                        {!loading && (<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm text-gray-200">
                            <div className="space-y-1">
                                <p><span className="font-medium">Năm:</span> {movie?.year}</p>
                                <p><span className="font-medium">Thể loại:</span> {movie?.category?.map((item) => item.name).join(', ')}</p>
                                <p><span className="font-medium">Số tập:</span> {movie?.episode_total}</p>
                                <p><span className="font-medium">Đạo diễn:</span> {movie?.director}</p>
                                <p><span className="font-medium">Diễn viên:</span> {movie?.actor?.join(', ')}</p>
                            </div>
                            <div className="space-y-1">
                                <p><span className="font-medium">Thời lượng:</span> {movie?.time}</p>
                                <p><span className="font-medium">Trạng thái:</span> {movie?.status}</p>
                                <p><span className="font-medium">Chất lượng:</span> {movie?.quality}</p>
                                <p><span className="font-medium">Ngôn ngữ:</span> {movie?.lang}</p>
                                <p><span className="font-medium">Tập hiện tại:</span> {movie?.episode_current}</p>
                            </div>
                        </div>)}
                    </div>

                    <div className="w-full">
                        <h4 className="text-xl font-semibold mb-3 text-green-yellow">Danh sách tập phim</h4>
                        <div className="bg-gray-800 p-4 rounded-xl max-h-[300px] overflow-y-auto">
                            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                                {episodes?.[0]?.server_data?.map((ep: any, index: number) => (
                                    <div
                                        key={index}
                                        className="bg-slate-700 hover:bg-green-600 text-white text-center text-sm py-2 rounded-md cursor-pointer transition"
                                        title={ep.name}
                                        onClick={() => window.open(ep.link_embed, '_blank')}
                                    >
                                        {ep.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='mt-4'>
                        <h3 className="text-lg font-semibold text-gray-400">Nội dung</h3>
                        <p className="text-sm text-gray-300">{movie?.content}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MovieDetail
