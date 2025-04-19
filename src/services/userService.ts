import {db} from "@/lib/firebase";
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const getUserRef = (uid: string) => doc(db, "users", uid);

// them loai phim yeu thich
// uid: id nguoi dung, genres: mang cac the loai phim
export const favoriteGenres = async (uid: string, genres: string[]) => {
    const userRef = getUserRef(uid);
    await updateDoc(userRef, {
        favoriteGenres: arrayUnion(...genres),
    });
}


export const addToWatchList = async (uid: string, movieId: string) => {
    const userRef = getUserRef(uid);
    await updateDoc(userRef, {
        watchList: arrayUnion(movieId),
    });
}

export const removeFromWatchList = async (uid: string, movieId: string) => {
    const userRef = getUserRef(uid);
    await updateDoc(userRef, {
        watchList: arrayRemove(movieId),
    });
}

// them phim yeu thich
// uid: id nguoi dung, movieId: id phim
export const addLikeMovie = async (uid: string, movieId: string) => {
    const userRef = getUserRef(uid);
    await updateDoc(userRef, {
        likedMovies: arrayUnion(movieId),
    });
}
// tra ve mang string
export const getLikedMovies = async (uid: string): Promise<string[]> => {
    const userRef = getUserRef(uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        console.log(userSnap.data().likedMovies)
        return userSnap.data().likedMovies || [];
    } else {
        console.log("No such document!");
        return [];
    }
    
}

export const removeLikeMovie = async (uid: string, movieId: string) => {
    const userRef = getUserRef(uid);
    await updateDoc(userRef, {
        likedMovies: arrayRemove(movieId),
    });
}

export const getUser = async (uid: string) => {
    const userRef = getUserRef(uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return userSnap.data();
    } else {
        return null;
    }
}

export const getFavoriteGenres = async (uid: string): Promise<string[]> => {
    const userRef = getUserRef(uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return userSnap.data().favoriteGenres || [];
    } else {
        return [];
    }
}

export const saveFavoriteGenres = async (uid: string, genres: string[]) => {
    const userRef = getUserRef(uid);
    await setDoc(userRef, {
        favoriteGenres: genres,
    }, { merge: true });
}

// lưu tiến trình xem phim (slug, episode, currentTime) vào Firestore
export const addWatchedMovieProgress = async (
  uid: string,
  slug: string,
  episode: string,
  currentTime: number
) => {
  const userRef = getUserRef(uid);
  // lưu dưới dạng object, mỗi phim là 1 object con
  await setDoc(
    userRef,
    {
      watchedProgress: {
        [slug]: {
          episode,
          currentTime,
          updatedAt: Date.now(),
        },
      },
    },
    { merge: true }
  );
};

// lấy tiến trình xem phim từ Firestore
export const getWatchedMovieProgress = async (
  uid: string,
  slug: string
): Promise<{ episode: string; currentTime: number } | null> => {
  const userRef = getUserRef(uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const watchedProgress = userSnap.data().watchedProgress || {};
    return watchedProgress[slug] || null;
  } else {
    return null;
  }
};

// lấy tất cả tiến trình xem phim từ Firestore
export const getAllWatchedMovieProgress = async (
    uid: string
    ): Promise<{ [slug: string]: { episode: string; currentTime: number } }> => {
    const userRef = getUserRef(uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return userSnap.data().watchedProgress || {};
    } else {
        return {};
    }
}