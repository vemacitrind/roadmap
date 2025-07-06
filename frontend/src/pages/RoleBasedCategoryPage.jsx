import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRoadmap } from "@/lib/getRoadmap";
import BasicHeader from "@/components/BasicHeader";
import AboutSection from "@/components/AboutSection";
import PageNotFound from "./PageNotFound";
import { useAuth } from "@/auth/AuthContext";
import {
  getUserRoadmapProgress,
  startRoadmapForUser,
  toggleLesson,
  updateCompletionStatus
} from "@/lib/userProgress";
import {
  Card,
  CardHeader,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function RoadmapViewer() {
  const { category } = useParams();
  const type = "role-based";
  const { user } = useAuth();
  const uid = user?.uid;

  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState(null);
  const [showSignin, setShowSignin] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getRoadmap(type, category);
        setRoadmap(data);
      } catch (err) {
        setError(err.message);
      }
    }
    load();
  }, [category]);

  useEffect(() => {
    async function loadProgress() {
      if (!uid || !roadmap?.title) return;
      const progress = await getUserRoadmapProgress(uid, roadmap.title);
      if (progress) {
        setCompletedLessons(progress.completedLessons);
        setStarted(true);
      }
    }
    loadProgress();
  }, [uid, roadmap]);

  const handleStart = async () => {
    if (!user) return setShowSignin(true);
    await startRoadmapForUser(uid, roadmap.title);
    setStarted(true);
  };

  const handleToggleLesson = async (lessonId) => {
    if (!started || !uid || !roadmap?.title) return;
    await toggleLesson(uid, roadmap.title, lessonId);
    setCompletedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const totalLessons = roadmap?.Syllabus?.reduce(
    (acc, section) => acc + section.Lesson.length,
    0
  ) || 0;

  const completedCount = completedLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  useEffect(() => {
    if (!user || !started || !roadmap) return;
    updateCompletionStatus(user.uid,progressPercent,roadmap.title);
  }, [progressPercent, user, started, roadmap]);

  if (error) return <PageNotFound type="roadmap-error" />;
  if (!roadmap) return <p className="text-center text-zinc-500">Loading roadmap...</p>;

  return (
    <>
      <BasicHeader />
      <div className="mt-24 w-full px-0 relative">
        <div className="w-full mx-auto text-center h-32 content-center bg-[linear-gradient(to_right,_#09090b_60%,_#e4e4e7_100%)]">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-zinc-200 to-white bg-clip-text text-transparent drop-shadow-lg">
            {roadmap.title}
          </h1>
          <p className="mt-2 text-zinc-400 text-sm md:text-base">
            {roadmap.description}
          </p>
        </div>
      </div>

      <div className="min-h-screen w-full overflow-x-hidden grid justify-items-center bg-zinc-950 px-6 py-0 mx-0 text-white">
        <div className="w-full max-w-6xl pt-10">
          {!started ? (
            <Button variant="outline" className="mb-6" onClick={handleStart}>
              Start Roadmap
            </Button>
          ) : (
            <div className="mb-6 space-y-2">
              <Progress value={progressPercent} />
              <p className="text-sm text-zinc-400 text-right">
                {progressPercent}% completed
              </p>
            </div>
          )}

          {roadmap.Syllabus.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="mb-8">
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>

              {section.Lesson.map((lesson, lessonIndex) => {
                const lessonId = `${sectionIndex}-${lessonIndex}`;
                const isDone = completedLessons.includes(lessonId);

                return (
                  <div
                    key={lessonId}
                    className="flex justify-between items-center px-6 py-3 border-t border-zinc-800"
                  >
                    <span
                      className={`text-sm ${isDone ? "line-through text-zinc-500" : ""
                        }`}
                    >
                      {lesson}
                    </span>

                    <Button
                      size="sm"
                      variant={isDone ? "secondary" : "default"}
                      disabled={!started}
                      onClick={() => handleToggleLesson(lessonId)}
                    >
                      {isDone ? "Done" : started ? "Mark Complete" : "Locked"}
                    </Button>
                  </div>
                );
              })}
              <CardFooter />
            </Card>
          ))}
        </div>
        <AboutSection />
      </div>

      <Dialog open={showSignin} onOpenChange={setShowSignin}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="mb-2">Sign‑in required</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-zinc-500 mb-4">
            You need to be logged in to start this roadmap and track progress.
          </p>
          <Link to="/login">
            <Button size="sm" className="w-full">
              Go to Login
            </Button>
          </Link>
        </DialogContent>
      </Dialog>
    </>
  );
}
