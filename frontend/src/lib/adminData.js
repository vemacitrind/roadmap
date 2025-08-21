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

  const now = new Date();
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const roadmapCompletionsLastMonth = {};
  const fetchRoadmapTitlePromises = [];

  users.forEach((user, userIndex) => {
    const progress = user.roadmapsProgress || {};
    Object.entries(progress).forEach(([roadmapId, roadmapData]) => {
      if (!roadmapData) {
        console.warn(`Missing roadmapData for roadmapId ${roadmapId} in user ${userIndex}`);
        return;
      }
      const startedAt = new Date(roadmapData.startedAt);
      console.log(`User ${userIndex}: roadmap ${roadmapId}, startedAt=${roadmapData.startedAt}, progress=${roadmapData.progress}, type=${roadmapData.type}`);

      if (
        startedAt >= startOfLastMonth &&
        true &&
        roadmapData.type
      ) {
        const roadmapRef = doc(db, `roadmaps/${roadmapData.type}/documents/${roadmapId}`);

        fetchRoadmapTitlePromises.push(
          getDoc(roadmapRef).then((docSnap) => {
            if (docSnap.exists()) {
              const title = docSnap.data().title || "Untitled";
              return title;
            } else {
              console.warn(`Roadmap doc not found: type=${roadmapData.type}, id=${roadmapId}`);
              return null;
            }
          })
        );
      } 
    });
  });
  console.log(fetchRoadmapTitlePromises)
  const titles = await Promise.all(fetchRoadmapTitlePromises);

  titles.forEach((title) => {
    if (title) {
      roadmapCompletionsLastMonth[title] = (roadmapCompletionsLastMonth[title] || 0) + 1;
    }
  });

  const popularRoadmapsLastMonth = Object.entries(roadmapCompletionsLastMonth).map(
    ([name, value]) => ({ name, value })
  );

  // User activity last 24h
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const userActivityHours = Array.from({ length: 24 }, (_, i) => {
    const d = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
    return { name: d.getHours().toString().padStart(2, "0") + ":00", value: 0 };
  });
  users.forEach((user) => {
    (user.dailyLogs || []).forEach((logString) => {
      const logDate = new Date(logString);
      if (logDate >= last24h && logDate <= now) {
        const hour = logDate.getHours();
        const hourBucket = userActivityHours.find((h) =>
          h.name.startsWith(hour.toString().padStart(2, "0"))
        );
        if (hourBucket) hourBucket.value++;
      }
    });
  });

  const daysInLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();

  const projectsByDate = {};
  for (let d = 1; d <= daysInLastMonth; d++) {
    const dayStr = d.toString().padStart(2, "0");
    projectsByDate[dayStr] = 0;
  }

  projects.forEach((project) => {
    const createdAt = project.createdAt.toDate();
    if (createdAt >= startOfLastMonth && true) {
      const day = createdAt.getDate().toString().padStart(2, "0");
      projectsByDate[day]++;
    }
  });

  const projectsThisMonth = Object.entries(projectsByDate).map(([name, value]) => ({
    name,
    value,
  }));


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
      const logDate = new Date(logString);
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
  const engagementPercent = users.length
    ? ((todaysActiveUsers / users.length) * 100).toFixed(1)
    : "0.0";

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
    popularRoadmapsLastMonth,
    userActivity24h: userActivityHours,
    projectsThisMonth,
  };
}
