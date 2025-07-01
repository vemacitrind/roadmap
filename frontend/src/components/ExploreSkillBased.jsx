import { useEffect, useState } from "react";
import { fetchSkillBasedCollections } from "@/lib/fetchXBasedCollections";
import { Card, CardTitle } from "@/components/ui/card";
import { ExternalLink } from 'lucide-react';
import { Link } from "react-router-dom";

export default function ExploreSkillBased() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchSkillBasedCollections().then(setCategories);
    }, []);
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Skill-Based Roadmaps</h2>
            <p className="text-zinc-400">Show roadmaps like Frontend Developer, Backend Developer, DevOps Engineer...</p>
            {categories.map((cat) => (
                <Card className="w-full max-w-sm my-2 py-5">
                    <Link to={`/explore/skill/${cat}`}>
                        <CardTitle className="flex gap-3 place-content-center items-center hover:text-zinc-400">
                            {cat}
                            <ExternalLink />
                        </CardTitle>
                    </Link>
                </Card>
            ))}
        </div>
    )
}