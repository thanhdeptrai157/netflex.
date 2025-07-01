import { APP_DOMAIN_CDN_IMAGE } from "@/configs/env";
import SearchService from "@/services/searchService";
import { Movie } from "@/types/movie";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const useSearch = (keyword: string, page: number, debounce = 300) => {
  const [allSearchResults, setSearchResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = keyword.trim();

      if (trimmed === "") {
        setSearchResults([]);
        setLoading(false);
        setError(null);
        return;
      }
      setLoading(true);
      const fetchSearchResults = async () => {
        setError(null);
        try {
          const response = (await SearchService.searchMovies(
            trimmed,
            page
          )) as {
            status: string;
            data: {
              items: Movie[];
              params: {
                pagination: {
                  totalPages: number;
                  totalItems: number;
                };
              };
            };
          };
          const data = response.data;

          if (response.status === "success") {
            const movies = data.items.map((item: Movie) => ({
              ...item,
              poster_url: item.poster_url?.startsWith(
                APP_DOMAIN_CDN_IMAGE ?? ""
              )
                ? item.poster_url
                : (APP_DOMAIN_CDN_IMAGE ?? "") + item.poster_url,
            }));
            setTotalPages(data?.params?.pagination?.totalPages);
            setTotalItems(data?.params?.pagination?.totalItems);
            setSearchResults(movies);
          } else {
            setSearchResults([]);
            setError("Không tìm thấy kết quả.");
          }
        } catch (err) {
          toast.error(
            "Có lỗi xảy ra khi tải phim." +
              (err instanceof Error ? `: ${err.message}` : "")
          );
          setSearchResults([]);
          setError("Có lỗi xảy ra khi tải phim.");
        } finally {
          setLoading(false);
        }
      };

      fetchSearchResults();
    }, debounce);

    return () => {
      clearTimeout(handler);
    };
  }, [keyword, page, debounce]);
  const searchResults = allSearchResults.slice(0, 10);
  return {
    searchResults,
    loading,
    error,
    allSearchResults,
    totalItems,
    totalPages,
  };
};

export default useSearch;
