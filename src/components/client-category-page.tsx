'use client'

import React, { useState } from 'react'
import MovieDisplay from '@/components/movies-display'
import Pagination from '@/components/pagination'
import { useCategories } from '@/hooks/useCategories'

const CategoryPageClient = ({ type }: { type: string }) => {
    const [page, setPage] = useState(1)
    const { loading, movies, totalPages, error, totalItems } = useCategories(type, page)
    return (
        <div className="min-h-screen bg-slate-900 px-3 sm:px-4 lg:px-6 py-20">
            {error ? (
                <div className="text-red-500 text-center">Đã xảy ra lỗi khi tải phim 😢</div>
            ) : loading ? (
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6 lg:gap-3">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-gray-700 rounded-lg aspect-[2/3] w-full animate-pulse"
                        />
                    ))}
                </div>
            ) : (
                <div>
                    <div className="text-white text-xl md:text-2xl font-semibold mb-6">
                        Có {totalItems} kết quả
                    </div>
                    <MovieDisplay movies={movies} />
                </div>
            )}
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(page) => {
                    setPage(page)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
            />
        </div>
    )
}

export default CategoryPageClient
