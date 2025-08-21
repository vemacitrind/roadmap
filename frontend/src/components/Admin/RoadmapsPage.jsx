import { useState, useEffect } from "react";
import { getAllRoadmaps } from "@/lib/roadmapData";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@/components/ui/table";
import { LayoutList, LayoutGrid, Plus, Upload, Pencil } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { db } from "@/firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import Loader from "../Loader";

export default function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [view, setView] = useState("table");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingRoadmap, setEditingRoadmap] = useState(null);
  const [type, setType] = useState("skill-based");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAllRoadmaps()
      .then(setRoadmaps)
      .catch(() => toast.error("Failed to load roadmaps"))
      .finally(() => setLoading(false));
  }, []);


  const filtered = roadmaps.filter((r) => {
    const matchesFilter = filter === "all" || r.type === filter;
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.category && r.category.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
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
      setOpenAdd(false);
      setFile(null);
      setType("skill-based");
      setLoading(true);
      const updatedRoadmaps = await getAllRoadmaps();
      setRoadmaps(updatedRoadmaps);
    } catch (error) {
      console.error("Error adding roadmap:", error);
      toast.error("Error uploading roadmap");
    } finally {
      setLoading(false);
    }
  };

  function openEditDialog(roadmap) {
    setEditingRoadmap(roadmap);
    setOpenEdit(true);
  }

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    if (editingRoadmap) {
      setEditTitle(editingRoadmap.title || "");
      setEditDescription(editingRoadmap.description || "");
    }
  }, [editingRoadmap]);

  const handleEditSave = () => {
    toast.success("Save functionality to be implemented");
    setOpenEdit(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Roadmaps</h1>
      

      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            {["all", "role-based", "skill-based"].map((cat) => (
              <Button
                key={cat}
                variant={filter === cat ? "default" : "outline"}
                onClick={() => setFilter(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}

            <Input
              placeholder="Search roadmaps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-4 max-w-xs bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="ghost"
              onClick={() => setView(view === "card" ? "table" : "card")}
              aria-label="Toggle view"
            >
              {view === "card" ? (
                <LayoutGrid className="w-5 h-5" />
              ) : (
                <LayoutList className="w-5 h-5" />
              )}
            </Button>

            <Dialog open={openAdd} onOpenChange={setOpenAdd}>
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

                  <div>
                    <Label>Upload JSON</Label>
                    <div className="mt-2">
                      <label
                        htmlFor="file-upload"
                        className="flex items-center justify-center w-full px-4 py-2 border border-dashed border-zinc-600 rounded-lg cursor-pointer hover:bg-zinc-800 transition"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        <span>Choose JSON File</span>
                      </label>
                      <Input
                        id="file-upload"
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>

                  <Button onClick={handleSubmit} disabled={loading} className="w-full">
                    {loading ? "Uploading..." : "Add Roadmap"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      
        {/* Card View */}
        {view === "card" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((r, i) => (
              <Card
                key={i}
                className="bg-gradient-to-r from-gray-900 via-gray-950 to-black border border-gray-800 shadow-xl p-4"
              >
                <div className="flex items-start gap-4 items-center">
                  <Icon
                    icon={r.icon || "mdi:book-outline"}
                    className="w-12 h-12 text-primary flex-shrink-0 "
                  />
                  <CardHeader className="p-0">
                    <CardTitle className="text-xl">{r.title}</CardTitle>
                    <div className="text-sm text-zinc-400 mt-1 space-y-0.5">
                      <div className="text-start">Category: {r.category}</div>
                      <div className="text-start">Type: {r.type}</div>
                    </div>
                  </CardHeader>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Table View */}
        {view === "table" && (
          <div className="rounded-xl border border-zinc-800 max-h-[70vh] overflow-y-auto">
            <Table className="min-w-[900px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="border-r border-zinc-800 text-center text-lg">
                    Title
                  </TableHead>
                  <TableHead className="border-r border-zinc-800 text-center text-lg">
                    Type
                  </TableHead>
                  <TableHead className="border-r border-zinc-800 text-center text-lg">
                    Category
                  </TableHead>
                  <TableHead className="border-r border-zinc-800 text-center text-lg">
                    Description
                  </TableHead>
                  <TableHead className="border-r border-zinc-800 text-center text-lg">
                    Syllabus
                  </TableHead>
                  <TableHead className="text-center text-lg">Edit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="border-r border-zinc-800 flex items-center gap-2">
                      {r.icon && (
                        <Icon icon={r.icon} className="w-5 h-5 text-blue-400" />
                      )}
                      {r.title}
                    </TableCell>
                    <TableCell className="border-r border-zinc-800">{r.type}</TableCell>
                    <TableCell className="border-r border-zinc-800">
                      {r.category}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-wrap border-r border-zinc-800">
                      {r.description || "-"}
                    </TableCell>
                    <TableCell className="max-w-[240px] text-wrap ">
                      {Array.isArray(r.Syllabus)
                        ? JSON.stringify(r.Syllabus).slice(0, 150) + "..."
                        : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(r)}
                        aria-label={`Edit ${r.title}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {loading && <div className="w-full place-items-center"><Loader /></div>}
          </div>
        )}
      </div>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Roadmap</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <textarea
                id="edit-description"
                rows={4}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full p-2 rounded border border-zinc-800 bg-zinc-900 text-white resize-y"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenEdit(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
