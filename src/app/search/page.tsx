"use client"
import MovieCard from '@/components/movie-card'
import { Movie } from '@/types/movie'
import { useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'
import useSearch from '@/hooks/useSearch'

const ITEMS_PER_PAGE = 18

const Search = () => {
    const searchParams = useSearchParams()
    const query = searchParams.get('query') || ''
    const { allSearchResults, loading, error } = useSearch(query)

    const [currentPage, setCurrentPage] = useState(1)

    const totalPages = Math.ceil(allSearchResults.length / ITEMS_PER_PAGE)
    const currentItems = allSearchResults.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    useEffect(() => {
        setCurrentPage(1) // reset page nếu query thay đổi
    }, [query])
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    return (
        <div className="min-h-screen bg-slate-900 px-3 sm:px-4 lg:px-6 py-20">
            <div className="text-white text-xl md:text-2xl font-semibold mb-6">
                Kết quả tìm kiếm cho: <span className="text-green-400">"{query}"</span>
            </div>

            {loading && (
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-3 mt-5">
                    {Array.from({ length: 10 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="relative bg-gray-700 rounded-md animate-pulse aspect-[2/3] w-full"
                        />
                    ))}
                </div>
            )}

            {error && <div className="text-red-500">Đã xảy ra lỗi khi tìm kiếm.</div>}

            {!loading && !error && currentItems.length === 0 && (
                <div className="text-gray-400">Không tìm thấy kết quả nào.</div>
            )}

            {!loading && !error && (
                <>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-3 mt-5">
                        {currentItems.map((movie: Movie) => (
                            <MovieCard key={movie._id} movie={movie} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-10 gap-2 text-white">
                            <button
                                className="px-3 py-1 border border-gray-600 rounded hover:bg-gray-700 disabled:opacity-50"
                                onClick={() => {
                                    scrollToTop()
                                    setCurrentPage((p) => {
                                        const newPage = Math.max(1, p - 1)
                                        return newPage
                                    })
                                }}
                                disabled={currentPage === 1}
                            >
                                Trước
                            </button>
                            <span className="px-4 py-1">{currentPage} / {totalPages}</span>
                            <button
                                className="px-3 py-1 border border-gray-600 rounded hover:bg-gray-700 disabled:opacity-50"
                                onClick={() => {
                                    scrollToTop()
                                    setCurrentPage((p) => {
                                        const newPage = Math.min(totalPages, p + 1)

                                        return newPage
                                    })
                                }}
                                disabled={currentPage === totalPages}
                            >
                                Sau
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
const SearchPage = () => {
    return (
        <Suspense>
            <Search />
        </Suspense>
    )
}
export default SearchPage
