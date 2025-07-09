import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export async function fetchUserProfile(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : {};
}

export async function updateUserProfile(uid, data) {
  const ref = doc(db, "users", uid);
  await setDoc(ref, data, { merge: true });
}
