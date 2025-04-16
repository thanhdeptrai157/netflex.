"use client"
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useFilter } from '@/hooks/useFilter'
import MovieDisplay from '@/components/movies-display'
import Pagination from '@/components/pagination'
import { useHeaderStore } from '@/stores/headerStore'


const sortFields = ["modified.time", "year"] as const
const sortTypes = ["asc", "desc"] as const
const sortLangs = ["vietsub", "thuyet-minh"] as const
const limits = [12, 24, 48, 64]
const years = Array.from({ length: 2025 - 1970 + 1 }, (_, i) => (2025 - i).toString())



type SortField = typeof sortFields[number]
type SortType = typeof sortTypes[number]
type LangList = typeof sortLangs[number]


const typeListLabels: Record<TypeList, string> = {
  "phim-le": "Phim Lẻ",
  "phim-bo": "Phim Bộ",
  "tv-shows": "TV Shows",
  "hoat-hinh": "Hoạt Hình",
  "phim-vietsub": "Việt Sub",
  "phim-thuyet-minh": "Thuyết Minh",
  "phim-long-tieng": "Lồng Tiếng",
}

const sortFieldLabels: Record<SortField, string> = {
  "modified.time": "Ngày cập nhật",
  "year": "Năm",
}

const sortTypeLabels: Record<SortType, string> = {
  asc: "Tăng dần",
  desc: "Giảm dần",
}

const sortLangLabels: Record<LangList | "", string> = {
  vietsub: "Việt Sub",
  "thuyet-minh": "Thuyết Minh",
  "": "Tất cả",
}

const ListPage = () => {
  const { slug } = useParams() as { slug: string }
  const { categories, countries } = useHeaderStore()

  const [page, setPage] = useState(1)
  const [typeList, setTypeList] = useState<TypeList>(slug as TypeList)
  const [sortField, setSortField] = useState<SortField>("modified.time")
  const [sortType, setSortType] = useState<SortType>("desc")
  const [sortLang, setSortLang] = useState<LangList>("vietsub")
  const [category, setCategory] = useState<string>("")
  const [country, setCountry] = useState<string>("")
  const [year, setYear] = useState<number>()
  const [limit, setLimit] = useState<number>(24)

  const { loading, error, movies, totalItems, totalPages } = useFilter({
    type_list: typeList,
    page,
    sort_field: sortField,
    sort_type: sortType,
    sort_lang: sortLang,
    category,
    country,
    year,
    limit,
  })

  useEffect(() => {
    setPage(1)
  }, [typeList, sortField, sortType, sortLang, category, country, year, limit])

  return (
    <div className="min-h-screen bg-slate-900 px-3 sm:px-4 lg:px-6 py-20 text-white">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <select value={typeList} onChange={(e) => setTypeList(e.target.value as TypeList)} className="bg-slate-800 p-2 rounded overflow-y-auto  scrollbar-thumb-green-500 scrollbar-track-gray-800 scrollbar-thin">
          {Object.entries(typeListLabels).map(([key, label]) => (
            <option key={key} value={key} className='hover:bg-lime-400 bg-slate-700'>{label}</option>
          ))}
        </select>

        <select value={sortField} onChange={(e) => setSortField(e.target.value as SortField)} className="bg-slate-800 p-2 rounded overflow-y-auto  scrollbar-thumb-green-500 scrollbar-track-gray-800 scrollbar-thin">
          {sortFields.map(f => (
            <option key={f} value={f}>{sortFieldLabels[f]}</option>
          ))}
        </select>

        <select value={sortType} onChange={(e) => setSortType(e.target.value as SortType)} className="bg-slate-800 p-2 rounded overflow-y-auto  scrollbar-thumb-green-500 scrollbar-track-gray-800 scrollbar-thin">
          {sortTypes.map(t => (
            <option key={t} value={t}>{sortTypeLabels[t]}</option>
          ))}
        </select>

        <select value={sortLang} onChange={(e) => setSortLang(e.target.value as LangList)} className="bg-slate-800 p-2 rounded overflow-y-auto  scrollbar-thumb-green-500 scrollbar-track-gray-800 scrollbar-thin">
          {sortLangs.map(lang => (
            <option key={lang} value={lang}>{sortLangLabels[lang]}</option>
          ))}
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-slate-800 p-2 rounded overflow-y-auto  scrollbar-thumb-green-500 scrollbar-track-gray-800 scrollbar-thin">
          <option value="">Thể loại</option>
          {categories.map(c => (
            <option key={c._id} value={c.slug}>{c.name}</option>
          ))}
        </select>

        <select value={country} onChange={(e) => setCountry(e.target.value)} className="bg-slate-800 p-2 rounded overflow-y-auto  scrollbar-thumb-green-500 scrollbar-track-gray-800 scrollbar-thin">
          <option value="">Quốc gia</option>
          {countries.map(c => (
            <option key={c._id} value={c.slug}>{c.name}</option>
          ))}
        </select>

        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="bg-slate-800 p-2 rounded overflow-y-auto  scrollbar-thumb-green-500 scrollbar-track-gray-800 scrollbar-thin">
          <option value="">Năm</option>
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="bg-slate-800 p-2 rounded overflow-y-auto  scrollbar-thumb-green-500 scrollbar-track-gray-800 scrollbar-thin">
          {limits.map(l => (
            <option key={l} value={l}>Hiển thị {l}</option>
          ))}
        </select>
      </div>

      {error ? (
        <div className="text-red-500 text-center">Đã xảy ra lỗi khi tải phim 😢</div>
      ) : loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="bg-gray-700 rounded-lg aspect-[2/3] w-full animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="text-xl font-semibold mb-4">Tìm thấy {totalItems} phim</div>
          <MovieDisplay movies={movies} />
        </>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          setPage(newPage)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />
    </div>
  )
}

export default ListPage
