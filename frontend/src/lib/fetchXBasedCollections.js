import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export const fetchRoleBasedCollections = async () => {
  try {
    const metaRef = doc(db, "roadmaps", "role-based");
    const metaSnap = await getDoc(metaRef);

    if (metaSnap.exists()) {
      const data = metaSnap.data();
      return data.collections; // ["Backend", "Frontend", ...]
    } else {
      console.warn("No __meta__ document found");
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch roadmap categories:", error);
    return [];
  }
};

export const fetchSkillBasedCollections = async () => {
  try {
    const metaRef = doc(db, "roadmaps", "skill-based");
    const metaSnap = await getDoc(metaRef);

    if (metaSnap.exists()) {
      const data = metaSnap.data();
      return data.collections; // ["Java", "Python", ...]
    } else {
      console.warn("No __meta__ document found");
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch roadmap categories:", error);
    return [];
  }
};
