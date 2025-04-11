import MovieDetailComponent from '@/components/movie-detail';
import MovieDetail from '@/components/movie-detail';
import NewUpdateMovie from '@/components/new-update-movie';

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
