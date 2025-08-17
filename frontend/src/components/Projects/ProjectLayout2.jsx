import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import techList from "@/lib/technologies.json";
import { Icon } from "@iconify/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config"; 
import { Link } from "react-router-dom";

export default function ProjectLayout({ project }) {
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    if (open) {
      (async () => {
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
          setNewImages([]); // reset new images on each open

          // Set selectedTech based on the technology names in data
          const selected = (data.technologies || [])
            .map((techName) => techList.find((t) => t.name === techName))
            .filter(Boolean);
          setSelectedTech(selected);
        } else {
          toast.error("Project data not found.");
        }
      })();
    }
  }, [open, project.id]);

  // Filter technology list based on current query
  const filteredTech =
    techQuery.length >= 1
      ? techList.filter((t) =>
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

  // Remove existing image by URL
  const handleRemoveExistingImage = (url) => {
    setExistingImages(existingImages.filter((img) => img !== url));
  };

  // Remove newly added image (file) by index
  const handleRemoveNewImage = (idx) => {
    setNewImages(newImages.filter((_, i) => i !== idx));
  };

  // Handle new images picked from file input
  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImages([...newImages, file]);
    }
    e.target.value = ""; // reset input
  };

  // Upload images one by one, return array of uploaded URLs
  const uploadImages = async (files) => {
    const urls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file); // singular 'file' key as backend expects
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
        console.error(error);
        throw error; // stop further uploads
      }
    }
    return urls;
  };

  // Form submission: upload new images and update project in Firebase
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
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update project");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition shadow-sm hover:shadow-md overflow-hidden relative">
      {/* Landscape Image */}
      {project.images && project.images.length > 0 ? (
        <div className="w-full aspect-video">
          <Link to={`/project/${project?.id}`}>
          <img
            src={project.images[0]}
            alt={project.title}
            className="w-full h-full object-cover"
            />
          </Link>
        </div>
      ) : (
        <div className="w-full aspect-video bg-zinc-800 flex items-center justify-center text-zinc-500">
          No Image
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 text-start">
          {project.title}
        </h3>
        <p className="text-sm text-zinc-400 text-start">{project.description}</p>
      </div>

      {/* Edit Button Bottom Right */}
      <div className="absolute bottom-3 right-3">
        <Button size="sm" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                {/* Existing Images */}
                {existingImages.map((imgUrl) => (
                  <div key={imgUrl} className="relative w-20 h-20 rounded overflow-hidden shadow border">
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

                {/* New Images (preview before upload) */}
                {newImages.map((file, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded overflow-hidden shadow border">
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

                {/* Add new image button */}
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
                    multiple={false}
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
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
