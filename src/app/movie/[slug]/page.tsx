import MovieDetail from '@/components/movie-detail';
import NewUpdateMovie from '@/components/new-update-movie';

interface Props {
  params: {
    slug: string;
  };
}

const MovieDetailPage = async ({ params }: Props) => {
  const { slug } = await params;

  return (
    <div className="flex flex-wrap gap-5 bg-slate-900 h-fit px-3 sm:px-4 lg:px-6 py-20">
      <MovieDetail slug={slug} />
      <NewUpdateMovie />
    </div>
  );
};

export default MovieDetailPage;
