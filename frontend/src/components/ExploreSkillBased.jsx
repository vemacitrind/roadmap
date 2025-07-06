import { useEffect, useState } from "react";
import { fetchSkillBasedCollections } from "@/lib/fetchXBasedCollections";
import { Card, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import * as Icons from "@/components/Icon"; 

export default function ExploreSkillBased() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchSkillBasedCollections().then(setCategories);
    }, []);

    // Helper to capitalize and load icon
    const getIconForCategory = (cat) => {
        const name = cat.charAt(0).toUpperCase() + cat.slice(1); // e.g., java → Java
        const IconComponent = Icons[`${name}Icon`];
        return IconComponent || null;
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Skill-Based Roadmaps</h2>
            <p className="text-zinc-400 mb-6">
                Master specific technologies with focused roadmaps.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => {
                    const Icon = getIconForCategory(cat);
                    const capitalized = cat.charAt(0).toUpperCase() + cat.slice(1);

                    return (
                        <Link to={`/explore/skill/${cat}`} key={cat}>
                            <Card className="py-6 px-4 hover:bg-zinc-900 transition">
                                <CardTitle className="flex flex-col items-center justify-center text-center gap-3">
                                    {Icon && (
                                        <div className="w-10 h-10 flex items-center justify-center">
                                            <Icon className="max-w-full max-h-full" />
                                        </div>
                                    )}

                                    <span className="text-lg font-medium">{capitalized}</span>
                                </CardTitle>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
