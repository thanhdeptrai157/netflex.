import MovieDetail from '@/components/movie-detail';
import NewUpdateMovie from '@/components/new-update-movie';

// yêu cầu params phải tuân theo interface chuẩn PageProps, không viết inline { params: Params }
interface PageProps {
  params: {
    slug: string;
  };
}

const MovieDetailPage = async ({ params }: PageProps) => {
  return (
    <div className="flex flex-wrap gap-5 bg-slate-900 h-fit px-3 sm:px-4 lg:px-6 py-20">
      <MovieDetail slug={params.slug} />
      <NewUpdateMovie />
    </div>
  );
};

export default MovieDetailPage;
