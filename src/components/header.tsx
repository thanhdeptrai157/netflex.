"use client";
import React, { useEffect, useRef, useState } from "react";
import { useHeader } from "@/hooks/useHeader";
import DropdownMenu from "@/components/dropdown-menu";
import SeachBar from "./search-bar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser, faX } from "@fortawesome/free-solid-svg-icons";

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
        <a href="/" className="cursor-pointer">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-[40px] hidden lg:block"
          />
          <img
            src="/logo-small.png"
            alt="Logo"
            className="h-[40px] lg:hidden"
          />
        </a>
      </span>

      {/* Sidebar cho mobile */}
      <div
        ref={sidebarRef}
        className={`w-[250px] bg-slate-950 h-screen fixed top-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden
        ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-800">
          <img src="/logo.png" alt="Logo" className="h-[30px]" />
          <button onClick={() => setOpen(false)} className="cursor-pointer">
            <FontAwesomeIcon icon={faX} className="text-white" size="lg" />
          </button>
        </div>

        <nav className="flex flex-col gap-4 p-4 transition-colors duration-300">
          <a href="/" className="hover:text-red-600">
            Trang chủ
          </a>
          <a href="/phim-le" className="hover:text-red-600">
            Phim Lẻ
          </a>
          <a href="/phim-bo" className="hover:text-red-600">
            Phim Bộ
          </a>
          <a href="/tv-shows" className="hover:text-red-600">
            TV Shows
          </a>
        </nav>
      </div>

      {/* overlay */}
      <div
        className={`
          fixed inset-0 bg-black/50 z-40 lg:hidden
          transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        
      ></div>


      <nav className="items-center space-x-5 hidden lg:flex">
        <a href="/" className="hover:text-red-600 cursor-pointer">
          Trang chủ
        </a>
        <a href="/phim-le" className="hover:text-red-600 cursor-pointer">
          Phim Lẻ
        </a>
        <a href="/phim-bo" className="hover:text-red-600 cursor-pointer">
          Phim Bộ
        </a>
        <a href="/tv-shows" className="hover:text-red-600 cursor-pointer">
          TV Shows
        </a>

        {categories.length > 0 && (
          <DropdownMenu
            label="Thể loại"
            items={categories}
            hrefBase="/the-loai"
          />
        )}
        {countries.length > 0 && (
          <DropdownMenu
            label="Quốc gia"
            items={countries}
            hrefBase="/quoc-gia"
          />
        )}
      </nav>


      <div className="ml-auto flex items-center">
        <SeachBar />
        <div className="lg:hidden ml-2">
          <button onClick={() => setOpen(!open)}>
            <FontAwesomeIcon
              icon={faBars}
              className="text-white cursor-pointer"
              size="lg"
            />
          </button>
        </div>
        <div className="hidden lg:flex ml-2">
          <button>
            <FontAwesomeIcon
              icon={faUser}
              className="text-white cursor-pointer"
              size="lg"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
