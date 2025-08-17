import { useEffect, useState } from "react";
import NullImg from "@/assets/Null.png";
import { allProjects } from "@/lib/project";
import { fetchUserProfile } from "@/lib/community_page";
import BasicTemplate16 from "@/components/BaseTemplates/BasicTemplate16";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ProjectLayout from "@/components/Projects/ProjectLayout";
import Loader from "@/components/Loader";
import { Icon } from "@iconify/react";
import technologies from "@/lib/technologies.json";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [selectedTech, setSelectedTech] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        allProjects(async (data) => {
            const withProfiles = await Promise.all(
                data.map(async (project) => {
                    const userProfile = await fetchUserProfile(project.uid);
                    return { ...project, userProfile };
                })
            );
            setProjects(withProfiles);
            setFiltered(withProfiles);
            setLoading(false);
        });
    }, []);

    // Dynamically extract all unique techs from projects
    const allTechnologies = Array.from(
        new Set(
            projects.flatMap((p) => Array.isArray(p.technologies) ? p.technologies : [])
        )
    );

    // Apply filtering by selectedTech
    useEffect(() => {
        let result = projects;

        if (selectedTech.length > 0) {
            result = result.filter((p) =>
                p.technologies?.some((tech) => selectedTech.includes(tech))
            );
        }

        if (search.trim() !== "") {
            result = result.filter((p) =>
                p.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFiltered(result);
    }, [selectedTech, projects, search]);


    const x = (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            {/* Search + Filter */}
            <div className="flex items-center gap-3 mb-5">
                <input
                    type="text"
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border rounded px-3 py-2 w-full bg-zinc-900 border-zinc-700 text-white"
                />

                <DropdownMenu>
                    <DropdownMenuTrigger className="border border-zinc-700 px-3 py-2 rounded text-white">
                        Filter
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-zinc-900 border border-zinc-700 p-2">
                        {/* All option */}
                        <DropdownMenuCheckboxItem
                            key="all"
                            checked={selectedTech.length === 0} // if nothing selected, All is active
                            onCheckedChange={() => setSelectedTech([])} // reset
                            className="flex items-center gap-2 text-white"
                        >
                            All
                        </DropdownMenuCheckboxItem>

                        {/* Technologies */}
                        {allTechnologies.map((tech) => {
                            const techInfo = technologies.find((t) => t.name === tech);
                            return (
                                <DropdownMenuCheckboxItem
                                    key={tech}
                                    checked={selectedTech.includes(tech)}
                                    onCheckedChange={(checked) => {
                                        setSelectedTech((prev) =>
                                            checked ? [...prev, tech] : prev.filter((t) => t !== tech)
                                        );
                                    }}
                                    className="flex items-center gap-2 text-white"
                                >
                                    {techInfo ? <Icon icon={techInfo.icon} className="w-4 h-4" /> : null}
                                    {tech}
                                </DropdownMenuCheckboxItem>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Projects Grid */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader />
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.length > 0 ? (
                        filtered.map((project) => (
                            <ProjectLayout key={project.id} project={project} />
                        ))
                    ) : (
                        <img
                            src={NullImg}
                            alt="No projects found"
                            className="mx-auto max-w-xs opacity-70"
                        />
                    )}
                </div>
            )}
        </div>
    );

    return <BasicTemplate16>{x}</BasicTemplate16>;
}
