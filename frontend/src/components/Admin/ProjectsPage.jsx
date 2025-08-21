// import { useEffect, useState } from "react";
// import { getAllProjects, getAllUsers } from "@/lib/adminData";
// import { Input } from "@/components/ui/input";
// import { Button } from "../ui/button";
// import {
//     DropdownMenu,
//     DropdownMenuTrigger,
//     DropdownMenuContent,
//     DropdownMenuRadioGroup,
//     DropdownMenuRadioItem
// } from "@/components/ui/dropdown-menu";
// import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { ArrowDownUp, LayoutGrid, LayoutList, Plus, Pencil } from "lucide-react";
// import { Icon } from "@iconify/react";
// import technologiesData from "@/lib/technologies.json";
// import {
//     Dialog,
//     DialogTrigger,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogFooter,
//     DialogClose
// } from "@/components/ui/dialog";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/auth/AuthContext";
// import ListProject from "../Dashboard/ListProject";
// import { addProject } from "@/lib/project";
// import Loader from "../Loader";

// export default function ProjectsPage() {
//     const [projects, setProjects] = useState([]);
//     const [usersMap, setUsersMap] = useState({});
//     const [search, setSearch] = useState("");
//     const [sortBy, setSortBy] = useState("title");
//     const [order, setOrder] = useState("asc");
//     const [techFilter, setTechFilter] = useState("");
//     const navigate = useNavigate();
//     const [viewType, setViewType] = useState("table");
//     const user = useAuth();
//     const [isListProjectOpen, setIsListProjectOpen] = useState(false);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         async function fetchData() {
//             setLoading(true);
//             const [projectsData, usersData] = await Promise.all([
//                 getAllProjects(),
//                 getAllUsers(),
//             ]);
//             setProjects(projectsData);
//             const map = {};
//             usersData.forEach((u) => {
//                 map[u.id] = u.name;
//             });
//             setUsersMap(map);
//             setLoading(false);
//         }

//         fetchData();
//     }, []);


//     const filteredProjects = projects
//         .filter(p =>
//             p.title?.toLowerCase().includes(search.toLowerCase()) ||
//             p.description?.toLowerCase().includes(search.toLowerCase())
//         )
//         .filter(p => techFilter ? p.technologies?.includes(techFilter) : true)
//         .sort((a, b) => {
//             let aVal = sortBy === "createdAt" ? new Date(a.createdAt?.seconds * 1000) : a[sortBy];
//             let bVal = sortBy === "createdAt" ? new Date(b.createdAt?.seconds * 1000) : b[sortBy];
//             if (typeof aVal === "string") aVal = aVal.toLowerCase();
//             if (typeof bVal === "string") bVal = bVal.toLowerCase();
//             return order === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
//         });

//     const allTechs = Array.from(new Set(projects.flatMap(p => p.technologies || [])));

//     return (
//         <div className="space-y-6">
//             {/* Search, Add, Sort */}
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                 <Input
//                     placeholder="Search projects..."
//                     value={search}
//                     onChange={e => setSearch(e.target.value)}
//                     className="max-w-md"
//                 />
//                 <div className="flex gap-2 flex-wrap">

//                     <Button
//                         variant="default"
//                         className="flex items-center gap-2"
//                         onClick={() => setIsListProjectOpen(true)}
//                     >
//                         <Plus className="w-4 h-4" /> Add Project
//                     </Button>
//                     <ListProject
//                         open={isListProjectOpen}
//                         onOpenChange={setIsListProjectOpen}
//                         onSubmit={addProject}
//                         user={user.user}
//                     />

//                     {/* Sort */}
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button variant="outline" className="flex items-center gap-2">
//                                 <ArrowDownUp className="w-4 h-4" /> Sort
//                             </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent>
//                             <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
//                                 <DropdownMenuRadioItem value="title">Title</DropdownMenuRadioItem>
//                                 <DropdownMenuRadioItem value="createdAt">Created At</DropdownMenuRadioItem>
//                                 <DropdownMenuRadioItem value="price">Price</DropdownMenuRadioItem>
//                             </DropdownMenuRadioGroup>
//                             <DropdownMenuRadioGroup value={order} onValueChange={setOrder}>
//                                 <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
//                                 <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
//                             </DropdownMenuRadioGroup>
//                         </DropdownMenuContent>
//                     </DropdownMenu>

