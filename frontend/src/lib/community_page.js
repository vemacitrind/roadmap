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
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase/config";

export const fetchUserProfile = async (uid) => {
  if (!uid) return { name: "Anonymous", profileLink: "/placeholder.png" };

  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  return snap.exists()
    ? snap.data()
    : { name: "Unknown", profileLink: "/placeholder.png" };
};

export const listenToPosts = (callback) => {
  const ref = collection(db, "/community/reddit/posts");

  const unsubscribe = onSnapshot(ref, async (snapshot) => {
    const postsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const uniqueUids = [...new Set(postsData.map((p) => p.uid).filter(Boolean))];
    const userProfiles = {};

    await Promise.all(
      uniqueUids.map(async (uid) => {
        userProfiles[uid] = await fetchUserProfile(uid);
      })
    );

    const mergedPosts = postsData
      .map((post) => ({
        ...post,
        name: userProfiles[post.uid]?.name || "Unknown",
        profileLink: userProfiles[post.uid]?.profileLink || "/placeholder.png",
      }))
      .sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);

    callback(mergedPosts);
  });

  return unsubscribe;
};

export const addCommentToPost = async (postId, comment, user) => {
  const commentRef = collection(db, `/community/reddit/posts/${postId}/comments`);

  const newComment = {
    uid: user?.uid || "anonymous",
    content: comment.trim(),
    timestamp: serverTimestamp(),
  };

  await addDoc(commentRef, newComment);
};

export const subscribeToComments = (postId, callback) => {
  const commentsRef = collection(db, "community", "reddit", "posts", postId, "comments");

  return onSnapshot(commentsRef, async (snapshot) => {
    const commentsData = snapshot.docs.map((doc) => doc.data());
    const uniqueUids = [...new Set(commentsData.map((c) => c.uid).filter(Boolean))];
    const userProfiles = {};

    await Promise.all(
      uniqueUids.map(async (uid) => {
        userProfiles[uid] = await fetchUserProfile(uid);
      })
    );

    const mergedComments = commentsData
      .map((comment) => ({
        ...comment,
        name: userProfiles[comment.uid]?.name || "Unknown",
        profileLink: userProfiles[comment.uid]?.profileLink || "/placeholder.png",
      }))
      .sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));

    callback(mergedComments);
  });
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
    title: title.trim(),
    link: link ? link.trim() : null,
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
