import RoadmapTree from "@/components/RoadmapTree";

function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Frontend Roadmap</h1>
      <RoadmapTree category="role-based" roadmapId="backend" />
    </div>
  );
}

export default App;
