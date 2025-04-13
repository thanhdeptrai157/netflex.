"use client";
import React, { useEffect, useRef, useState } from "react";
import { useHeader } from "@/hooks/useHeader";
import DropdownMenu from "@/components/dropdown-menu";
import SeachBar from "./search-bar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser, faX } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import RecentMovie from "./recent-movie";

const Header = () => {
  const { categories, countries } = useHeader();
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  // Đóng sidebar khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-slate-950 fixed top-0 left-0 w-full h-[70px] flex items-center px-[4%] z-50 text-white md:h-[60px] ">
      <span className="mr-[5%]">
        <Link href="/" className="cursor-pointer">
          <img src="/logo.png" alt="Logo" className="h-[40px] hidden lg:block cursor-pointer" />
          <img src="/logo-small.png" alt="Logo" className="h-[40px] lg:hidden cursor-pointer" />
        </Link>
      </span>

      <div
        ref={sidebarRef}
        className={`w-[250px] bg-slate-950 h-screen fixed top-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden
        ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-800">
          <img src="/logo.png" alt="Logo" className="h-[30px] cursor-pointer" />
          <button onClick={() => setOpen(false)} className="cursor-pointer">
            <FontAwesomeIcon icon={faX} className="text-white" size="lg" />
          </button>
        </div>

        <nav className="flex flex-col gap-4 p-4 transition-colors duration-300">
          <Link href="/" className="hover:text-red-600 ">Trang chủ</Link>
          <Link href="/list/phim-le" className="hover:text-red-600">Phim Lẻ</Link>
          <Link href="/list/phim-bo" className="hover:text-red-600">Phim Bộ</Link>
          <Link href="/list/tv-shows" className="hover:text-red-600">TV Shows</Link>
          <h2 className="text-[16px] md:text-xl font-bold text-white">Phim Xem Gần Đây</h2>
          <div className="max-h-[370px] overflow-scroll overflow-y-auto scrollbar-thumb-green-500 scrollbar-track-gray-800 scrollbar-thin">
            <RecentMovie />
          </div>
        </nav>
      </div>


      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300
        ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      ></div>

      <nav className="items-center space-x-5 hidden lg:flex">
        <Link href="/" className="hover:text-red-600 cursor-pointer">Trang chủ</Link>
        <Link href="/list/phim-le" className="hover:text-red-600 cursor-pointer">Phim Lẻ</Link>
        <Link href="/list/phim-bo" className="hover:text-red-600 cursor-pointer">Phim Bộ</Link>
        <Link href="/list/tv-shows" className="hover:text-red-600 cursor-pointer">TV Shows</Link>

        {categories.length > 0 && (
          <DropdownMenu label="Thể loại" items={categories} hrefBase="/category" />
        )}
        {countries.length > 0 && (
          <DropdownMenu label="Quốc gia" items={countries} hrefBase="/country" />
        )}
      </nav>

      <div className="ml-auto flex items-center">
        <SeachBar />
        <div className="lg:hidden ml-2">
          <button onClick={() => setOpen(!open)}>
            <FontAwesomeIcon icon={faBars} className="text-white cursor-pointer" size="lg" />
          </button>
        </div>
        <div className="hidden lg:flex ml-2">
          <button>
            <FontAwesomeIcon icon={faUser} className="text-white cursor-pointer" size="lg" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
