// pages/RoadmapViewer.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRoadmap } from "@/lib/getRoadmap";
import { Card } from "@/components/ui/card";
import PageNotFound from "./PageNotFound";

export default function SkillBasedCategoryPage() {
  const { category } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState(null);
  const type = "skill-based";

  useEffect(() => {
    console.log(type+" "+category)
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

  if (error) return <PageNotFound type="roadmap-error"/>
  if (!roadmap) return <p className="text-zinc-500">Loading roadmap...</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{roadmap.title}</h2>
      <Card className="p-4 mb-4 text-zinc-700 whitespace-pre-line">
        {JSON.stringify(roadmap.tree) || "No description provided."}
      </Card>

      {/* Optional: Display steps/sections/tasks if present */}
      {roadmap.sections?.map((section, idx) => (
        <Card key={idx} className="p-4 my-2">
          <h3 className="text-lg font-semibold mb-1">{section.title}</h3>
          <p>{section.description}</p>
        </Card>
      ))}
    </div>
  );
}
