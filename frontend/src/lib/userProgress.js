import { db } from "@/firebase/config"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export async function getUserRoadmapProgress(uid, roadmapId) {
  const docRef = doc(db, "users", uid);
  const snapshot = await getDoc(docRef);
  const data = snapshot.data();

  return data?.roadmap?.[roadmapId] || null;
}

export async function startRoadmapForUser(uid, roadmapId) {
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, {
    [`roadmap.${roadmapId}`]: {
      startedAt: new Date().toISOString(),
      completedLessons: [],
    },
  });
}

export async function toggleLesson(uid, roadmapId, lessonId) {
  const docRef = doc(db, "users", uid);
  const snapshot = await getDoc(docRef);
  const roadmap = snapshot.data()?.roadmap?.[roadmapId];

  if (!roadmap) return;

  const currentLessons = roadmap.completedLessons || [];
  const isCompleted = currentLessons.includes(lessonId);

  const updatedLessons = isCompleted
    ? currentLessons.filter((id) => id !== lessonId)
    : [...currentLessons, lessonId];

  await updateDoc(docRef, {
    [`roadmap.${roadmapId}.completedLessons`]: updatedLessons,
  });
}

export async function updateCompletionStatus(uid, progressPercent, title) {
  const userRef = doc(db, "users", uid);

  const updatePath = `roadmap.${title}.isComplete`;

  await updateDoc(userRef, {
    [updatePath]: progressPercent === 100
  });
}