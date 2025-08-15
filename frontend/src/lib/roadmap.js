import { db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";

export async function fetchSkillBasedRoadmaps() {
  try {
    const ref = collection(db, "roadmaps", "skill-based", "documents");
    const snapshot = await getDocs(ref);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    console.error("Error fetching skill-based roadmaps:", err);
    return [];
  }
}

export async function fetchRoleBasedRoadmaps() {
  try {
    const ref = collection(db, "roadmaps", "role-based", "documents");
    const snapshot = await getDocs(ref);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    console.error("Error fetching skill-based roadmaps:", err);
    return [];
  }
}
