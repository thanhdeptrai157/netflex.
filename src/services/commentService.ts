import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, addDoc, collection, query, where, getDocs, or, orderBy } from "firebase/firestore";
import { Comment } from "@/types/comments";

export const postComment = async (movieSlug: string, content: string, user: User) => {
    try {
        await addDoc(collection(db, "comments"), {
            movieSlug: movieSlug,
            content: content,
            uid: user.uid,
            avatar: user.photoURL,
            userName: user.displayName,
            createdAt: new Date().getTime(),
        });
        return { success: true };
    } catch (error: any) {
        console.error("Error posting comment:", error);
        return { success: false, error: error.message };
    }
}


export const getComments = async (movieSlug: string) => {
    try {
        const q = query(
            collection(db, "comments"),
            where("movieSlug", "==", movieSlug),
            orderBy("createdAt", "asc"),
        );
        const querySnapshot = await getDocs(q);
        const comments: Comment[] = [];
        querySnapshot.forEach((doc) => {
            comments.push({ ...doc.data()} as Comment);
        });
        return { success: true, comments };
    } catch (error) {
        console.error("Error fetching comments:", error);
        return { success: false, comments: [] };
    }
}
