import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";

export const listenToPosts = (callback) => {
  const ref = collection(db, "/community/reddit/posts");

  const unsubscribe = onSnapshot(ref, (snapshot) => {
    const posts = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);

    callback(posts);
  });

  return unsubscribe;
};

export const addCommentToPost = async (postId, comment, user) => {
  const commentRef = collection(db, `/community/reddit/posts/${postId}/comments`);

  const newComment = {
    uid: user?.uid || "anonymous",
    name: user?.name || "Anonymous",
    profile: user?.photoURL || "",
    content: comment.trim(),
    timestamp: serverTimestamp(),
  };
  
  await addDoc(commentRef, newComment);
};

export const handlePostReaction = async (postId, user, type) => {
  if (!user) return { success: false, message: "Login required" };

  const ref = doc(db, "/community/reddit/posts", postId);
  const snap = await getDoc(ref);
  const post = snap.data();

  const alreadyLiked = post.likedBy?.includes(user.uid);
  const alreadyDisliked = post.dislikedBy?.includes(user.uid);

  const updates = {};

  if (type === "like") {
    if (alreadyLiked) {
      updates.likes = increment(-1);
      updates.likedBy = arrayRemove(user.uid);
    } else {
      updates.likes = increment(1);
      updates.likedBy = arrayUnion(user.uid);
      if (alreadyDisliked) {
        updates.dislikes = increment(-1);
        updates.dislikedBy = arrayRemove(user.uid);
      }
    }
  }

  if (type === "dislike") {
    if (alreadyDisliked) {
      updates.dislikes = increment(-1);
      updates.dislikedBy = arrayRemove(user.uid);
    } else {
      updates.dislikes = increment(1);
      updates.dislikedBy = arrayUnion(user.uid);
      if (alreadyLiked) {
        updates.likes = increment(-1);
        updates.likedBy = arrayRemove(user.uid);
      }
    }
  }

  await updateDoc(ref, updates);
  return { success: true };
};

export const createUserPost = async ({ title, link, category, source }, user) => {
  const post = {
    uid: user.uid,
    name: user.name,
    photoURL: user.photoURL || "",
    title: title.trim(),
    link: link.trim(),
    category: category.trim(),
    source: source.trim(),
    timestamp: serverTimestamp(),
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
  };

  await addDoc(collection(db, "/community/reddit/posts"), post);
};

export const subscribeToComments = (postId, callback) => {
  const commentsRef = collection(db, `/community/reddit/posts/${postId}/comments`);

  return onSnapshot(commentsRef, (snapshot) => {
    const comments = snapshot.docs
      .map((doc) => doc.data())
      .sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);
    callback(comments);
  });
}