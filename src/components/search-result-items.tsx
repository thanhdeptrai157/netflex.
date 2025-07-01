import { Movie } from "@/types/movie";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const SearchResultItems = ({ movie }: { movie: Movie }) => {
  const router = useRouter();
  const handleNavigate = (slug: string) => {
    router.push(`/movie/${slug}`);
  };
  return (
    <div
      className="flex items-center gap-3 p-2 hover:bg-gray-700 cursor-pointer"
      onClick={() => handleNavigate(movie.slug)}
    >
      <Image
        src={movie.poster_url}
        alt={movie.name}
        width={80}
        height={120}
        className="rounded-sm object-cover"
      />
      <div>
        <div className="font-bold text-green-yellow">{movie.name}</div>
        <div className="text-sm text-white">
          {movie.episode_current} • {movie.quality} • {movie.lang} •{" "}
          {movie.year}
        </div>
      </div>
    </div>
  );
};

export default SearchResultItems;
