import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";

export async function getAllRoadmaps() {
  const types = ["role-based", "skill-based"];
  const result = [];

  for (const type of types) {
    // Reference the roadmap type document
    const docRef = doc(db, "roadmaps", type);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(`No such roadmap type: ${type}`);
    }

    // Instead of 'collections', directly get documents subcollection
    const documentsColRef = collection(db, `roadmaps/${type}/documents`);
    const documentsSnapshot = await getDocs(documentsColRef);

    if (!documentsSnapshot.empty) {
      documentsSnapshot.docs.forEach((docItem) => {
        result.push({
          id: docItem.id,
          type,
          ...docItem.data(),
        });
      });
    }
  }

  return result;
}
