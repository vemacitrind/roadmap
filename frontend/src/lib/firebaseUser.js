import { doc, getDoc, setDoc, updateDoc, serverTimestamp, arrayUnion } from "firebase/firestore";
import { db } from "@/firebase/config";

export async function saveUserIfNew(user) {
  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      name: user.displayName || "Anonymous",
      createdAt: serverTimestamp(),
      profileLink: user.photoURL || "https://github.com/user-attachments/assets/c397a40b-d7a4-4e86-b7c5-8326c9a90610",
      roadmap: null,
      dailyLogs: [new Date().toISOString()],
    });
    console.log(" User saved to Firestore");
  } else {
    await updateDoc(userRef, {
      dailyLogs: arrayUnion(new Date().toISOString()),
    });
    console.log("Login recorded in dailyLogs");
  }
}
