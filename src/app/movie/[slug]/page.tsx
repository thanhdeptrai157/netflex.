import MovieDetail from '@/components/movie-detail';
import NewUpdateMovie from '@/components/new-update-movie';

interface Params {
    slug: string;
}

const MovieDetailPage = async ({ params }: { params: Params }) => {
    return (
        <div className="flex flex-wrap gap-5 bg-slate-900  h-fit px-3 sm:px-4 lg:px-6 py-20 ">
            <MovieDetail slug={params.slug} />
            <NewUpdateMovie />
        </div>
    );
};

export default MovieDetailPage;

