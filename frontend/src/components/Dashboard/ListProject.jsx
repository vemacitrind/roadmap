import { useState } from "react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export default function ListProject({ open, onOpenChange, onSubmit, user }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [driveLinks, setDriveLinks] = useState("");
    const [images, setImages] = useState([]);
    const [technologies, setTechnologies] = useState("");
    const [price, setPrice] = useState("");
    const [uploading, setUploading] = useState(false);
    const [techQuery, setTechQuery] = useState("");
    const [selectedTech, setSelectedTech] = useState([]);

    // Upload images one by one, return array of URLs
    const uploadImages = async () => {
        const urls = [];
        for (const file of images) {
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
                throw error; 
            }
        }
        return urls;
    };

    const addTechnology = (tech) => {
        if (!selectedTech.find(t => t.name === tech.name)) {
            setSelectedTech([...selectedTech, tech]);
        }
        setTechQuery("");
    };

    const removeTechnology = (name) => {
        setSelectedTech(selectedTech.filter(t => t.name !== name));
    };

    const filteredTech = techQuery.length >= 1
        ? techList.filter(t =>
            t.name.toLowerCase().includes(techQuery.toLowerCase())
        )
        : [];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            toast({ title: "Title is required", variant: "destructive" });
            return;
        }
        setUploading(true);

        let uploadedImageUrls = [];
        try {
            if (images.length > 0) {
                uploadedImageUrls = await uploadImages();
            }
        } catch {
            setUploading(false);
            return;
        }

        const projectData = {
            title,
            description,
            link: link.trim() || null,
            driveLinks: driveLinks
                .split(",")
                .map((d) => d.trim())
                .filter(Boolean),
            images: uploadedImageUrls,
            technologies: technologies
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            price: Number(price) || 0,
            is_available: true,
            uid: user.uid,
        };

        try {
            await onSubmit(projectData);
            toast.success("Project listed successfully!");
            // Clear form
            setTitle("");
            setDescription("");
            setLink("");
            setDriveLinks("");
            setImages([]);
            setTechnologies("");
            setPrice("");
            onOpenChange(false);
        } catch (error) {
            toast.error("Failed to list project");
            console.error(error);
        } finally {
            setUploading(false);
        }
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>List a New Project</DialogTitle>
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
                        <Label htmlFor="images">Project Images (multiple)</Label>
                        <Input
                            id="images"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => setImages(Array.from(e.target.files))}
                            disabled={uploading}
                        />
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
                        <Label htmlFor="price">Price (USD)</Label>
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
                            {uploading ? "Uploading..." : "List Project"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
