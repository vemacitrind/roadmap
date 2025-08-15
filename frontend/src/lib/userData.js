import { collection, getDocs, doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export async function getAllUsers() {
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);

  const users = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return users;
}


// roadmap functions
export async function handleStart(user,type, roadmap, callback) {
  try {
    const userRef = doc(db, "users", user.uid);

    await setDoc(
      userRef,
      {
        roadmapsProgress: {
          [roadmap.id]: {
            startedAt: new Date().toISOString(),
            type:type,
            completedLessons: {
              0: {
                isComplete: true,
                completedAt: new Date().toISOString(),
              }
            }
          },
        },
      },
      { merge: true }
    );

    callback(true);
    console.log(`Started roadmap: ${roadmap.id}`);
  } catch (error) {
    console.error("Error starting roadmap:", error);
  }
}

export async function markLessonComplete(uid, roadmapId, lessonIndex, totalLessons) {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error("User not found");
      return;
    }

    const data = userSnap.data();
    const progressData = data.roadmapsProgress || {};

    // Ensure roadmap entry exists
    const roadmapData = progressData[roadmapId] || {
      startedAt: new Date().toISOString(),
      progress: 0,
      completedLessons: {}
    };

    // Make sure completedLessons exists
    if (!roadmapData.completedLessons) {
      roadmapData.completedLessons = {};
    }

    // Mark lesson complete
    roadmapData.completedLessons[lessonIndex] = {
      isComplete: true,
      completedAt: new Date().toISOString()
    };

    // Recalculate progress
    const completedCount = Object.values(roadmapData.completedLessons)
      .filter(lesson => lesson.isComplete).length;
    roadmapData.progress = Math.round((completedCount / totalLessons) * 100);

    // Update Firestore (merge with existing roadmapsProgress)
    await updateDoc(userRef, {
      [`roadmapsProgress.${roadmapId}`]: roadmapData
    });

  } catch (error) {
    console.error("Error marking lesson complete:", error);
  }
}

export async function isStarted(uid, roadmapId) {
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) return false;

    const data = snap.data();
    return !!data.roadmapsProgress?.[roadmapId];
  } catch (err) {
    console.error("Error checking roadmap start:", err);
    return false;
  }
}