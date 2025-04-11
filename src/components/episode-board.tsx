import { useState } from 'react';
import { Episode, EpisodeData } from '@/types/movie';
import { useMovieStore } from '@/stores/movieStore';
import { usePathname, useRouter } from 'next/navigation';

const EpisodeList = ({ episodes, name }: { episodes: Episode[]; name: string }) => {
    const router = useRouter();
    const pathname = usePathname(); 
    const [selectedServerIndex, setSelectedServerIndex] = useState(0);
    const { setEpisodes, setCurrentEpisode, currentEpisode } = useMovieStore();

    const handleSaveStore = (e: EpisodeData) => {
        setEpisodes(episodes);
        setCurrentEpisode(e);

        const watchPath = `/watch/${name}`;
        if (pathname !== watchPath) {
            router.push(watchPath);
        }
    };

    const selectedServer = episodes?.[selectedServerIndex];
    
    return (
        <div className="w-full">
            <h4 className="text-xl font-semibold mb-3 text-green-yellow">Danh sách tập phim</h4>

            <div className="flex flex-wrap gap-2 mb-4">
                {episodes?.map((server, index) => (
                    <button
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm transition font-medium cursor-pointer ${
                            index === selectedServerIndex
                                ? 'bg-green-600 text-white'
                                : 'bg-slate-600 text-gray-200 hover:bg-green-500'
                        }`}
                        onClick={() => setSelectedServerIndex(index)}
                    >
                        {server.server_name}
                    </button>
                ))}
            </div>

            <div className="bg-gray-800 p-4 rounded-xl max-h-[300px] lg:max-h-[570px] overflow-y-auto  scrollbar-thumb-green-500 scrollbar-track-gray-800 scrollbar-thin">
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 hide-scrollbar">
                    {selectedServer?.server_data?.map((ep, epIndex) => (
                        <div
                            key={epIndex}
                            className={`hover:bg-green-600 text-white text-center text-sm py-2 rounded-md cursor-pointer transition ${
                                currentEpisode?.name?.trim() === ep.name?.trim() ? 'bg-green-600' : 'bg-slate-700'
                            }`}
                            title={ep.name}
                            onClick={() => handleSaveStore(ep)}
                        >
                            {ep.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EpisodeList;
