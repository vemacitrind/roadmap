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

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noUser, setNoUser] = useState(false);

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
      // console.log(err)
    }
  }, []);

  const handleSave = async (updated) => {
    if (!user?.uid) return;
    await updateUserProfile(user.uid, updated);
    setProfile((prev) => ({ ...prev, ...updated }));
  };

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

  const completed = Object.entries(profile?.roadmap || {})
    .filter(([_, data]) => data.isComplete)
    .map(([title, data]) => ({
      title,
      name: data.name?.toLowerCase() || "",
    }));

  const x = (
    <>

      <div className="max-w-5xl mx-auto space-y-10">
        {profile && <ProfileHeader user={profile} onSave={handleSave} />}

        <CompletedBadges data={completed} />

        {/* Toggle buttons */}
        <div className="flex space-x-4 mb-6">
          <Button
            size="sm"
            variant={activeView === "roadmap" ? "default" : "outline"}
            onClick={() => setActiveView("roadmap")}
          >
            Roadmaps
          </Button>
          <Button
            size="sm"
            variant={activeView === "projects" ? "default" : "outline"}
            onClick={() => setActiveView("projects")}
          >
            Projects
          </Button>
        </div>

        {/* Show PendingRoadmap or ProjectSection based on toggle */}
        {activeView === "roadmap" ? (
          <PendingRoadmap roadmaps={profile?.roadmap} />
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
