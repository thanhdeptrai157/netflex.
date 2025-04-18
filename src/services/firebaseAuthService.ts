import { signInWithPopup } from "firebase/auth";
import { auth, provider, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

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
      bio: "",
      favoriteGenres: [],
    });
  }

  return user;
};

export const signOutFirebase = async () => {
    await auth.signOut();
}