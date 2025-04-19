// import { MovieDetail } from '@/types/movie'
// import React from 'react'

// const WatchedProgress = (movie: MovieDetail) => {
//     return (
//         <div
//             key={movie._id}
//             className="flex gap-4 bg-slate-800 cursor-pointer items-start p-2 rounded-lg border border-white/10 hover:bg-white/5 transition"
//             onClick={() => handleClick(movie.slug)}
//         >
//             <div className="w-[50px] h-[90px] md:w-[80px] md:h-[120px] relative flex-shrink-0">
//                 <img
//                     src={movie.poster_url}
//                     alt={movie.name}
//                     className="object-cover rounded w-full h-full"
//                 />
//             </div>
//             <div className="flex flex-col justify-between overflow-hidden max-w-[120px] md:max-w-[300px]">
//                 <div className="whitespace-nowrap inline-block text-green-yellow text-sm md:text-xl font-semibold">
//                     {movie.name}
//                 </div>
//                 <div className="whitespace-nowrap inline-block  text-white/80 text-xs md:text-[17px]">
//                     {movie.origin_name}
//                 </div>
//                 <p className="text-white/50 text-sm">{movie.year}</p>
//             </div>
//         </div>
//     )
// }

// export default WatchedProgress