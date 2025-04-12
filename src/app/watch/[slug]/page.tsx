import NewUpdateMovie from '@/components/new-update-movie';
import LoadMovie from '@/components/watch-movie';
import React from 'react'

const WatchMovie = async ({ params }: { params: Promise<{ slug: string}> }) => {
    const { slug } = await params;
    return (
        <div className="flex flex-wrap gap-5 bg-slate-900 h-fit px-3 sm:px-4 lg:px-6 py-20 w-full">
          <LoadMovie slug={slug} />
          <NewUpdateMovie />
        </div>
      );
}

export default WatchMovie