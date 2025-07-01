import React from "react";
import Image from "next/image";
const Loading = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
    <Image
      src="/cat.gif"
      alt="Loading cat"
      className="w-50 h-50 object-contain"
    />
    <span className="text-white">Đang tải...</span>
  </div>
);

export default Loading;
