import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/config";

export async function getAllRoadmaps() {
  const snapshot = await getDocs(collection(db, "roadmaps"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function deleteRoadmapById(id) {
  await deleteDoc(doc(db, "roadmaps", id));
}
