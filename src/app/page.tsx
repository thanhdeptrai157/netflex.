"use client";
import NewUpdateMovie from "@/components/new-update-movie";
import Slider from "@/components/slider";

export default function Home() {

  return (
    <div className="flex flex-wrap gap-5 bg-slate-900  h-fit px-3 sm:px-4 lg:px-6 py-20 ">
        <Slider />
        <NewUpdateMovie />
        {/* <div className="flex gap-6 ">
          <SeriesMovie />
          
        </div> */}
    </div>
  );
}
