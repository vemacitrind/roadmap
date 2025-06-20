import { db } from "@/firebase/config";
import { collection, doc, setDoc } from "firebase/firestore";

// Import local JSON files
import frontend from "@/roadmap-seed/role-based/frontend.json";
import backend from "@/roadmap-seed/role-based/backend.json";
import react from "@/roadmap-seed/skill-based/react.json";
import sql from "@/roadmap-seed/skill-based/sql.json";

export async function uploadAllRoadmaps() {
  const roadmaps = {
    "role-based": { frontend, backend },
    "skill-based": { react, sql }
  };

  for (const [category, items] of Object.entries(roadmaps)) {
    for (const [name, data] of Object.entries(items)) {
      const docRef = doc(collection(db, "roadmaps", category, name));
      await setDoc(docRef, data);
      console.log(`✅ Uploaded: ${category}/${name}`);
    }
  }
}