//                     {/* Technology Filter */}
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button variant="outline" className="flex items-center gap-2">
//                                 Technology
//                             </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent>
//                             <DropdownMenuRadioGroup value={techFilter} onValueChange={setTechFilter}>
//                                 <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
//                                 {allTechs.map(tech => {
//                                     const techObj = technologiesData.find(t => t.name === tech);
//                                     return (
//                                         <DropdownMenuRadioItem key={tech} value={tech} className="flex items-center gap-2">
//                                             {techObj && <Icon icon={techObj.icon} className="w-4 h-4" />}
//                                             {tech}
//                                         </DropdownMenuRadioItem>
//                                     );
//                                 })}
//                             </DropdownMenuRadioGroup>
//                         </DropdownMenuContent>
//                     </DropdownMenu>

//                     <Button
//                         variant="outline"
//                         onClick={() => setViewType(viewType === "table" ? "card" : "table")}
//                     >
//                         {viewType === "table" ? <LayoutGrid /> : <LayoutList />}
//                     </Button>
//                 </div>
//             </div>

//             {loading && (
//                 <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//                     <Loader />
//                 </div>
//             )}
//             {/* Table View */}
//             {viewType === "table" ? (
//                 <div className="overflow-x-auto border border-zinc-800 rounded-lg">
//                     <table className="w-full text-left text-white border-collapse">
//                         <thead className="bg-zinc-900 border-b border-zinc-700">
//                             <tr>
//                                 <th className="px-4 py-3">Title</th>
//                                 <th className="px-4 py-3">Creator</th>
//                                 <th className="px-4 py-3">Status</th>
//                                 <th className="px-4 py-3">Price</th>
//                                 <th className="px-4 py-3">Technologies</th>
//                                 <th className="px-4 py-3">Created At</th>
//                                 <th className="px-4 py-3">Live Link</th>
//                                 <th className="px-4 py-3">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredProjects.map((p, i) => {
//                                 const createdDate = p.createdAt ? new Date(p.createdAt.seconds * 1000).toLocaleDateString() : "Unknown";
//                                 return (
//                                     <tr key={i} className="hover:bg-zinc-800 transition-colors">
//                                         <td className="px-4 py-3 font-semibold">{p.title}</td>
//                                         <td className="px-4 py-3 cursor-pointer hover:underline"
//                                             onClick={() => navigate(`/admin/users?s=${encodeURIComponent(usersMap[p.uid] || "")}`)}
//                                         >
//                                             {usersMap[p.uid] || "Unknown"}
//                                         </td>
//                                         <td className="px-4 py-3">
//                                             <Badge variant={p.status === "completed" ? "success" : "destructive"}>{p.status}</Badge>
//                                         </td>
//                                         <td className="px-4 py-3">{p.price || 0}</td>
//                                         <td className="px-4 py-3 flex flex-wrap gap-1">
//                                             {p.technologies.map((tech, idx) => (
//                                                 <Badge key={idx} variant={"secondary"}>{tech}</Badge>
//                                             ))}
//                                         </td>
//                                         <td className="px-4 py-3 text-zinc-400">{createdDate}</td>

//                                         <td className="px-4 py-3">
//                                             {p.link ? (
//                                                 <a href={p.link} target="_blank" rel="noreferrer">
//                                                     <Badge variant="outline" className="cursor-pointer">Live</Badge>
//                                                 </a>
//                                             ) : (
//                                                 <Badge variant="secondary">N/A</Badge>
//                                             )}
//                                         </td>

//                                         <td className="px-4 py-3">
//                                             <Dialog open={open} onOpenChange={onOpenChange}>
//                                                 <DialogContent>
//                                                     <DialogHeader>
//                                                         <DialogTitle>Edit Project</DialogTitle>
//                                                     </DialogHeader>
//                                                     <form onSubmit={handleSubmit} className="space-y-4">
//                                                         <div>
//                                                             <Label htmlFor="title">Title *</Label>
//                                                             <Input
//                                                                 id="title"
//                                                                 type="text"
//                                                                 value={title}
//                                                                 onChange={(e) => setTitle(e.target.value)}
//                                                                 required
//                                                                 disabled={uploading}
//                                                             />
//                                                         </div>

