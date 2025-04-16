'use client'

import { useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useMemo, useState } from 'react'
import MovieDisplay from '@/components/movies-display'
import Pagination from '@/components/pagination'
import useSearch from '@/hooks/useSearch'


const Search = () => {
    const searchParams = useSearchParams()
    const query = searchParams.get('query') || ''
    const [currentPage, setCurrentPage] = useState(1)
    const { allSearchResults, loading, error, totalItems, totalPages } = useSearch(query, currentPage)

    useEffect(() => {
        setCurrentPage(1) // Reset về page 1 khi query thay đổi
    }, [query])

    return (
        <div className="min-h-screen bg-slate-900 px-3 sm:px-4 lg:px-6 py-20">
            {loading ? 
            (<div className='text-white text-xl md:text-2xl font-semibold mb-6'>Đang tìm kiếm {query}</div>) 
            : (<div className="text-white text-xl md:text-2xl font-semibold mb-6">
                Có {totalItems} kết quả tìm kiếm cho: <span className="text-green-400">"{query}"</span>
            </div>)}

            {loading && (
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-3 mt-5">
                    {Array.from({ length: 12 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="relative bg-gray-700 rounded-md animate-pulse aspect-[2/3] w-full"
                        />
                    ))}
                </div>
            )}

            {error && (
                <div className="text-red-500 text-center">Đã xảy ra lỗi khi tìm kiếm.</div>
            )}

            {!loading && !error && totalItems === 0 && (
                <div className="text-gray-400">Không tìm thấy kết quả nào.</div>
            )}

            {!loading && !error && totalItems > 0 && (
                <>
                    <MovieDisplay movies={allSearchResults} />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => {
                            setCurrentPage(page)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                    />
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
