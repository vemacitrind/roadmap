import { useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import ProfileHeader from "@/components/Dashboard/ProfileHeader";
import { fetchUserProfile, updateUserProfile } from "@/lib/userProfile";
import HexBadge from "@/components/Dashboard/HexBadge";
import BasicHeader from "@/components/BasicHeader";
import AboutSection from "@/components/AboutSection";
import CompletedBadges from "@/components/Dashboard/CompletedBadges";
import PendingRoadmap from "@/components/Dashboard/PendingRoadmap"
export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noUser, setNoUser] = useState(false);

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
          <a
            href="/login"
            className="inline-block px-6 py-2 font-medium underline"
          >
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

  return (
    <>
      <BasicHeader />
      <div className="mt-16 min-h-screen bg-zinc-950 text-white p-6 md:p-10">
        <div className="max-w-5xl mx-auto space-y-10">
          {profile && <ProfileHeader user={profile} onSave={handleSave} />}

          <CompletedBadges data={completed} />

          <PendingRoadmap roadmaps={profile?.roadmap} />

        </div>
      </div>
      <AboutSection />
    </>
  );
}