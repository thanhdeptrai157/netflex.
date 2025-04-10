"use client";
import Header from "@/components/header";
import MovieCard from "@/components/movie-card";
import { useMovie } from "@/hooks/useMovie";
import { Movie } from "@/types/movie";

export default function Home() {
  // const { movies, loading, error } = useMovie();

  // if (loading) {
  //   return (
  //     <div className="p-5 flex flex-wrap gap-5 bg-slate-900 justify-center h-screen">
  //       {[...Array(12)].map((_, index) => (
  //         <div
  //           key={index}
  //           className="animate-pulse bg-gray-500 h-80 w-[40%] sm:w-[30%] md:w-[22%] lg:w-[18%] xl:w-[15%] rounded-xl"
  //         />
  //       ))}
  //     </div>
  //   );
  // }

  // if (error) {
  //   return <p className="text-red-500 text-center mt-10">{error}</p>;
  // }

  return (
    <div className="flex flex-wrap gap-5 bg-slate-800 justify-center h-screen">
      <Header />
    </div>
  );
}
