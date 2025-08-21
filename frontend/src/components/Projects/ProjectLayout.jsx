import { Link } from "react-router-dom";

export default function ProjectLayout({ project }) {
  return (
    <Link key={project.id} to={`/project/${project.id}`}>
  <div className="rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition shadow-sm hover:shadow-md overflow-hidden h-full flex flex-col">
    
    {project.images && project.images.length > 0 ? (
      <div className="w-full aspect-video">
        <img
          src={project.images[0]}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>
    ) : (
      <div className="w-full aspect-video bg-zinc-800 flex items-center justify-center text-zinc-500">
        No Image
      </div>
    )}

    {/* Content */}
    <div className="p-4 flex flex-col justify-between flex-grow">
      {/* Title & Description */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2 text-start">
          {project.title}
        </h3>
        <p className="text-sm text-zinc-400 mb-2 text-start">
          {project.description}
        </p>
      </div>

      {/* Creator Info */}
      <div className="flex items-center gap-3 mt-5">
        <img
          src={project.userProfile?.profileLink || "/placeholder.png"}
          alt={project.userProfile?.name || "Unknown"}
          className="w-8 h-8 rounded-full object-cover"
          referrerPolicy="no-referrer"
        />
        <span className="text-sm text-zinc-300 font-medium">
          {project.userProfile?.name || "Unknown"}
        </span>
      </div>
    </div>
  </div>
</Link>

  );
}
