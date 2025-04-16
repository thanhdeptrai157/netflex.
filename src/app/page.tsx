"use client";

import NewUpdateMovie from "@/components/new-update-movie";
import RecentMovie from "@/components/recent-movie";
import SeriesMovie from "@/components/series-movies";
import Slider from "@/components/slider";

export default function Home() {
  return (
    <div className="flex flex-wrap gap-5 bg-slate-900 h-fit px-3 sm:px-4 lg:px-6 py-20 ">
      <Slider />
      <NewUpdateMovie />
      <div className="w-full flex flex-col lg:flex-row justify-between gap-6">
        <div className="w-full lg:w-[68%]">
          <SeriesMovie />
        </div>
        <div className="w-full lg:w-[30%] mt-10 hidden md:block">
        <h2 className="text-[16px] md:text-xl font-bold text-white mb-5">Phim Xem Gần Đây</h2>
          <RecentMovie />
        </div>
      </div>
    </div>
  );
}
