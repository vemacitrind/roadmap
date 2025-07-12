import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";

export async function getAllRoadmaps() {
  const types = ["role-based", "skill-based"];
  const result = [];

  for (const type of types) {
    const docRef = doc(db, "roadmaps", type);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(`No such roadmap type: ${type}`);
    }

    const collections = docSnap.data().collections || [];

    for (const category of collections) {
      const colRef = collection(db, `roadmaps/${type}/${category}`);
      const snapshot = await getDocs(colRef);

      if (!snapshot.empty) {
        const firstDoc = snapshot.docs[0];
        result.push({
          id: firstDoc.id,
          type,
          category,
          ...firstDoc.data(),
        });
      }
    }
  }

  return result;
}
