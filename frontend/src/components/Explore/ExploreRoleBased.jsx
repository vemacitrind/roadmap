import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { fetchRoleBasedRoadmaps } from "@/lib/roadmap"

export default function ExploreSkillBased() {
    const [roadmaps, setRoadmaps] = useState([]);

    useEffect(() => {
        fetchRoleBasedRoadmaps().then(setRoadmaps);
    }, []);

    const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Skill-Based Roadmaps</h2>
            <p className="text-zinc-400 mb-6">
                Master specific technologies with focused roadmaps.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roadmaps.map((roadmap) => (
                    <Link
                        key={roadmap.id}
                        to={`/role-based/${slugify(roadmap.title)}`}
                        className="block"
                    >
                        <Card className="py-6 px-4 group hover:bg-zinc-900 transition">
                            <CardHeader className="flex flex-col items-center justify-center gap-3">
                                {roadmap.icon && (
                                    <Icon
                                        icon={roadmap.icon}
                                        className="w-10 h-10 transition duration-300 filter brightness-0 invert group-hover:filter-none"
                                        
                                    />
                                )}
                                <CardTitle className="text-lg font-medium text-center text-zinc-200">
                                    {roadmap.title}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
