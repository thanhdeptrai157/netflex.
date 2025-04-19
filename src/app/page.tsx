"use client";

import { useEffect, useState } from "react";
import NewUpdateMovie from "@/components/new-update-movie";
import RecentMovie from "@/components/recent-movie";
import SeriesMovie from "@/components/series-movies";
import Slider from "@/components/slider";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 bg-slate-900 z-[9999] flex items-center justify-center flex-col gap-5"
          >
            <img
              src="/cat.gif"
              alt="Loading cat"
              className="w-40 h-40 object-contain"
            />
            <span className="text-white">Đang tải...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-5 bg-slate-900 h-fit px-3 sm:px-4 lg:px-6 py-20">
        <Slider />
        <NewUpdateMovie />
        <div className="w-full flex flex-col lg:flex-row justify-between gap-6">
          <div className="w-full lg:w-[68%]">
            <SeriesMovie />
          </div>
          <div className="w-full lg:w-[30%] mt-10 hidden md:block">
            <h2 className="text-[16px] md:text-xl font-bold text-white mb-5">Phim Xem Gần Đây</h2>
            <RecentMovie />
          </div>
        </div>
      </div>
    </div>
  );
}
