import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { serverTimestamp } from "firebase/firestore";

export async function saveUserIfNew(user) {
  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      name: user.displayName || "Anonymous",
      createdAt: serverTimestamp(),
      roadmap: null,
      dailyLogs: [],
    });
    console.log("User saved to Firestore");
  } else {
    console.log("User already exists in Firestore");
  }
}
