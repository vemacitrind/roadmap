import { useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { listenToPosts, addCommentToPost } from "@/lib/community_page";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    MessageSquare,
    ThumbsUp,
    ThumbsDown,
    ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { handlePostReaction, subscribeToComments } from "@/lib/community_page";
import BasicHeader from "@/components/BasicHeader";
import FloatingPostInput from "@/components/Community/FloatingPostInput";
import { Separator } from "@/components/ui/separator";

export default function Community() {
    const [posts, setPosts] = useState([]);
    const [comment, setComment] = useState("");
    const [activePostId, setActivePostId] = useState(null);
    const { user } = useAuth();
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [commentsMap, setCommentsMap] = useState({});

    useEffect(() => {
        const unsubscribe = listenToPosts(setPosts);
        return () => unsubscribe();
    }, []);

    const handleComment = async (postId) => {
        if (!comment.trim()) return;
        await addCommentToPost(postId, comment, user);
        toast.success("Comment added!");
        setComment("");
        setActivePostId(null);
    };

    const handleReact = async (postId, type) => {
        if (!user) {
            setShowLoginDialog(true);
            return;
        }
        const res = await handlePostReaction(postId, user, type);
        if (!res.success) {
            toast.error(res.message);
        }
    };

    const handleToggleComments = (postId) => {
        if (activePostId === postId) {
            setActivePostId(null);
            return;
        }

        setActivePostId(postId);

        subscribeToComments(postId, (fetchedComments) => {
            setCommentsMap((prev) => ({
                ...prev,
                [postId]: fetchedComments,
            }));
        });
    };


    return (
        <>
            <BasicHeader />
            <div className="mt-20 mb-40 max-w-4xl mx-auto text-white space-y-8">
                {posts.map((post, index) => {
                    const isAdminPost = post.uid === "system-admin";

                    return (
                        <div key={post.id} className="space-y-4">
                            <div
                                className={`flex items-start gap-4 ${isAdminPost ? "bg-zinc-600/30 p-4 " : ""
                                    }`}
                            >
                                <img
                                    src={post.photoURL}
                                    alt={post.name}
                                    className="w-10 h-10 rounded-full border border-zinc-600"
                                />

                                <div className="flex-1">
                                    <div className="text-start text-lg font-semibold flex items-center gap-2">
                                        {post.title}
                                        {post.link && (
                                            <a
                                                href={post.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-500"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>

                                    <p className="text-sm text-zinc-400">{post.name}</p>

                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {post.source && (
                                            <Badge
                                                variant="outline"
                                                className="bg-zinc-800 text-zinc-300 border-zinc-600"
                                            >
                                                {post.source}
                                            </Badge>
                                        )}
                                        {post.category && (
                                            <Badge variant="secondary" className="text-white bg-blue-600">
                                                {post.category}
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="mt-4 flex items-center gap-6 text-zinc-400 text-sm">
                                        <div
                                            className="flex items-center gap-1 cursor-pointer hover:text-white"
                                            onClick={() => handleReact(post.id, "like")}
                                        >
                                            <ThumbsUp className="w-4 h-4" />
                                            {post.likes || 0}
                                        </div>
                                        <div
                                            className="flex items-center gap-1 cursor-pointer hover:text-white"
                                            onClick={() => handleReact(post.id, "dislike")}
                                        >
                                            <ThumbsDown className="w-4 h-4" />
                                            {post.dislikes || 0}
                                        </div>
                                        <div
                                            className="flex items-center gap-1 cursor-pointer hover:text-white"
                                            onClick={() => handleToggleComments(post.id)}
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                            Comment
                                        </div>
                                    </div>

                                    {commentsMap[post.id]?.length > 0 && (
                                        <div className="mt-4 space-y-2 text-sm text-zinc-300">
                                            <Separator/>
                                            {commentsMap[post.id].map((cmt, i) => (
                                                <div key={i} className="border-b border-zinc-800 pb-1 flex gap-2 items-start">
                                                    <img
                                                        src={cmt.profile || "/placeholder.png"}
                                                        alt={cmt.name}
                                                        className="w-6 h-6 rounded-full border border-zinc-700"
                                                    />
                                                    <p>
                                                        <strong>{cmt.name}:</strong> {cmt.content}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}


                                    {user && activePostId === post.id && (
                                        <div className="mt-4 space-y-2">
                                            <Textarea
                                                value={comment}
                                                placeholder="Write your comment..."
                                                onChange={(e) => setComment(e.target.value)}
                                            />
                                            <Button variant="secondary" onClick={() => handleComment(post.id)}>
                                                Post Comment
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {index !== posts.length - 1 && <Separator />}
                        </div>
                    );
                })}
            </div>

            {user && <FloatingPostInput user={user} />}
            <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-zinc-200">Sign In Required</DialogTitle>
                        <p className="text-zinc-500 text-sm">
                            Please <a href="/login" className="text-blue-500 underline">sign in</a> to like or dislike posts.
                        </p>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}
