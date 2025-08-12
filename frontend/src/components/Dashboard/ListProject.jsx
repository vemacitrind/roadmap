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

export default function ListProject({ open, onOpenChange, onSubmit, user }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [driveLinks, setDriveLinks] = useState("");
    const [images, setImages] = useState([]);
    const [technologies, setTechnologies] = useState("");
    const [price, setPrice] = useState("");
    const [uploading, setUploading] = useState(false);

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
                throw error; // stop further uploads
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
            if (images.length > 0) {
                uploadedImageUrls = await uploadImages();
            }
        } catch {
            setUploading(false);
            return; // upload failed, exit
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
                        <Label htmlFor="technologies">Technologies (comma separated)</Label>
                        <Input
                            id="technologies"
                            type="text"
                            value={technologies}
                            onChange={(e) => setTechnologies(e.target.value)}
                            disabled={uploading}
                        />
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