//                                                         <div>
//                                                             <Label htmlFor="description">Description</Label>
//                                                             <Textarea
//                                                                 id="description"
//                                                                 value={description}
//                                                                 onChange={(e) => setDescription(e.target.value)}
//                                                                 disabled={uploading}
//                                                             />
//                                                         </div>

//                                                         <div>
//                                                             <Label htmlFor="link">Demo Link (optional)</Label>
//                                                             <Input
//                                                                 id="link"
//                                                                 type="url"
//                                                                 value={link}
//                                                                 onChange={(e) => setLink(e.target.value)}
//                                                                 disabled={uploading}
//                                                             />
//                                                         </div>

//                                                         <div>
//                                                             <Label htmlFor="driveLinks">Drive Links (comma separated)</Label>
//                                                             <Input
//                                                                 id="driveLinks"
//                                                                 type="text"
//                                                                 value={driveLinks}
//                                                                 onChange={(e) => setDriveLinks(e.target.value)}
//                                                                 disabled={uploading}
//                                                             />
//                                                         </div>

//                                                         <div>
//                                                             <Label>Project Images</Label>
//                                                             <div className="flex flex-wrap gap-3 mb-2 items-center">
//                                                                 {existingImages.map(imgUrl => (
//                                                                     <div key={imgUrl} className="relative w-20 h-20 rounded overflow-hidden shadow border">
//                                                                         <img src={imgUrl} alt="project" className="w-full h-full object-cover" />
//                                                                         <button
//                                                                             type="button"
//                                                                             className="absolute top-0 right-0 bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-red-600"
//                                                                             onClick={() => handleRemoveExistingImage(imgUrl)}
//                                                                             tabIndex={0}
//                                                                         >
//                                                                             <Icon icon="mdi:close" width={18} />
//                                                                         </button>
//                                                                     </div>
//                                                                 ))}

//                                                                 {newImages.map((file, idx) => (
//                                                                     <div key={idx} className="relative w-20 h-20 rounded overflow-hidden shadow border">
//                                                                         <img src={URL.createObjectURL(file)} alt="new upload" className="w-full h-full object-cover" />
//                                                                         <button
//                                                                             type="button"
//                                                                             className="absolute top-0 right-0 bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-red-600"
//                                                                             onClick={() => handleRemoveNewImage(idx)}
//                                                                             tabIndex={0}
//                                                                         >
//                                                                             <Icon icon="mdi:close" width={18} />
//                                                                         </button>
//                                                                     </div>
//                                                                 ))}

//                                                                 <button
//                                                                     type="button"
//                                                                     className="w-20 h-20 border-2 border-dashed rounded flex items-center justify-center text-2xl text-zinc-400 hover:text-white hover:border-zinc-700 transition"
//                                                                     onClick={() => fileInputRef.current.click()}
//                                                                     tabIndex={0}
//                                                                     disabled={uploading}
//                                                                 >
//                                                                     <Icon icon="mdi:plus" width={28} />
//                                                                     <input
//                                                                         type="file"
//                                                                         ref={fileInputRef}
//                                                                         accept="image/*"
//                                                                         style={{ display: "none" }}
//                                                                         onChange={handleAddImage}
//                                                                         disabled={uploading}
//                                                                         multiple={true}
//                                                                     />
//                                                                 </button>
//                                                             </div>
//                                                         </div>

//                                                         <div>
//                                                             <Label>Technologies</Label>
//                                                             <div className="flex flex-wrap gap-2 mb-2">
//                                                                 {selectedTech.map(tech => (
//                                                                     <Badge
//                                                                         key={tech.name}
//                                                                         className="flex items-center gap-1 cursor-pointer"
//                                                                         variant={"secondary"}
//                                                                         onClick={() => removeTechnology(tech.name)}
//                                                                     >
//                                                                         <Icon icon={tech.icon} className="w-4 h-4" />
//                                                                         {tech.name} ✕
//                                                                     </Badge>
//                                                                 ))}
//                                                             </div>

