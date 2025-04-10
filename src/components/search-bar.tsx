import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import React, { useEffect, useRef, useState } from 'react';

const SearchBar = () => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} className={`flex items-center relative rounded-full px-2 py-1 transition-all duration-30 ease-in-out ${open ? 'border border-gray-600' : ''}`}>
            <FontAwesomeIcon icon={faSearch} className='text-white cursor-pointer' onClick={() => setOpen(!open)} size='lg'/>
            <input
                type="text"
                placeholder='Tìm kiếm...'
                className={`ml-2 outline-none transition-all duration-300 ease-in-out bg-transparent ${
                    open ? 'sm:w-30 md:w-70 lg:w-50 xl:w-70 opacity-100' : 'w-0 opacity-0'
                }`}
            />
        </div>
    );
};

export default SearchBar;
