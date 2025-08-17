import { useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthContext";

import ProfileHeader from "@/components/Dashboard/ProfileHeader";
import CompletedBadges from "@/components/Dashboard/CompletedBadges";
import PendingRoadmap from "@/components/Dashboard/PendingRoadmap";
import ProjectSection from "@/components/Dashboard/ProjectSection";

import { Button } from "@/components/ui/button";

import BasicTemplate16 from "@/components/BaseTemplates/BasicTemplate16";

import { fetchUserProfile, updateUserProfile } from "@/lib/userProfile";
import { listenToUserProjects } from '@/lib/project'
import { db } from "@/firebase/config";
import { getDoc ,doc } from "firebase/firestore";

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noUser, setNoUser] = useState(false);
  const [roadmapDetails, setRoadmapDetails] = useState([]);
  const [activeView, setActiveView] = useState("roadmap");

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      setNoUser(true);
      return;
    }

    fetchUserProfile(user.uid)
      .then((data) => {
        setProfile({ ...user, ...data });
      })
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    setProjectsLoading(true);
    try {
      listenToUserProjects(user.uid, setProjects);
    } catch (err) {
      console.log(err)
    }
  }, []);

  const handleSave = async (updated) => {
    if (!user?.uid) return;
    await updateUserProfile(user.uid, updated);
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  useEffect(() => {
    const fetchRoadmapDetails = async () => {
      const details = [];

      for (const [roadmapId, roadmapData] of Object.entries(profile?.roadmapsProgress)) {
        try {
          const roadmapRef = doc(
            db,
            `roadmaps/${roadmapData.type}/documents/${roadmapId}`
          );
          const roadmapSnap = await getDoc(roadmapRef);

          if (roadmapSnap.exists()) {
            const { title, icon } = roadmapSnap.data();
            details.push({
              id: roadmapId,
              title,
              icon,
              progress: roadmapData.progress,
              status: roadmapData.progress === 100 ? "Completed" : "Incomplete",
              timestamp: roadmapData.startedAt
            });
          }
        } catch (error) {
          console.error(`Error fetching roadmap ${roadmapId}:`, error);
        }
      }
      setRoadmapDetails(details);
    };
    fetchRoadmapDetails();
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        Loading profile…
      </div>
    );
  } else if (noUser) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="text-center text-zinc-300 space-y-4">
          <h2 className="text-2xl font-semibold">Please login to view this page</h2>
          <a href="/login" className="inline-block px-6 py-2 font-medium underline">
            Login
          </a>
        </div>
      </div>
    );
  }

  const completed = roadmapDetails
  .filter((roadmap) => roadmap.progress === 100)
  .map((roadmap) => ({
    title: roadmap.title,
    icon: roadmap.icon,
  }));

  const x = (
    <>

      <div className="max-w-5xl mx-auto space-y-10">
        {profile && <ProfileHeader user={profile} onSave={handleSave} />}

        <CompletedBadges data={completed} />

        {/* Toggle buttons */}
        <div className="flex relative mb-6 border-b border-zinc-700 justify-around">
          {["roadmap", "projects"].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 
                ${activeView === view ? "text-zinc-50" : "text-zinc-200 hover:text-zinc-100"}`}
            >
              {view === "roadmap" ? "Roadmaps" : "Projects"}
            </button>
          ))}

          {/* Animated underline */}
          <span
            className="absolute bottom-0 h-[2px] bg-zinc-50 transition-all duration-300"
            style={{
              left: activeView === "roadmap" ? "0%" : "50%",
              width: "50%",
            }}
          />
        </div>

        {/* Show PendingRoadmap or ProjectSection based on toggle */}
        {activeView === "roadmap" ? (
          <PendingRoadmap roadmapDetails={roadmapDetails} />
        ) : (
          <ProjectSection projects={projects} loading={projectsLoading} user={user} />
        )}
      </div>

    </>
  );
  return (
    <BasicTemplate16 children={x} />
  )
}
