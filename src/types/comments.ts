export interface Comment {
    movieSlug: string;
    content: string;
    uid: string;
    avatar: string;
    userName: string;
    createdAt: number;
}

// movieSlug: movieSlug,
// content: content,
// uid: user.uid,
// avatar: user.photoURL,
// userName: user.displayName,
// createdAt: new Date().getTime(),