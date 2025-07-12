import { useState, useEffect } from "react";
import { getAllRoadmaps } from "@/lib/roadmapData";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableCell, TableBody,TableHead } from "@/components/ui/table";
import { LayoutList, LayoutGrid } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [view, setView] = useState("card"); 
  const [loading,setloading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getAllRoadmaps().then(setRoadmaps);
    setTimeout(()=>setloading(false),1500);
    
  }, []);

  const filtered = roadmaps.filter((r) => {
    if (filter === "all") return true;
    return r.type === filter;
  });

  // if(loading) return <span className=" animate-ping">Loading...</span>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Roadmaps</h1>
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex justify-between items-center gap-4">
          <div className="flex gap-2">
            {["all", "role-based", "skill-based"].map((cat) => (
              <Button
                key={cat}
                variant={filter === cat ? "default" : "outline"}
                onClick={() => setFilter(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </div>

          <Button variant="ghost" onClick={() => setView(view === "card" ? "table" : "card")}>
            {view === "card" ? <LayoutGrid className="w-5 h-5" /> : <LayoutList className="w-5 h-5" />}
          </Button>
        </div>

        {/* Card View */}
        {view === "card" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map((r, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-lg">{r.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-zinc-500">{r.type}</CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Table View */}
        {view === "table" && (
          <div className="rounded-xl border border-zinc-800 max-h-[70vh] overflow-y-auto">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="border-r border-zinc-800 text-center text-lg">Title</TableHead>
                  <TableHead className="border-r border-zinc-800 text-center text-lg">Type</TableHead>
                  <TableHead className="border-r border-zinc-800 text-center text-lg">Category</TableHead>
                  <TableHead className="border-r border-zinc-800 text-center text-lg">Description</TableHead>
                  <TableHead className="border-r border-zinc-800 text-center text-lg">Syllabus</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="border-r border-zinc-800">{r.title}</TableCell>
                    <TableCell className="border-r border-zinc-800">{r.type}</TableCell>
                    <TableCell className="border-r border-zinc-800">{r.category}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-wrap border-r border-zinc-800">
                      {r.description || "-"}
                    </TableCell>
                    <TableCell className="max-w-[240px] text-wrap ">
                      {Array.isArray(r.Syllabus)
                        ? JSON.stringify(r.Syllabus).slice(0, 150) + "..."
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
