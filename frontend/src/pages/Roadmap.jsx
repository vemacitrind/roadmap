import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "@/firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Icon } from "@iconify/react";
import PracticeQuestion from "@/components/Explore/PracticeQuestion";
import { useAuth } from "@/auth/AuthContext";
import PageNotFound from "./PageNotFound";
import Loader from "@/components/Loader";
import { isStarted, handleStart as handleStartDB } from "@/lib/userData";
import { markLessonComplete } from "@/lib/userData"
import { sendRoadmapStartEmail } from "@/lib/api";
import BasicTemplate16 from "@/components/BaseTemplates/BasicTemplate16";

export default function RoadmapPage() {
  const { user } = useAuth()
  const { type, slug } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [started, setStarted] = useState(false);
  const isLocked = !user || !started;
  const showLogin = !user;
  const showStart = user && !started;

  useEffect(() => {
    async function fetchRoadmap() {
      try {
        const formattedTitle =
          slug?.replace(/-/g, " ")?.replace(/\b\w/g, (l) => l.toUpperCase());

        const ref = collection(db, "roadmaps", type, "documents");
        const q = query(ref, where("title", "==", formattedTitle));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          setRoadmap({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        } else {
          console.warn("No roadmap found for", formattedTitle);
        }
      } catch (err) {
        console.error("Error fetching roadmap:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRoadmap();
  }, [slug]);

  useEffect(() => {
    if (user?.uid && roadmap?.id) {
      isStarted(user?.uid, roadmap.id).then(setStarted);
    }
  }, [user, roadmap]);

  function handleStart() {
    if (!user) {
      console.log("Please login first");
      return;
    }

    handleStartDB(user, type, roadmap, (started) => {
      if (started) {
        setStarted(true);
        sendRoadmapStartEmail(
          user.email,
          roadmap.title,
          roadmap.description
        );
      }
    });
  }

  if (loading) return <Loader />
  if (!roadmap) return <PageNotFound type="roadmap-error" />;

  const syllabus = roadmap.Syllabus || [];
  const currentLesson = syllabus[currentIndex];

  const renderContent = (content) => {
    switch (content.type) {
      case "heading":
        return <h3 className="text-lg font-bold">{content.content}</h3>;
      case "text":
        return <p className="text-gray-600">{content.content}</p>;
      case "list":
        return (
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {content.content.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        );
      case "bash":
        return (
          <pre className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
            {content.content}
          </pre>
        );
      default:
        return null;
    }
  };

  const x = (
    <div className="max-w-6xl mx-auto p-6 space-y-8 text-start">
      {/* Roadmap Header */}
      <Card className="shadow-xl border border-gray-800 bg-gradient-to-r from-gray-900 via-gray-950 to-black">
        <CardHeader className="flex flex-row items-start gap-6">
          {/* Logo */}
          <div className="flex-shrink-0 bg-gray-800 p-4 rounded-2xl shadow-inner">
            <Icon
              icon={roadmap.icon || "mdi:book-outline"}
              className="w-16 h-16 text-primary"
            />
          </div>

          {/* Text Content */}
          <div className="flex flex-col flex-1">
            <CardTitle className="text-3xl font-bold text-white tracking-tight">
              {roadmap.title}
            </CardTitle>

            {/* Type / Category */}
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge
                variant="secondary"
                className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20"
              >
                {roadmap.type}
              </Badge>
              <Badge
                variant="outline"
                className="px-3 py-1 rounded-full text-sm text-gray-300 border-gray-700"
              >
                {roadmap.category}
              </Badge>
            </div>

            {/* Description */}
            {roadmap.description && (
              <p className="mt-4 text-gray-400 leading-relaxed text-sm">
                {roadmap.description}
              </p>
            )}
          </div>
        </CardHeader>
      </Card>
      <Separator />

      {/* Lesson Viewer */}
      <Card className="shadow-md border border-gray-800 relative">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">{currentLesson.title}</CardTitle>
        </CardHeader>

        <CardContent className={`space-y-6 ${isLocked ? "blur-sm pointer-events-none" : ""}`}>
          {/* Lesson Content */}
          <div className="space-y-4">
            {currentLesson.content.map((c, idx) => (
              <div key={idx}>{renderContent(c)}</div>
            ))}
          </div>

          {/* Questions */}
          {currentLesson.questions.length > 0 && (
            <div className="mt-8 space-y-4">
              <h4 className="font-semibold text-xl">Practice Questions</h4>
              {currentLesson.questions.map((q, qIdx) => (
                <PracticeQuestion
                  key={qIdx}
                  q={q}
                  qIdx={qIdx}
                  currentIndex={currentIndex}
                  answers={answers}
                  setAnswers={setAnswers}
                  userId={user?.uid}
                  roadmapId={roadmap.id}
                  lessonIndex={qIdx}
                  totalLessons={syllabus.length}
                />
              ))}
            </div>
          )}

        </CardContent>

        {/* Overlay Button */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            {showLogin && (
              <Link to="/login">
                <Button variant="default" className="gap-2">
                  <Icon icon="mdi:lock" className="w-5 h-5" />
                  Login
                </Button>
              </Link>
            )}
            {showStart && (
              <Button
                variant="default"
                className="gap-2"
                onClick={handleStart}
              >
                <Icon icon="mdi:lock" className="w-5 h-5" />
                Start
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => prev - 1)}
        >
          ← Prev
        </Button>
        <span className="text-sm text-gray-400">
          Lesson {currentIndex + 1} of {syllabus.length}
        </span>
        <Button
          onClick={async () => {
            if (type === "role-based") {
              await markLessonComplete(user?.uid, roadmap?.id, currentIndex, syllabus.length);
            }

            // Only increment if not the last lesson
            if (currentIndex !== syllabus.length - 1) {
              setCurrentIndex((prev) => prev + 1);
            }
          }}
        >
          {currentIndex === syllabus.length - 1 ? "Finish" : "Next →"}
        </Button>
      </div>
    </div>
  );

  return (
    <BasicTemplate16 children={x} />
  )
}