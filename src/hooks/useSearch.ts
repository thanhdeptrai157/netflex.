import { APP_DOMAIN_CDN_IMAGE } from '@/configs/env'
import SearchService from '@/services/searchService'
import { Movie } from '@/types/movie'
import { useEffect, useState } from 'react'

const useSearch = (keyword: string, debounce = 300) => {
    const [allSearchResults, setSearchResults] = useState<Movie[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const handler = setTimeout(() => {
            const trimmed = keyword.trim()

            if (trimmed === "") {
                setSearchResults([])
                setLoading(false)
                setError(null)
                return
            }

            const fetchSearchResults = async () => {
                setLoading(true)
                setError(null)
                try {
                    const response = await SearchService.searchMovies(trimmed, 100) as {
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
                        setSearchResults(movies)
                    } else {
                        setSearchResults([])
                        setError("Không tìm thấy kết quả.")
                    }
                } catch (err) {
                    setSearchResults([])
                    setError("Có lỗi xảy ra khi tải phim.")
                } finally {
                    setLoading(false)
                }
            }

            fetchSearchResults()
        }, debounce)

        return () => {
            clearTimeout(handler)
        }
    }, [keyword, debounce])
    const searchResults = allSearchResults.slice(0, 10)
    return {
        searchResults,
        loading,
        error,
        allSearchResults
    }
}

export default useSearch
