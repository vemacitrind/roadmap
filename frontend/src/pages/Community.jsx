import { useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { listenToPosts, addCommentToPost, handlePostReaction, subscribeToComments } from "@/lib/community_page";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MessageSquare, ThumbsUp, ThumbsDown, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BasicHeader from "@/components/BasicHeader";
import FloatingPostInput from "@/components/Community/FloatingPostInput";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/Loader";
import { Link as RouterLink } from "react-router-dom";

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [comment, setComment] = useState("");
  const [activePostId, setActivePostId] = useState(null);
  const { user } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [commentsMap, setCommentsMap] = useState({});
  const [showHeader, setShowHeader] = useState(true);
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToPosts((fetchedPosts) => {
      setPosts(fetchedPosts);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      lastScrollY = currentScrollY;

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowHeader(true);
      }, 300);
      
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
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
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${showHeader ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        <BasicHeader />
      </div>
      {loading ? <Loader/> : <></>}
      <div className="mt-20 mb-40 max-w-4xl mx-auto text-white space-y-10">
        {posts.map((post) => {
          const isAdminPost = post.uid === "0mpJx8NHbwXydCCdhBfvkqNbeyB2";
          const isLiked = post.isLiked?.[post.id];
          const isCommentOpen = activePostId === post.id;

          return (
            <div
              key={post.id}
              className={`p-6 shadow-lg backdrop-blur-sm transition hover:scale-[1.01] ${isAdminPost
                ? "bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-t border-b border-blue-500/50 rounded-none"
                : "bg-zinc-900/70 border border-zinc-800 rounded-xl"
                }`}
            >
              <div className="flex items-start gap-5">
                {isAdminPost ? (
                  <img
                    src={post.profileLink || "/placeholder.png"}
                    alt={post.name}
                    className="w-14 h-14 rounded-full border border-zinc-700 object-cover shadow-md"
                  />
                ) : (
                  <RouterLink to={`/${post.uid}`}>
                    <img
                      src={post.profileLink || "/placeholder.png"}
                      alt={post.name}
                      className="w-14 h-14 rounded-full border border-zinc-700 object-cover shadow-md cursor-pointer"
                    />
                  </RouterLink>
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-start text-sm text-zinc-400">{post.name}</p>
                      <h2 className="text-lg font-bold flex items-center gap-2 text-start">
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
                      </h2>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {post.source && (
                      <Badge
                        variant="outline"
                        className="bg-zinc-800 text-zinc-300 border-zinc-600"
                      >
                        {post.source}
                      </Badge>
                    )}
                    {post.category && (
                      <Badge
                        variant="secondary"
                        className="text-white bg-blue-600"
                      >
                        {post.category}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-6 text-zinc-400 text-sm">
                    <button
                      className="flex items-center gap-1 hover:text-white transition"
                      onClick={() => handleReact(post.id, "like")}
                    >
                      {isLiked ? (
                        <ThumbsUp className="w-4 h-4 fill-blue-500 text-blue-500" />
                      ) : (
                        <ThumbsUp className="w-4 h-4" />
                      )}
                      {post.likes || 0}
                    </button>
                    <button
                      className="flex items-center gap-1 hover:text-white transition"
                      onClick={() => handleReact(post.id, "dislike")}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      {post.dislikes || 0}
                    </button>
                    <button
                      className="flex items-center gap-1 hover:text-white transition"
                      onClick={() =>
                        handleToggleComments(post.id)
                      }
                    >
                      <MessageSquare className="w-4 h-4" />
                      Comment
                    </button>
                  </div>

                  {isCommentOpen && (
                    <div className="mt-4 space-y-3">
                      {commentsMap[post.id]?.length > 0 && (
                        <>
                          <Separator />
                          {commentsMap[post.id].map((cmt, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 pb-2 border-b border-zinc-800"
                            >
                              <img
                                src={cmt.profileLink || "/placeholder.png"}
                                alt={cmt.name}
                                className="w-8 h-8 rounded-full border border-zinc-700 object-cover"
                              />
                              <div>
                                <span className="font-medium text-white">
                                  {cmt.name}
                                </span>
                                <p className="text-sm text-zinc-300">
                                  {cmt.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        </>
                      )}

                      {user && (
                        <div className="mt-2 flex items-center gap-2">
                          <Textarea
                            value={comment}
                            placeholder="Write your comment..."
                            onChange={(e) => setComment(e.target.value)}
                            className="flex-1 bg-zinc-800 border-zinc-700 text-white"
                          />
                          <Button
                            variant="secondary"
                            onClick={() => handleComment(post.id)}
                            className="whitespace-nowrap"
                          >
                            Post Comment
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
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
              Please{" "}
              <a href="/login" className="text-blue-500 underline">
                sign in
              </a>{" "}
              to like or dislike posts.
            </p>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
