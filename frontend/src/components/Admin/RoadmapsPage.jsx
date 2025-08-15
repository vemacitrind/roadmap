import { useState, useEffect } from "react";
import { getAllRoadmaps } from "@/lib/roadmapData";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableCell, TableBody,TableHead } from "@/components/ui/table";
import { LayoutList, LayoutGrid ,Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { db } from "@/firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "sonner";
import { to } from "react-spring";

export default function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [view, setView] = useState("card"); 
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("skill-based");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllRoadmaps().then(setRoadmaps);
    setTimeout(()=>setloading(false),1500);
    
  }, []);

  const filtered = roadmaps.filter((r) => {
    if (filter === "all") return true;
    return r.type === filter;
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith(".json")) {
      setFile(selectedFile);
    } else {
      toast.warning("Please upload a .json file");
    }
  };

  const handleSubmit = async () => {
    if (!file) return toast.warning("Please select a JSON file");
    setLoading(true);
    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);

      await addDoc(collection(db, `roadmaps/${type}/documents`), jsonData);
      toast.success("Roadmap added successfully!");
      setOpen(false);
      setFile(null);
      setType("skill-based");
    } catch (error) {
      console.error("Error adding roadmap:", error);
      toast.error("Error uploading roadmap");
    } finally {
      setLoading(false);
    }
  };

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
          <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus className="w-4 h-4 mr-2" /> Add roadmap
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Roadmap</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Type Selection */}
          <div>
            <Label>Select Type</Label>
            <RadioGroup
              value={type}
              onValueChange={setType}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="skill-based" id="skill" />
                <Label htmlFor="skill">Skill-based</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="role-based" id="role" />
                <Label htmlFor="role">Role-based</Label>
              </div>
            </RadioGroup>
          </div>

          {/* File Input */}
          <div>
            <Label>Upload JSON</Label>
            <Input type="file" accept=".json" onChange={handleFileChange} />
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Uploading..." : "Add Roadmap"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
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
