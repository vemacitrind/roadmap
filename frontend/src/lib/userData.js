import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";

export async function getAllUsers() {
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);

  const users = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return users;
}
