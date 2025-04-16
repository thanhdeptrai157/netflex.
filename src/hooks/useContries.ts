"use client";
import { useEffect, useState } from "react";
import MovieService from "@/services/movieService";
import { APP_DOMAIN_CDN_IMAGE } from "@/configs/env";
import { Movie } from "@/types/movie";
import CategoryService from "@/services/categoryService";
import CountryService from "@/services/countryService";



export const useCountries = (name: string, page: number) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [movies, setMovies] = useState<Movie[]>([])
    const [totalPages, setTotalPages] = useState(0)
    const [totalItems, setTotalItems] = useState(0)
    useEffect(() => {
        setLoading(true)
        setError('')
        const fetchMoviesByCountries = async (name: string) => {
            setLoading(true)
            setError(null)
            try {
                const response = await CountryService.getMoviesByCountry(name, page) as {
                    status: string
                    data: any
                }
                const data = response.data
                if (response.status === "success") {
                    const movies = data.items.map((item: Movie) => ({
                        ...item,
                        poster_url: item.poster_url?.startsWith(
                            APP_DOMAIN_CDN_IMAGE ?? ""
                        )
                            ? item.poster_url
                            : (APP_DOMAIN_CDN_IMAGE ?? "") + item.poster_url,
                    }))
                    setMovies(movies)
                    setTotalPages(data?.params?.pagination?.totalPages)
                    setTotalItems(data?.params?.pagination?.totalItems)
                } else {
                    setMovies([])
                    setError("Không tìm thấy kết quả.")
                }
            } catch (err) {
                setMovies([])
                setError("Có lỗi xảy ra khi tải phim.")
            } finally {
                setLoading(false)
            }

        }

        fetchMoviesByCountries(name);
    }, [name, page])
    return { loading, error, movies, totalPages, totalItems }

}; 
