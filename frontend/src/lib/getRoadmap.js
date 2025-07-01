// lib/getRoadmap.js
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config"; // assumes you already initialized Firestore as `db`

/**
 * Fetches a roadmap document by type and category.
 * 1. Looks for first document in roadmaps/{type}/{category}
 * 2. Fetches full document using its ID
 */
export async function getRoadmap(type, category) {
  try {
    // Step 1: Get the collection reference
    const colRef = collection(db, `roadmaps/${type}/${category}`);
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      throw new Error(`No roadmap found in /roadmaps/${type}/${category}`);
    }

    const docId = snapshot.docs[0].id;

    // Step 2: Fetch the full document by ID
    const docRef = doc(db, `roadmaps/${type}/${category}/${docId}`);
    const fullDoc = await getDoc(docRef);

    if (!fullDoc.exists()) {
      throw new Error("Document found by ID does not exist");
    }
    return { id: fullDoc.id, ...fullDoc.data() };
  } catch (error) {
    console.error("🔥 getRoadmap error:", error.message);
    throw error;
  }
}
