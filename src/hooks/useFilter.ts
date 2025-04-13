"use client";
import { useEffect, useState } from "react";
import { Movie } from "@/types/movie";
import MovieService from "@/services/movieService";
import { APP_DOMAIN_CDN_IMAGE } from "@/configs/env";
import { getMoviesByFilter } from "@/services/filterService";

interface UseFilterProps {
  type_list: TypeList;
  page?: number;
  limit?: number;
  sort_field?: 'modified.time' | '_id' | 'year';
  sort_type?: 'asc' | 'desc';
  sort_lang?: LangList;
  category?: string;
  country?: string;
  year?: number;
}

export const useFilter = ({
  type_list,
  page = 1,
  limit = 18,
  sort_field = 'modified.time',
  sort_type = 'desc',
  sort_lang,
  category,
  country,
  year
}: UseFilterProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getMoviesByFilter({
          type_list,
          page,
          limit,
          sort_field,
          sort_type,
          sort_lang,
          category,
          country,
          year,
        }) as {
          status: string;
          data: any;
        };

        const data = response.data;

        if (response.status === "success") {
          const formattedMovies = data.items.map((item: Movie) => ({
            ...item,
            poster_url: item.poster_url?.startsWith(APP_DOMAIN_CDN_IMAGE ?? "")
              ? item.poster_url
              : (APP_DOMAIN_CDN_IMAGE ?? "") + item.poster_url,
          }));

          setMovies(formattedMovies);
          setTotalPages(data?.params?.pagination?.totalPages);
          setTotalItems(data?.params?.pagination?.totalItems);
        } else {
          setMovies([]);
          setError("Không tìm thấy kết quả.");
        }
      } catch (err) {
        console.error(err);
        setMovies([]);
        setError("Có lỗi xảy ra khi tải phim.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [type_list, page, limit, sort_field, sort_type, sort_lang, category, country, year]);

  return { loading, error, movies, totalPages, totalItems };
};
