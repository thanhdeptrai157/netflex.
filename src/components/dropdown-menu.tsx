"use client";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Category } from "@/types/header";
import { useRouter, usePathname } from "next/navigation";

interface DropdownMenuProps {
  label: string;
  items: Category[];
  hrefBase: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ label, items, hrefBase }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (slug: string) => {
    const newPath = `${hrefBase}/${slug}`;
    if (pathname !== newPath) {
      router.push(newPath);
    }
    setOpen(false); // Đóng dropdown sau khi chọn
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="hover:text-red-600"
      >
        {label}
        <FontAwesomeIcon icon={open ? faCaretUp : faCaretDown} className="ml-1" size="sm" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 bg-slate-800 shadow-md rounded p-4 min-w-[400px] grid grid-cols-3 gap-4 z-50"
          >
            {items.map((item) => (
              <button
                key={item._id}
                onClick={() => handleClick(item.slug)}
                className="text-sm text-left hover:text-red-600 transition-colors cursor-pointer"
              >
                {item.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownMenu;
