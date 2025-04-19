import { signInWithPopup } from "firebase/auth";
import { auth, provider, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getFavoriteGenres } from "@/services/userService";
import { useMovieStore } from "@/stores/movieStore";
import { Movie } from "@/types/movie";
import { getMoviesByFilter } from "@/services/filterService";

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // lưu vào Firestore nếu chưa có
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date().toISOString(),
      favoriteGenres: [],
    });
  }

  return user;
};

export const signOutFirebase = async () => {
    await auth.signOut();
}

// export const getRecommendedMovies = async (uid: string): Promise<Movie[]> => {
//   try {
//     // Lấy danh sách thể loại yêu thích
//     const favoriteGenres = await getFavoriteGenres(uid);

//     // Lấy danh sách phim đã xem gần đây
//     const { watchedMovie } = useMovieStore.getState();

//     // Tìm kiếm các phần khác của phim đã xem gần đây
//     const relatedMoviesPromises = watchedMovie.map(async (movie) => {
//       const response = await getMoviesByFilter({
//         type_list: "phim-le",
//         page: 1,
//         limit: 5,
//         sort_field: "modified.time",
//         sort_type: "desc",
//         category: movie.category?.[0]?.slug, // Lấy thể loại đầu tiên của phim
//       });
//       return response.movies;
//     });

//     const relatedMovies = (await Promise.all(relatedMoviesPromises)).flat();

//     // Tìm phim dựa trên thể loại yêu thích
//     const genreMoviesPromises = favoriteGenres.map(async (genre) => {
//       const response = await getMoviesByFilter({
//         type_list: "phim-le",
//         page: 1,
//         limit: 10,
//         sort_field: "modified.time",
//         sort_type: "desc",
//         category: genre,
//       });
//       return response.movies;
//     });

//     const genreMovies = (await Promise.all(genreMoviesPromises)).flat();

//     // Kết hợp và loại bỏ trùng lặp
//     const allMovies = [...relatedMovies, ...genreMovies];
//     const uniqueMovies = Array.from(new Map(allMovies.map((movie) => [movie._id, movie])).values());

//     return uniqueMovies;
//   } catch (error) {
//     console.error("Error fetching recommended movies:", error);
//     return [];
//   }
// };