//                                                             <Popover open={!!techQuery && filteredTech.length > 0}>
//                                                                 <PopoverTrigger asChild>
//                                                                     <Input
//                                                                         type="text"
//                                                                         value={techQuery}
//                                                                         onChange={e => setTechQuery(e.target.value)}
//                                                                         placeholder="Type a technology..."
//                                                                         disabled={uploading}
//                                                                     />
//                                                                 </PopoverTrigger>
//                                                                 <PopoverContent
//                                                                     className="w-full p-0"
//                                                                     onOpenAutoFocus={e => e.preventDefault()}
//                                                                 >
//                                                                     <div className="max-h-48 overflow-y-auto">
//                                                                         {filteredTech.map(tech => (
//                                                                             <button
//                                                                                 key={tech.name}
//                                                                                 onClick={() => addTechnology(tech)}
//                                                                                 className="flex items-center gap-2 w-full p-2 hover:bg-accent"
//                                                                             >
//                                                                                 <Icon icon={tech.icon} className="w-5 h-5" />
//                                                                                 {tech.name}
//                                                                             </button>
//                                                                         ))}
//                                                                     </div>
//                                                                 </PopoverContent>
//                                                             </Popover>
//                                                         </div>

//                                                         <div>
//                                                             <Label htmlFor="price">Price (INR)</Label>
//                                                             <Input
//                                                                 id="price"
//                                                                 type="number"
//                                                                 min="0"
//                                                                 value={price}
//                                                                 onChange={e => setPrice(e.target.value)}
//                                                                 disabled={uploading}
//                                                             />
//                                                         </div>

//                                                         <DialogFooter>
//                                                             <Button type="submit" disabled={uploading}>
//                                                                 {uploading ? "Updating..." : "Update Project"}
//                                                             </Button>
//                                                             <DialogClose asChild>
//                                                                 <Button variant="outline" disabled={uploading}>Cancel</Button>
//                                                             </DialogClose>
//                                                         </DialogFooter>
//                                                     </form>
//                                                 </DialogContent>
//                                             </Dialog>
//                                         </td>
//                                     </tr>
//                                 );
//                             })}
//                         </tbody>

//                     </table>
//                 </div>
//             ) : (
//                 // Card View
//                 <div className="max-h-[70vh] overflow-y-auto pr-2">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//                         {filteredProjects.map((p, i) => {
//                             const createdDate = p.createdAt
//                                 ? new Date(p.createdAt.seconds * 1000).toLocaleDateString()
//                                 : "Unknown";

//                             return (
//                                 <Card
//                                     key={i}
//                                     className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
//                                 >
//                                     {p.images?.[0] && (
//                                         <div
//                                             className="relative w-full rounded-t-lg overflow-hidden"
//                                             style={{ paddingTop: "56.25%" }} // 16:9 ratio (9/16 = 0.5625)
//                                             onClick={() => navigate(`/project/${p.id || p.projectId}`)}
//                                         >
//                                             <img
//                                                 src={p.images[0]}
//                                                 alt={p.title}
//                                                 className="absolute top-0 left-0 w-full h-full object-cover"
//                                             />
//                                         </div>
//                                     )}
//                                     <CardHeader>
//                                         <CardTitle className="text-lg font-semibold">{p.title}</CardTitle>
//                                         <div className="text-sm text-zinc-400">
//                                             {createdDate} | {usersMap[p.uid] || "Unknown"}
//                                         </div>
//                                     </CardHeader>
//                                     <CardContent className="space-y-2">
//                                         <p className="text-zinc-300">{p.description}</p>
//                                         <div className="flex flex-wrap gap-2">
//                                             {p.technologies.map((tech, idx) => {
//                                                 const techObj = technologiesData.find((t) => t.name === tech);
//                                                 return (
//                                                     <div
//                                                         key={idx}
//                                                         className="flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded-lg text-sm hover:bg-zinc-700 transition-all"
//                                                     >
//                                                         {techObj && <Icon icon={techObj.icon} className="w-4 h-4" />}
//                                                         {tech}
//                                                     </div>
//                                                 );
//                                             })}
//                                         </div>
//                                         <Badge
//                                             variant={p.status === "completed" ? "secondary" : "destructive"}
//                                         >
//                                             {p.status}
//                                         </Badge>
//                                         <div>Price: {p.price || 0}</div>
//                                     </CardContent>
//                                 </Card>
//                             );
//                         })}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }
import { useState, useEffect, useRef } from "react";
import { getAllProjects, getAllUsers } from "@/lib/adminData";
import { addProject } from "@/lib/project";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

import { Input} from "@/components/ui/input"
import { Button } from "../ui/button";
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { Popover,PopoverTrigger,PopoverContent } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";

