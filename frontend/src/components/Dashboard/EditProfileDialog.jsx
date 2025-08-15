import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

export default function EditProfileDialog({ open, onClose, userData, onSave }) {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    about: "",
    profileLink:
      "https://github.com/user-attachments/assets/c397a40b-d7a4-4e86-b7c5-8326c9a90610",
    github: "",
    linkedin: "",
    instagram: "",
    urls: [],
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        about: userData.about || "",
        profileLink: userData.profileLink || "",
        github: userData.github || "",
        linkedin: userData.linkedin || "",
        instagram: userData.instagram || "",
        urls: userData.urls?.length ? userData.urls : [""],
      });
    }
  }, [userData, open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleURLChange = (index, value) => {
    const updatedUrls = [...formData.urls];
    updatedUrls[index] = value;
    setFormData((prev) => ({ ...prev, urls: updatedUrls }));
  };

  const addUrlField = () => {
    setFormData((prev) => ({ ...prev, urls: [...prev.urls, ""] }));
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    const formDataObj = new FormData();
    formDataObj.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/generate-img-url", {
        method: "POST",
        body: formDataObj,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      handleChange("profileLink", data.url);
      toast.success("Image uploaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    }
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return toast.error("Name required!");
    const dataToSubmit = {
      ...formData,
      profileLink:
        formData.profileLink ||
        "https://github-production-user-asset-6210df.s3.amazonaws.com/161121265/465578099-c397a40b-d7a4-4e86-b7c5-8326c9a90610.png",
    };

    onSave(dataToSubmit);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="flex justify-center mb-6 relative">
          <img
            src={formData.profileLink}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-0 right-[calc(50%-48px)] bg-white p-1 rounded-full shadow hover:bg-gray-100"
          >
            <Pencil size={16} className="text-zinc-950"/>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files[0])}
          />
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              autoFocus
              placeholder="Your full name"
            />
          </div>

          {/* About */}
          <div>
            <Label htmlFor="about">About</Label>
            <Input
              id="about"
              value={formData.about}
              onChange={(e) => handleChange("about", e.target.value)}
              placeholder="Something about you"
            />
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                value={formData.github}
                onChange={(e) => handleChange("github", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={formData.linkedin}
                onChange={(e) => handleChange("linkedin", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={formData.instagram}
                onChange={(e) => handleChange("instagram", e.target.value)}
              />
            </div>
          </div>

          {/* Additional Links */}
          <div>
            <Label>Additional Links</Label>
            <div className="space-y-2">
              {formData.urls.map((url, index) => (
                <Input
                  key={index}
                  value={url}
                  onChange={(e) => handleURLChange(index, e.target.value)}
                  placeholder={`Custom URL #${index + 1}`}
                />
              ))}
              <Button
                onClick={addUrlField}
                size="sm"
                variant="outline"
                className="mt-2"
              >
                + Add URL
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
