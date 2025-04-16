import MovieDetailComponent from '@/components/movie-detail';
import NewUpdateMovie from '@/components/new-update-movie';
import { fetchMovieDetail } from '@/lib/fetchDetailCategory';
import { Metadata } from 'next';

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

const MovieDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  return (
    <div className="flex flex-wrap gap-5 bg-slate-900 h-fit px-3 sm:px-4 lg:px-6 py-20 min-h-screen">
      <MovieDetailComponent slug={slug} />
      <NewUpdateMovie />
    </div>
  );
};

export default MovieDetailPage;
