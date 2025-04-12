import useSearch from '@/hooks/useSearch';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { use, useEffect, useRef, useState } from 'react';
import Image from 'next/image'; // nếu dùng Next.js
import { Movie } from '@/types/movie';
import SearchResultItems from './search-result-items';
import { useRouter } from 'next/navigation';
import { useSearchStore } from '@/stores/searchStore';

const SearchBar = () => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState('');
    const {allSearchResults,  searchResults, loading, error } = useSearch(query, 1,  500); // debounce 0.5s
    const [inputExpanded, setInputExpanded] = useState(false);


    // click xem tat ca
    const handleSeeAllClick = (query: string) => {
        setOpen(false);
        router.push(`/search?query=${query}`);

    };

    // nhan enter de tim kiem
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (open && event.key === 'Enter' && query.trim() !== '') {
            setOpen(false);
            router.push(`/search?query=${query}`);
            (event.target as HTMLInputElement).value = '';
            addSearch(query)
            console.log(allSearchResults)
        }
    };
    // cài đặt timeout cho việc mở input
    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (open) {
            timeout = setTimeout(() => setInputExpanded(true), 300); // match transition duration
        } else {
            setInputExpanded(false);
        }
        setQuery('');
        return () => clearTimeout(timeout);
    }, [open]);

    // click ra ngoài input
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
                setQuery('');
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // cài đặt sự kiện gõ cho input
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery(value);
        if (!open) setOpen(true);
    };

    // lưu store tìm kiếm gần nhất
    const { recentSearches, addSearch, clearSearches } = useSearchStore()

    return (
        <div ref={dropdownRef} className="relative">
            <div className={`flex items-center rounded-full px-2 py-1 transition-all duration-30 ease-in-out bg-gray-800 ${open ? 'border border-gray-600' : ''}`}>
                <FontAwesomeIcon icon={faSearch} className="text-white cursor-pointer" onClick={() => setOpen(!open)} size="lg" />
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className={`ml-2 outline-none transition-all duration-300 ease-in-out bg-transparent text-white ${open ? 'sm:w-30 md:w-70 lg:w-50 xl:w-100 opacity-100' : 'w-0 opacity-0'
                        }`}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
            </div>
            {open && inputExpanded && query.trim() == '' && (
                <div className="absolute z-50 mt-2 w-full bg-gray-900 rounded-md shadow-lg max-h-100 overflow-y-auto
                    scrollbar-thumb-green-500 scrollbar-track-gray-800 scrollbar-thin">
                    {recentSearches.map((item: any, inx) => (
                        <div key={inx} className="p-3 border-t border-gray-700 hover:bg-gray-800 cursor-pointer font-semibold" onClick={() => handleSeeAllClick(item)}>
                            {item}
                        </div>
                    ))}
                    {recentSearches.length > 0 && (
                        <div
                            className="p-1 border-t border-gray-700 text-red-400 hover:bg-gray-800 text-center cursor-pointer font-semibold text-[14px]"
                            onClick={clearSearches}
                        >
                            Xoá kết quả tìm kiếm
                        </div>
                    )}
                </div>
            )}
            {open && inputExpanded && query.trim() !== '' && (
                <div className="absolute z-50 mt-2 w-full bg-gray-900 rounded-md shadow-lg max-h-100 overflow-y-auto
                scrollbar-thumb-green-500 scrollbar-track-gray-800 scrollbar-thin">
                    {loading && (
                        <div className="flex items-center justify-center p-4">
                            <FontAwesomeIcon icon={faSpinner} spin className="text-white text-xl animate-spin" />
                        </div>
                    )}
                    {error && <div className="p-4 text-red-500">Đã xảy ra lỗi.</div>}
                    {!loading && !error && searchResults?.length == 0 && (
                        <div className="p-4 text-gray-500">Không tìm thấy kết quả nào.</div>
                    )}
                    {!loading && !error && searchResults?.map((movie: Movie) => (
                        <div onClick={() => setOpen(false)} key={movie._id}>
                            <SearchResultItems key={movie._id} movie={movie} />
                        </div>

                    ))}
                    {!loading && !error && searchResults.length > 9 && (
                        <div className="text-center p-3 border-t border-gray-700 hover:bg-gray-800 cursor-pointer text-green-yellow font-semibold" onClick={() => handleSeeAllClick(query)}>
                            Xem tất cả
                        </div>
                    )}
                </div>

            )}
        </div>
    );
};

export default SearchBar;
