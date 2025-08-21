"use client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import ProfileHeader from "@/components/Dashboard/ProfileHeader";
import CompletedBadges from "@/components/Dashboard/CompletedBadges";
import PendingRoadmap from "@/components/Dashboard/PendingRoadmap";
import ProjectSection from "@/components/Dashboard/ProjectSection";
import BasicTemplate16 from "@/components/BaseTemplates/BasicTemplate16";
import { doc, setDoc ,getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { fetchUserProfile } from "@/lib/userProfile";
import { listenToUserProjects } from "@/lib/project";
import { toast } from "sonner";
import PageNotFound from "./PageNotFound";
import Loader from "@/components/Loader";

export default function PublicDashboard() {
    const { uid } = useParams();
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [roadmapDetails, setRoadmapDetails] = useState([]);
    const [projects, setProjects] = useState([]);
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [activeView, setActiveView] = useState("roadmap");

    useEffect(() => {
        if (!uid) return;
        fetchUserProfile(uid)
            .then((data) => setProfile(data))
            .finally(() => setLoading(false));

        try {
            listenToUserProjects(uid, setProjects);
        } catch (err) {
            console.error(err);
        } finally {
            setProjectsLoading(false);
        }
    }, [uid]);

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

    if (!uid) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
                Please login first.
            </div>
        );
    }

    if (loading) {
        return (
            <Loader/>
        );
    }

    if (!profile || Object.keys(profile).length === 0) {
        return (
            <PageNotFound />
        );
    }

    const onSave = async (dataToSubmit) => {
        if (!user?.uid) {
            toast.error("User ID missing");
            return;
        }
        try {
            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, dataToSubmit, { merge: true });
            toast.success("Profile updated successfully!");
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile.");
        }
    };

    const completed = (roadmapDetails || [])
        .filter((roadmap) => roadmap.progress === 100)
        .map((roadmap) => ({
            title: roadmap.title,
            icon: roadmap.icon,
        }));

    const canEdit = user?.uid && user?.uid === uid;

    const pageContent = (
        <div className="max-w-5xl mx-auto space-y-10">
            <ProfileHeader user={profile} canEdit={canEdit} onSave={onSave} />

            <CompletedBadges data={completed} />

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
                <span
                    className="absolute bottom-0 h-[2px] bg-zinc-50 transition-all duration-300"
                    style={{
                        left: activeView === "roadmap" ? "0%" : "50%",
                        width: "50%",
                    }}
                />
            </div>

            {activeView === "roadmap" ? (
                <PendingRoadmap roadmapDetails={roadmapDetails} />
            ) : (
                <ProjectSection projects={projects} loading={projectsLoading} user={{ uid }} canEdit={canEdit} />
            )}
        </div>
    );

    return <BasicTemplate16>{pageContent}</BasicTemplate16>;
}
