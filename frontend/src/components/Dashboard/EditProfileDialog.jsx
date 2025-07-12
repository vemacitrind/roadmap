import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"

export default function EditProfileDialog({ open, onClose, userData, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    about: "",
    profileLink: "https://github.com/user-attachments/assets/c397a40b-d7a4-4e86-b7c5-8326c9a90610",
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

  const handleSubmit = () => {
    if (!formData.name.trim()) return toast.error("Name required!");
    const dataToSubmit = {
      ...formData,
      profileLink: formData.profileLink || "https://github-production-user-asset-6210df.s3.amazonaws.com/161121265/465578099-c397a40b-d7a4-4e86-b7c5-8326c9a90610.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250712%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250712T155508Z&X-Amz-Expires=300&X-Amz-Signature=3956a63cdc19eff28fed7e3e04f2103788992f35b8438e0349c2dd85e41ecbdf&X-Amz-SignedHeaders=host"
    };

    console.log("this is: " + dataToSubmit.profileLink);
    onSave(dataToSubmit);
    onClose();;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

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

          <div>
            <Label htmlFor="about">Profile URL</Label>
            <Input
              id="profileLink"
              value={formData.profileLink}
              onChange={(e) => handleChange("profileLink", e.target.value)}
              placeholder="img url"
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
