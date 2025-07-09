import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";

// Fetch all users
export async function getAllUsers() {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Fetch all roadmaps
export async function getAllRoadmaps() {
  const snapshot = await getDocs(collection(db, "roadmaps"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Dummy analytics logic (can be extended)
export async function getAnalyticsData() {
  const users = await getAllUsers();
  let totalCompleted = 0;

  users.forEach(user => {
    const roadmapObj = user.roadmap || {};
    Object.values(roadmapObj).forEach(entry => {
      if (entry.isComplete) totalCompleted++;
    });
  });

  return {
    totalUsers: users.length,
    totalCompleted,
    activeUsers: users.filter(u => u.dailyLogs?.length).length,
  };
}
