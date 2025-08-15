import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCommunityPosts, getAllUsers } from "@/lib/adminData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { ArrowDownUp, Zap, ClipboardList, ConstructionIcon } from "lucide-react";
import { startScraper, stopScraper, trainModel, fetchLogs, pollLogs } from "@/lib/community_page";
import { toast } from "sonner";
import Loader from "@/components/Loader";

export default function CommunityPage() {
    const [posts, setPosts] = useState([]);
    const [usersMap, setUsersMap] = useState({});
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("timestamp");
    const [order, setOrder] = useState("desc");
    const [isScraping, setIsScraping] = useState(false);
    const [logs, setLogs] = useState([]);
    const navigate = useNavigate();
    const logIntervalRef = useRef(null);
    const [isLogsOpen, setIsLogsOpen] = useState(false);
    const [loadingPosts, setLoadingPosts] = useState(false);

    const handleScrapToggle = async () => {
        try {
            if (isScraping) {
                const res = await stopScraper();
                toast.success(res.message || "Scraper stopped!");

                if (logIntervalRef.current) {
                    clearInterval(logIntervalRef.current);
                    logIntervalRef.current = null;
                }
            } else {
                const res = await startScraper();
                toast.success(res.message || "Scraper started!");
                logIntervalRef.current = setInterval(async () => {
                    const newLogs = await fetchLogs();
                    setLogs(prev => [...prev, ...newLogs.slice(prev.length)]);
                    console.log(logs)
                }, 3000);
            }
            setIsScraping(!isScraping);
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        }
    };

    useEffect(() => {
        return () => {
            if (logIntervalRef.current) clearInterval(logIntervalRef.current);
        };
    }, []);

    // Fetch posts and users
    useEffect(() => {
    async function fetchData() {
        setLoadingPosts(true);
        try {
            const [postsData, users] = await Promise.all([getAllCommunityPosts(), getAllUsers()]);
            setPosts(postsData);

            const map = {};
            users.forEach(u => {
                map[u.id] = u.name;
            });
            setUsersMap(map);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingPosts(false);
        }
    }
    fetchData();
}, []);


    const filteredPosts = posts
        .filter(p =>
            p.title?.toLowerCase().includes(search.toLowerCase()) ||
            p.category?.toLowerCase().includes(search.toLowerCase()) ||
            p.source?.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            const aVal = sortBy === "timestamp" ? new Date(a.timestamp?.seconds * 1000 || 0) : a.title?.toLowerCase() || "";
            const bVal = sortBy === "timestamp" ? new Date(b.timestamp?.seconds * 1000 || 0) : b.title?.toLowerCase() || "";
            return order === "asc" ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
        });

    return (
        <div className="space-y-6">
            {/* Search & Sort */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Input
                    placeholder="Search by title, category, source or author..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="max-w-md"
                />

                <div className="flex gap-2 flex-wrap items-center">
                    {/* Start/Stop Scrap */}
                    <Button
                        variant={isScraping ? "secondary" : "destructive"}
                        className="flex items-center gap-2"
                        onClick={handleScrapToggle}
                    >
                        <Zap className="w-4 h-4" />
                        {isScraping ? "Stop Scrap" : "Start Scrap"}
                    </Button>

                    {/* Logs Dialog */}
                    <Dialog open={isLogsOpen} onOpenChange={setIsLogsOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="p-2">
                                <ClipboardList className="w-5 h-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Scrap Logs</DialogTitle>
                            </DialogHeader>
                            <div className="mt-2 max-h-96 overflow-y-auto space-y-1">
                                {logs.length ? (
                                    logs.map((log, idx) => (
                                        <p
                                            key={idx}
                                            className="text-sm text-zinc-400 truncate font-jetMono"
                                            style={{ fontFamily: 'JetBrains Mono, monospace' }}
                                            title={log}
                                        >
                                            {log}
                                        </p>
                                    ))
                                ) : (
                                    <p className="text-sm text-zinc-500 font-jetMono" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                                        Start scraper to see logs...
                                    </p>
                                )}
                            </div>

                        </DialogContent>
                    </Dialog>

                    {/* Sort */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <ArrowDownUp className="w-4 h-4" />
                                Sort
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                                <DropdownMenuRadioItem value="timestamp">Date</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="title">Title</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="category">Category</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                            <DropdownMenuRadioGroup value={order} onValueChange={setOrder}>
                                <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            {/* Table Layout */}
            <div className="overflow-x-auto border border-zinc-800 rounded-lg max-w-full max-h-[80vh] overflow-y-auto">
    {loadingPosts ? (
            <Loader /> 
    ) : (
        <table className="w-full text-left text-white border-collapse min-w-[800px]">
                    <thead className="bg-zinc-900 border-b border-zinc-700">
                        <tr>
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Source</th>
                            <th className="px-4 py-3">By</th>
                            <th className="px-4 py-3">Likes</th>
                            <th className="px-4 py-3">Dislikes</th>
                            <th className="px-4 py-3">Timestamp</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPosts.map((p, i) => {
                            const postDate = p.timestamp
                                ? new Date(p.timestamp.seconds * 1000).toLocaleString()
                                : "Unknown";

                            return (
                                <tr key={i} className="hover:bg-zinc-800 transition-colors">
                                    <td className="px-4 py-3">{p.title}</td>
                                    <td className="px-4 py-3">{p.category}</td>
                                    <td className="px-4 py-3">{p.source}</td>
                                    <td
                                        className="px-4 py-3 cursor-pointer hover:underline"
                                        onClick={() => navigate(`/admin/users?s=${encodeURIComponent(usersMap[p.uid] || "")}`)}
                                    >
                                        {usersMap[p.uid] || "Unknown"}
                                    </td>
                                    <td className="px-4 py-3">{p.likes || 0}</td>
                                    <td className="px-4 py-3">{p.dislikes || 0}</td>
                                    <td className="px-4 py-3 text-zinc-400">{postDate}</td>
                                    <td className="px-4 py-3">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="outline">Edit</Button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-zinc-900 text-white">
                                                <DialogHeader>
                                                    <DialogTitle>Edit Post</DialogTitle>
                                                </DialogHeader>
                                                {/* Empty for now */}
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="default">Close</Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                )}
            </div>
        </div>
    );
}
