import { Link } from "react-router-dom";

export default function ProjectLayout({ project }) {
    return (
        <Link key={project.id} to={`/project/${project.id}`}>
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition p-5 shadow-sm hover:shadow-md">
                {/* Image */}
                {project.images && project.images.length > 0 ? (
                    <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-40 object-cover rounded-md mb-3"
                    />
                ) : (
                    <div className="w-full h-40 bg-zinc-800 rounded-md mb-3 flex items-center justify-center text-zinc-500">
                        No Image
                    </div>
                )}

                {/* Title & Description */}
                <h3 className="text-lg font-semibold text-white mb-2 text-start">{project.title}</h3>
                <p className="text-sm text-zinc-400 mb-2 text-start">{project.description}</p>

                {/* Creator Info */}
                <div className="flex items-center gap-3 mt-7">
                    <img
                        src={project.userProfile?.profileLink || "/placeholder.png"}
                        alt={project.userProfile?.name || "Unknown"}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm text-zinc-300 font-medium">
                        {project.userProfile?.name || "Unknown"}
                    </span>
                </div>
            </div>
        </Link>
    )
}