import {
  ArrowDownUp,
  LayoutGrid,
  LayoutList,
  Plus,
  Pencil,
} from "lucide-react";

import { Icon } from "@iconify/react";

import ListProject from "../Dashboard/ListProject";
import Loader from "../Loader";

import technologiesData from "@/lib/technologies.json";

import { toast } from "sonner"; // replace with your toast lib import

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [order, setOrder] = useState("asc");
  const [techFilter, setTechFilter] = useState("");
  const [viewType, setViewType] = useState("table");
  const [loading, setLoading] = useState(false);
  const [isListProjectOpen, setIsListProjectOpen] = useState(false);

  const [editProject, setEditProject] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const user = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [projectsData, usersData] = await Promise.all([
        getAllProjects(),
        getAllUsers(),
      ]);
      setProjects(projectsData);
      const map = {};
      usersData.forEach((u) => {
        map[u.id] = u.name;
      });
      setUsersMap(map);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredProjects = projects
    .filter(
      (p) =>
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) => (techFilter ? p.technologies?.includes(techFilter) : true))
    .sort((a, b) => {
      let aVal =
        sortBy === "createdAt"
          ? new Date(a.createdAt?.seconds * 1000)
          : a[sortBy];
      let bVal =
        sortBy === "createdAt"
          ? new Date(b.createdAt?.seconds * 1000)
          : b[sortBy];
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      return order === "asc" ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
    });

  const allTechs = Array.from(new Set(projects.flatMap((p) => p.technologies || [])));

  // --------------- Edit Project Dialog Component -----------------

  function EditProjectDialog({ project, open, onOpenChange }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [driveLinks, setDriveLinks] = useState("");
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [price, setPrice] = useState("");
    const [techQuery, setTechQuery] = useState("");
    const [selectedTech, setSelectedTech] = useState([]);

    const fileInputRef = useRef(null);

    // Load project data into form when dialog opens
    useEffect(() => {
      if (open && project?.id) {
        (async () => {
          try {
            const docRef = doc(db, "projects", project.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              setTitle(data.title || "");
              setDescription(data.description || "");
              setLink(data.link || "");
              setDriveLinks((data.driveLinks || []).join(", "));
              setPrice(data.price ? String(data.price) : "");
              setExistingImages(data.images || []);
              setNewImages([]);
              const selected = (data.technologies || [])
                .map((techName) =>
                  technologiesData.find((t) => t.name === techName)
                )
                .filter(Boolean);
              setSelectedTech(selected);
            } else {
              toast.error("Project data not found.");
              onOpenChange(false);
            }
          } catch (error) {
            toast.error("Failed to load project data");
            onOpenChange(false);
          }
        })();
      }
    }, [open, project?.id, onOpenChange]);

    const filteredTech =
      techQuery.length >= 1
        ? technologiesData.filter((t) =>
            t.name.toLowerCase().includes(techQuery.toLowerCase())
          )
        : [];

    const addTechnology = (tech) => {
      if (!selectedTech.find((t) => t.name === tech.name)) {
        setSelectedTech([...selectedTech, tech]);
      }
      setTechQuery("");
    };

    const removeTechnology = (name) => {
      setSelectedTech(selectedTech.filter((t) => t.name !== name));
    };

    const handleRemoveExistingImage = (url) => {
      setExistingImages(existingImages.filter((img) => img !== url));
    };

    const handleRemoveNewImage = (idx) => {
      setNewImages(newImages.filter((_, i) => i !== idx));
    };

    const handleAddImage = (e) => {
      const file = e.target.files[0];
      if (file) {
        setNewImages([...newImages, file]);
      }
      e.target.value = "";
    };

    const uploadImages = async (files) => {
      const urls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        try {
          const res = await axios.post(
            "http://localhost:5000/api/generate-project-img-url",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          urls.push(res.data.url);
        } catch (error) {
          toast({
            title: "Upload Failed",
            description: `Failed to upload image: ${file.name}`,
            variant: "destructive",
          });
          throw error;
        }
      }
      return urls;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!title.trim()) {
        toast({ title: "Title is required", variant: "destructive" });
        return;
      }
      setUploading(true);
      let uploadedImageUrls = [];
      try {
        if (newImages.length > 0) {
          uploadedImageUrls = await uploadImages(newImages);
        }
      } catch {
        setUploading(false);
        return;
      }
      const finalImages = [...existingImages, ...uploadedImageUrls];
      const updatedProject = {
        title,
        description,
        link: link.trim() || null,
        driveLinks: driveLinks
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean),
        images: finalImages,
        technologies: selectedTech.map((t) => t.name),
        price: Number(price) || 0,
      };
      try {
        const docRef = doc(db, "projects", project.id);
        await updateDoc(docRef, updatedProject);
        toast.success("Project updated successfully!");
        onOpenChange(false);
        // Optionally refresh projects data here or update local state for immediate UI reflect
        // For example: refetch projects or update single project locally
      } catch (error) {
        toast.error("Failed to update project");
        console.error(error);
      } finally {
        setUploading(false);
      }
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={uploading}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={uploading}
              />
            </div>
            <div>
              <Label htmlFor="link">Demo Link (optional)</Label>
              <Input
                id="link"
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                disabled={uploading}
              />
            </div>
            <div>
              <Label htmlFor="driveLinks">Drive Links (comma separated)</Label>
              <Input
                id="driveLinks"
                type="text"
                value={driveLinks}
                onChange={(e) => setDriveLinks(e.target.value)}
                disabled={uploading}
              />
            </div>
            <div>
              <Label>Project Images</Label>
              <div className="flex flex-wrap gap-3 mb-2 items-center">
                {existingImages.map((imgUrl) => (
                  <div
                    key={imgUrl}
                    className="relative w-20 h-20 rounded overflow-hidden shadow border"
                  >
                    <img
                      src={imgUrl}
                      alt="project"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-red-600"
                      onClick={() => handleRemoveExistingImage(imgUrl)}
                      tabIndex={0}
                    >
                      <Icon icon="mdi:close" width={18} />
                    </button>
                  </div>
                ))}
                {newImages.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative w-20 h-20 rounded overflow-hidden shadow border"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="new upload"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-red-600"
                      onClick={() => handleRemoveNewImage(idx)}
                      tabIndex={0}
                    >
                      <Icon icon="mdi:close" width={18} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="w-20 h-20 border-2 border-dashed rounded flex items-center justify-center text-2xl text-zinc-400 hover:text-white hover:border-zinc-700 transition"
                  onClick={() => fileInputRef.current.click()}
                  tabIndex={0}
                  disabled={uploading}
                >
                  <Icon icon="mdi:plus" width={28} />
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleAddImage}
                    disabled={uploading}
                    multiple={true}
                  />
                </button>
              </div>
            </div>
            <div>
              <Label>Technologies</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedTech.map((tech) => (
                  <Badge
                    key={tech.name}
                    className="flex items-center gap-1 cursor-pointer"
                    variant={"secondary"}
                    onClick={() => removeTechnology(tech.name)}
                  >
                    <Icon icon={tech.icon} className="w-4 h-4" />
                    {tech.name} ✕
                  </Badge>
                ))}
              </div>
              <Popover open={!!techQuery && filteredTech.length > 0}>
                <PopoverTrigger asChild>
                  <Input
                    type="text"
                    value={techQuery}
                    onChange={(e) => setTechQuery(e.target.value)}
                    placeholder="Type a technology..."
                    disabled={uploading}
                  />
                </PopoverTrigger>
                <PopoverContent
                  className="w-full p-0"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  <div className="max-h-48 overflow-y-auto">
                    {filteredTech.map((tech) => (
                      <button
                        key={tech.name}
                        onClick={() => addTechnology(tech)}
                        className="flex items-center gap-2 w-full p-2 hover:bg-accent"
                        type="button"
                      >
                        <Icon icon={tech.icon} className="w-5 h-5" />
                        {tech.name}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="price">Price (INR)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={uploading}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={uploading}>
                {uploading ? "Updating..." : "Update Project"}
              </Button>
              <DialogClose asChild>
                <Button variant="outline" disabled={uploading}>
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  // --------------------------------------------------------

  return (
    <div className="space-y-6 relative">
      {/* Search, Add, Sort */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="default"
            className="flex items-center gap-2"
            onClick={() => setIsListProjectOpen(true)}
          >
            <Plus className="w-4 h-4" /> Add Project
          </Button>
          <ListProject
            open={isListProjectOpen}
            onOpenChange={setIsListProjectOpen}
            onSubmit={addProject}
            user={user.user}
          />
          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowDownUp className="w-4 h-4" /> Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                <DropdownMenuRadioItem value="title">Title</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="createdAt">Created At</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="price">Price</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuRadioGroup value={order} onValueChange={setOrder}>
                <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Technology Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Technology
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={techFilter}
                onValueChange={setTechFilter}
              >
                <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
                {allTechs.map((tech) => {
                  const techObj = technologiesData.find((t) => t.name === tech);
                  return (
                    <DropdownMenuRadioItem
                      key={tech}
                      value={tech}
                      className="flex items-center gap-2"
                    >
                      {techObj && <Icon icon={techObj.icon} className="w-4 h-4" />}
                      {tech}
                    </DropdownMenuRadioItem>
                  );
                })}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            onClick={() => setViewType(viewType === "table" ? "card" : "table")}
          >
            {viewType === "table" ? <LayoutGrid /> : <LayoutList />}
          </Button>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}

      {/* Table View */}
      {viewType === "table" ? (
        <div className="overflow-x-auto border border-zinc-800 rounded-lg">
          <table className="w-full text-left text-white border-collapse">
            <thead className="bg-zinc-900 border-b border-zinc-700">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Creator</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Technologies</th>
                <th className="px-4 py-3">Created At</th>
                <th className="px-4 py-3">Live Link</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p, i) => {
                const createdDate = p.createdAt
                  ? new Date(p.createdAt.seconds * 1000).toLocaleDateString()
                  : "Unknown";
                return (
                  <tr key={i} className="hover:bg-zinc-800 transition-colors">
                    <td className="px-4 py-3 font-semibold">{p.title}</td>
                    <td
                      className="px-4 py-3 cursor-pointer hover:underline"
                      onClick={() =>
                        navigate(`/admin/users?s=${encodeURIComponent(usersMap[p.uid] || "")}`)
                      }
                    >
                      {usersMap[p.uid] || "Unknown"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={p.status === "completed" ? "success" : "destructive"}
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{p.price || 0}</td>
                    <td className="px-4 py-3 flex flex-wrap gap-1">
                      {p.technologies?.map((tech, idx) => (
                        <Badge key={idx} variant={"secondary"}>
                          {tech}
                        </Badge>
                      ))}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{createdDate}</td>
                    <td className="px-4 py-3">
                      {p.link ? (
                        <a href={p.link} target="_blank" rel="noreferrer">
                          <Badge variant="outline" className="cursor-pointer">
                            Live
                          </Badge>
                        </a>
                      ) : (
                        <Badge variant="secondary">N/A</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditProject(p);
                          setEditOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Card View */
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredProjects.map((p, i) => {
              const createdDate = p.createdAt
                ? new Date(p.createdAt.seconds * 1000).toLocaleDateString()
                : "Unknown";
              return (
                <Card
                  key={i}
                  className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(`/project/${p.id || p.projectId}`)}
                >
                  {p.images?.[0] && (
                    <div
                      className="relative w-full rounded-t-lg overflow-hidden"
                      style={{ paddingTop: "56.25%" }} // 16:9 aspect ratio
                    >
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">{p.title}</CardTitle>
                    <div className="text-sm text-zinc-400">
                      {createdDate} | {usersMap[p.uid] || "Unknown"}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-zinc-300">
  {p.description?.length > 100
    ? p.description.slice(0, 100) + "…"
    : p.description}
</p>
                    <div className="flex flex-wrap gap-2">
                      {p.technologies?.map((tech, idx) => {
                        const techObj = technologiesData.find((t) => t.name === tech);
                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded-lg text-sm hover:bg-zinc-700 transition-all"
                          >
                            {techObj && <Icon icon={techObj.icon} className="w-4 h-4" />}
                            {tech}
                          </div>
                        );
                      })}
                    </div>
                    <Badge variant={p.status === "completed" ? "secondary" : "destructive"}>
                      {p.status}
                    </Badge>
                    <div>Price: {p.price || 0}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit Project Dialog */}
      {editProject && (
        <EditProjectDialog
          project={editProject}
          open={editOpen}
          onOpenChange={(openState) => {
            setEditOpen(openState);
            if (!openState) setEditProject(null);
          }}
        />
      )}
    </div>
  );
}
