import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createUserPost } from "@/lib/community_page";
import { toast } from "sonner";

export default function FloatingPostInput({ user }) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) return toast.error("Title is required.");

    await createUserPost(
      {
        title,
        link,
        category: "community",
        source: "user",
      },
      user
    );

    toast.success("Post shared!");
    setTitle("");
    setLink("");
  };

  return (
    <div className="fixed max-w-4xl mx-auto bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 p-4 flex items-center gap-3 z-50">
      <img
        src={user?.photoURL || "/placeholder.png"}
        alt="User"
        className="w-10 h-10 rounded-full border border-zinc-600"
      />
      <div className="flex-1 space-y-2">
        <Textarea
          placeholder="Share something with the community..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="resize-none text-sm"
        />
        <Input
          placeholder="Optional link (https://...)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="text-sm"
        />
      </div>
      <Button onClick={handleSubmit} className="shrink-0">
        Post
      </Button>
    </div>
  );
}
