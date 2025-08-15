import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";

export async function getAllUsers() {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getAllRoadmaps() {
  const snapshot = await getDocs(collection(db, "roadmaps"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getAllProjects() {
  const snapshot = await getDocs(collection(db, "projects"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getAllCommunityPosts() {
  const snapshot = await getDocs(collection(db, "community/reddit/posts"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getAnalyticsData() {
  const [users, roadmaps, projects, communityPosts] = await Promise.all([
    getAllUsers(),
    getAllRoadmaps(),
    getAllProjects(),
    getAllCommunityPosts(),
  ]);

  let totalCompleted = 0;
  users.forEach((user) => {
    const roadmapObj = user.roadmap || {};
    Object.values(roadmapObj).forEach((entry) => {
      if (entry?.isComplete) totalCompleted++;
    });
  });

  const today = new Date();
  let todaysLogs = 0;
  let todaysActiveUsers = 0;

  users.forEach((user) => {
    if (!Array.isArray(user.dailyLogs)) return;

    let userTodayCount = 0;

    user.dailyLogs.forEach((logString) => {
      const logDate = new Date(logString); // direct parse
      if (
        logDate.getUTCFullYear() === today.getUTCFullYear() &&
        logDate.getUTCMonth() === today.getUTCMonth() &&
        logDate.getUTCDate() === today.getUTCDate()
      ) {
        userTodayCount++;
      }
    });

    if (userTodayCount > 0) todaysActiveUsers++;
    todaysLogs += userTodayCount;
  });

  const engagementPercent = users.length ? ((todaysActiveUsers / users.length) * 100).toFixed(1): "0.0";

  return {
    totalUsers: users.length,
    totalRoadmaps: roadmaps.length,
    totalProjects: projects.length,
    totalCommunity: communityPosts.length,
    totalCompleted,
    activeUsers: users.filter((u) => u.dailyLogs?.length).length,
    dailyVisits: todaysLogs,            
    dailyActiveUsers: todaysActiveUsers,
    engagement: `${engagementPercent}`,
  };
}