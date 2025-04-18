import {db} from "@/lib/firebase";
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const getUserRef = (uid: string) => doc(db, "users", uid);

export const favoriteGenres = async (uid: string, genres: string[]) => {
    const userRef = getUserRef(uid);
    await updateDoc(userRef, {
        favoriteGenres: arrayUnion(...genres),
    });
}
// update bio 
export const updateBio = async (uid: string, bio: string) => {
    const userRef = getUserRef(uid);
    await updateDoc(userRef, {
        bio: bio,
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

