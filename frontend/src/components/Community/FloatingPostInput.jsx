import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createUserPost } from "@/lib/community_page";
import { toast } from "sonner";

export default function FloatingPostInput({ user }) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return toast.error("Title is required.");
    setLoading(true);

    try {
      await createUserPost(
        {
          title: title.trim(),
          link: link.trim() || null,
          category: "community",
          source: "user",
        },
        user
      );

      toast.success("Post shared!");
      setTitle("");
      setLink("");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to share post. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-sm shadow-lg z-50">
      <div className="max-w-4xl mx-auto p-4 flex items-start gap-3">
        {/* User Avatar */}
        <img
          src={user?.photoURL || "/placeholder.png"}
          alt="User"
          referrerPolicy="no-referrer"
          className="w-10 h-10 rounded-full border border-zinc-700"
        />

        {/* Input Fields */}
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="Share something with the community..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="resize-none text-sm border-zinc-700 bg-zinc-900 focus:border-blue-500 focus:ring-blue-500"
            rows={2}
          />
          <Input
            placeholder="Optional link (https://...)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="text-sm border-zinc-700 bg-zinc-900 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Post Button */}
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="shrink-0 px-4"
        >
          {loading ? "Posting..." : "Post"}
        </Button>
      </div>
    </div>
  );
}
