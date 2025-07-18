import MovieComments from '@/components/movie-comment';
import NewUpdateMovie from '@/components/new-update-movie';
import LoadMovie from '@/components/watch-movie';
import { fetchMovieDetail } from '@/lib/fetchDetailMovie';
import { Metadata } from 'next';
import React from 'react'
export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> => {
  try {
    const movie = await fetchMovieDetail((await params).slug);
    return {
      title: `${movie?.name} - Xem phim miễn phí | Netflex`,
      description: movie?.content || "Xem phim miễn phí trên Netflex.",
      keywords: movie?.category?.map((cat: any) => cat.name).join(", ") || "",
      openGraph: {
        title: movie?.name,
        description: movie?.content,
        images: [
          {
            url: movie?.poster_url ? movie?.poster_url : "",
            width: 800,
            height: 600,
            alt: movie?.name,
          },
        ],
      },
    };
  } catch (err) {
    return {
      title: "Phim không tồn tại | Netflex",
      description: "Không tìm thấy thông tin phim.",
    };
  }
};
const WatchMovie = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  return (
    <>
      <div className="flex flex-wrap gap-5 bg-slate-900 h-fit px-3 sm:px-4 lg:px-6 py-20 w-full">
        <LoadMovie slug={slug} />
        <div className="w-full lg:w-[71%]">
          <MovieComments slug={slug} />
        </div>
        <NewUpdateMovie /> 
      </div>
    </>
  );
}

export default WatchMovie