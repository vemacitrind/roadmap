import { useEffect, useState } from "react";
import { getAllProjects, getAllUsers } from "@/lib/adminData";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownUp, LayoutGrid, LayoutList, Plus, Pencil } from "lucide-react";
import { Icon } from "@iconify/react";
import technologiesData from "@/lib/technologies.json";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [usersMap, setUsersMap] = useState({});
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("title");
    const [order, setOrder] = useState("asc");
    const [techFilter, setTechFilter] = useState("");
    const navigate = useNavigate();
    const [viewType, setViewType] = useState("table");

    useEffect(() => {
        async function fetchData() {
            const [projectsData, usersData] = await Promise.all([
                getAllProjects(),
                getAllUsers()
            ]);
            setProjects(projectsData);
            const map = {};
            usersData.forEach(u => { map[u.id] = u.name; });
            setUsersMap(map);
        }

        fetchData();
    }, []);

    const filteredProjects = projects
        .filter(p =>
            p.title?.toLowerCase().includes(search.toLowerCase()) ||
            p.description?.toLowerCase().includes(search.toLowerCase())
        )
        .filter(p => techFilter ? p.technologies?.includes(techFilter) : true)
        .sort((a, b) => {
            let aVal = sortBy === "createdAt" ? new Date(a.createdAt?.seconds * 1000) : a[sortBy];
            let bVal = sortBy === "createdAt" ? new Date(b.createdAt?.seconds * 1000) : b[sortBy];
            if (typeof aVal === "string") aVal = aVal.toLowerCase();
            if (typeof bVal === "string") bVal = bVal.toLowerCase();
            return order === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
        });

    const allTechs = Array.from(new Set(projects.flatMap(p => p.technologies || [])));

    return (
        <div className="space-y-6">
            {/* Search, Add, Sort */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Input
                    placeholder="Search projects..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="max-w-md"
                />
                <div className="flex gap-2 flex-wrap">
                    
                    <Button variant="default" className="flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Project
                    </Button>

                    {/* Sort */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                <ArrowDownUp className="w-4 h-4" /> Sort
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                                <DropdownMenuRadioItem value="title">Title</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="createdAt">Created At</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="price">Price</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                            <DropdownMenuRadioGroup value={order} onValueChange={setOrder}>
                                <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Technology Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                Technology
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuRadioGroup value={techFilter} onValueChange={setTechFilter}>
                                <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
                                {allTechs.map(tech => {
                                    const techObj = technologiesData.find(t => t.name === tech);
                                    return (
                                        <DropdownMenuRadioItem key={tech} value={tech} className="flex items-center gap-2">
                                            {techObj && <Icon icon={techObj.icon} className="w-4 h-4" />}
                                            {tech}
                                        </DropdownMenuRadioItem>
                                    );
                                })}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        variant="outline"
                        onClick={() => setViewType(viewType === "table" ? "card" : "table")}
                    >
                        {viewType === "table" ? <LayoutGrid /> : <LayoutList />}
                    </Button>
                </div>
            </div>

            {/* Table View */}
            {viewType === "table" ? (
                <div className="overflow-x-auto border border-zinc-800 rounded-lg">
                    <table className="w-full text-left text-white border-collapse">
                        <thead className="bg-zinc-900 border-b border-zinc-700">
                            <tr>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Creator</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Technologies</th>
                                <th className="px-4 py-3">Created At</th>
                                <th className="px-4 py-3">Live Link</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProjects.map((p, i) => {
                                const createdDate = p.createdAt ? new Date(p.createdAt.seconds * 1000).toLocaleDateString() : "Unknown";
                                return (
                                    <tr key={i} className="hover:bg-zinc-800 transition-colors">
                                        <td className="px-4 py-3 font-semibold">{p.title}</td>
                                        <td className="px-4 py-3 cursor-pointer hover:underline"
                                            onClick={() => navigate(`/admin/users?s=${encodeURIComponent(usersMap[p.uid] || "")}`)}
                                        >
                                            {usersMap[p.uid] || "Unknown"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant={p.status === "completed" ? "success" : "destructive"}>{p.status}</Badge>
                                        </td>
                                        <td className="px-4 py-3">{p.price || 0}</td>
                                        <td className="px-4 py-3 flex flex-wrap gap-1">
                                            {p.technologies.map((tech, idx) => (
                                                <Badge key={idx} variant={"secondary"}>{tech}</Badge>
                                            ))}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-400">{createdDate}</td>

                                        <td className="px-4 py-3">
                                            {p.link ? (
                                                <a href={p.link} target="_blank" rel="noreferrer">
                                                    <Badge variant="outline" className="cursor-pointer">Live</Badge>
                                                </a>
                                            ) : (
                                                <Badge variant="secondary">N/A</Badge>
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button size="sm" variant="default"><Pencil />Edit</Button>
                                                </DialogTrigger>
                                                <DialogContent className="bg-zinc-900 text-white">
                                                    <DialogHeader>
                                                        <DialogTitle>Edit Project</DialogTitle>
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
                </div>
            ) : (
                // Card View
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredProjects.map((p, i) => {
                        const createdDate = p.createdAt ? new Date(p.createdAt.seconds * 1000).toLocaleDateString() : "Unknown";
                        return (
                            <Card key={i} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:shadow-lg transition-all duration-200">
                                {p.images?.[0] && (
                                    <img src={p.images[0]} alt={p.title} className="w-full h-40 object-cover rounded-t-lg" />
                                )}
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">{p.title}</CardTitle>
                                    <div className="text-sm text-zinc-400">{createdDate} | {usersMap[p.uid] || "Unknown"}</div>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p className="text-zinc-300">{p.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {p.technologies.map((tech, idx) => {
                                            const techObj = technologiesData.find(t => t.name === tech);
                                            return (
                                                <div key={idx} className="flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded-lg text-sm hover:bg-zinc-700 transition-all">
                                                    {techObj && <Icon icon={techObj.icon} className="w-4 h-4" />}
                                                    {tech}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <Badge variant={p.status === "completed" ? "secondary" : "destructive"}>{p.status}</Badge>
                                    <div>Price: {p.price || 0}</div>
                                    <div className="flex gap-2 flex-wrap">
                                        {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="text-blue-400 underline">Live</a>}
                                        {p.driveLinks?.map((l, idx) => <a key={idx} href={l} target="_blank" rel="noreferrer" className="text-green-400 underline">Repo</a>)}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
