import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import NullImg from "@/assets/Null.png";
import { allProjects } from "@/lib/project";
import { fetchUserProfile } from "@/lib/community_page";
import { Label } from "@radix-ui/react-dropdown-menu";
import BasicTemplate16 from "@/components/BaseTemplates/BasicTemplate16";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ProjectLayout from "@/components/Projects/ProjectLayout";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [selectedTech, setSelectedTech] = useState([]);
    const [search, setSearch] = useState("");
    const techOptions = ["React", "Next.js", "Node.js", "Python", "Firebase"];

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
        });
    }, []);

    const allTechnologies = Array.from(
        new Set(
            projects.flatMap((p) => Array.isArray(p.technologies) ? p.technologies : [])
        )
    );

    useEffect(() => {
        if (selectedTech.length === 0) {
            setFiltered(projects);
        } else {
            setFiltered(
                projects.filter((p) =>
                    p.technologies?.some((tech) => selectedTech.includes(tech))
                )
            );
        }
    }, [selectedTech, projects]);

    const x = (
        <>
            <div className="p-6 space-y-6 max-w-4xl mx-auto ">
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
                        <DropdownMenuContent className="bg-zinc-900 border border-zinc-700">
                            {techOptions.map((tech) => (
                                <DropdownMenuCheckboxItem
                                    key={tech}
                                    checked={selectedTech.includes(tech)}
                                    onCheckedChange={(checked) => {
                                        setSelectedTech((prev) =>
                                            checked ? [...prev, tech] : prev.filter((t) => t !== tech)
                                        );
                                    }}
                                >
                                    {tech}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Projects Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
                    {filtered.length > 0 ? (
                        filtered.map((project) => (
                            <ProjectLayout key={project.id} project={project}/>
                        ))
                    ) : (
                        <img
                            src={NullImg}
                            alt="No projects found"
                            className="mx-auto max-w-xs opacity-70"
                        />
                    )}
                </div>
            </div>
        </>
    );

    return (
        <BasicTemplate16 children={x} />
    )
}