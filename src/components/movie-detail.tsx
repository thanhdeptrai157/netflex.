"use client";
import { useMovie } from "@/hooks/useMovie";
import { Episode, EpisodeData, Movie, MovieDetail } from "@/types/movie";
import React, { useEffect, useState } from "react";
import { useMovieStore } from "@/stores/movieStore";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const MovieDetailComponent = ({ slug }: { slug: string }) => {
    const { loading, error, data } = useMovie(slug);
    const movie = data?.movie;
    const episodesServer = data?.episodes ?? [];
    const router = useRouter()
    const { setMovieDetail } = useMovieStore();
    const [showTrailer, setShowTrailer] = useState(false);

    const getYoutubeEmbedUrl = (url: string) => {
        const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
        return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : "";
    };

    // lấy 3 tập mới nhất
    const newEps = episodesServer[0]?.server_data?.slice(episodesServer[0]?.server_data?.length - 3, episodesServer[0]?.server_data?.length)
    useEffect(() => {
        if (data) {
            setMovieDetail(data.movie);
        }
    }, [data, setMovieDetail]);


    // lấy từ store ra để lưu
    const { setEpisodes, setCurrentEpisode, addWatchedMovie, movieDetail } = useMovieStore();

    // lưu store và chuyển trang 
    const handleSaveStore = (e: EpisodeData) => {
        setEpisodes(episodesServer);
        setCurrentEpisode(e);
        const watchPath = `/watch/${slug}`
        router.push(watchPath)
        addWatchedMovie(movieDetail as Movie)
    };

    const handleWatchNow = () =>{
        setEpisodes(episodesServer);
        setCurrentEpisode(episodesServer[0].server_data[0]);
        const watchPath = `/watch/${slug}`
        router.push(watchPath)
        addWatchedMovie(movieDetail as Movie)
    }
    if (error) {
        return (
            <div className="text-red-500 text-center mt-8">
                Đã có lỗi xảy ra khi tải dữ liệu phim.
            </div>
        );
    }

    return (
        <div className="w-full">
             {showTrailer && (
                <div className="fixed top-0 left-0 z-50 w-full h-full bg-black/40 backdrop-blur-sm flex justify-center items-center">
                    <div className="relative w-[85%] h-[250px] md:w-[800px] md:h-[450px] bg-black rounded-xl shadow-lg">
                        <iframe
                            width="100%"
                            height="100%"
                            src={getYoutubeEmbedUrl(movie?.trailer_url || "")}
                            title="Trailer"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            className="rounded-xl"
                        />
                        <button
                            className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-8 h-8 text-xl cursor-pointer"
                            onClick={() => setShowTrailer(false)}
                        >
                            <FontAwesomeIcon icon={faX} size="xs"/>
                        </button>
                    </div>
                </div>
            )}
            <div className="max-w-7xl flex flex-col lg:flex-row gap-10 w-full">

                <div className="w-full lg:w-[40%] xl:w-[30%] relative flex justify-center">
                    {!loading && <div className="absolute text-white font-bold bottom-2 ">
                        <button className="bg-gradient-blue-purple p-2 rounded-xl mr-2 hover:animate-wobble transition cursor-pointer" onClick={() =>setShowTrailer(true)}>Xem trailer</button>
                        <button className="bg-gradient-red-orange p-2 rounded-xl hover:animate-wobble transition cursor-pointer" onClick={()=>handleWatchNow()}>Xem ngay</button>
                    </div>
                     }
                    
                    {loading ? (
                        <div className="w-full aspect-[2/3] bg-slate-700 rounded-xl animate-pulse" />
                    ) : (
                        <img
                            src={movie?.poster_url}
                            alt={movie?.name}
                            className="w-full h-auto rounded-xl shadow-lg aspect-[2/3]"
                        />
                    )}
                </div>
                <div className="w-full lg:w-[70%] flex flex-col gap-2">
                    {loading ? (
                        <div className="flex flex-col gap-4">
                            <div className="h-8 w-1/2 bg-slate-700 animate-pulse rounded" />
                            <div className="h-5 w-1/3 bg-slate-700 animate-pulse rounded" />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
                                <div className="space-y-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-4 w-full bg-slate-700 animate-pulse rounded"
                                        />
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-4 w-full bg-slate-700 animate-pulse rounded"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4 space-y-2">
                                <div className="h-5 w-1/4 bg-slate-700 animate-pulse rounded" />
                                <div className="h-24 w-full bg-slate-700 animate-pulse rounded" />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-4">
                                <h2 className="text-3xl font-bold text-green-yellow">{movie?.name}</h2>
                                <h3 className="text-lg font-semibold text-gray-400">{movie?.origin_name}</h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm md:text-[16px] text-gray-200">
                                    <div className="space-y-1">
                                        <p><span className="font-medium">Năm:</span> {movie?.year == 0? "Đang cập nhật" : movie?.year}</p>
                                        <p><span className="font-medium">Thể loại: </span> 
                                        {movie?.category?.map((item, idx) => (
                                            <><Link className="hover:text-lime-500" key={idx} href={`/category/${item.slug}`}>{item.name}</Link>
                                             {idx < movie.category.length - 1 && ', '}</>
                                            ))}
                                        </p>
                                        <p><span className="font-medium">Số tập:</span> {movie?.episode_total == "0"? "Đang cập nhật" : movie?.episode_total }</p>
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
                                </div>
                            </div>
                            <div className="mt-1">
                                <h3 className="text-lg font-semibold text-green-yellow">Nội dung</h3>
                                <p className="text-sm md:text-[16px] text-gray-300 ">{movie?.content}</p>
                            </div>
                            <div className="mt-1">
                                <h3 className="text-green-yellow font-bold">Tập mới nhất</h3>
                                <div className="mt-3 rounded-xl w-[100%] md:w-[30%]">
                                    {newEps.length > 0  && newEps[0].name != '' ? (<div className="grid grid-cols-3 w-[100%] gap-3">
                                        {newEps.map((ep, epIndex) => (
                                            <div
                                                key={epIndex}
                                                className='hover:bg-green-600 text-white text-center text-sm py-2 rounded-md cursor-pointer transition bg-gray-800'

                                                title={ep.name}
                                                onClick={() => handleSaveStore(ep)}
                                            >
                                                {ep.name}
                                            </div>
                                        ))}
                                    </div>) : (
                                        <div className="text-white">Đang cập nhật</div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieDetailComponent;
