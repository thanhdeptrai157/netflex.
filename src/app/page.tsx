"use client";
import Header from "@/components/header";
import MovieCard from "@/components/movie-card";
import Slider from "@/components/slider";
import { useMovie } from "@/hooks/useMovie";
import { Movie } from "@/types/movie";

export default function Home() {

  return (
    <div className="flex flex-wrap gap-5 bg-slate-900 justify-center h-fit lg:px-20 py-20 ">
      <Slider />
    </div>
  );
}
