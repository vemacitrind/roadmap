import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Hourglass,ArrowUp,ArrowDown } from "lucide-react";

export default function PendingRoadmap({ roadmaps = {} }) {
  const [filter, setFilter] = useState("all");
  const [reverse, setReverse] = useState(true);

  const filtered = Object.entries(roadmaps || {})
    .filter(([_, data]) => {
      if (filter === "all") return true;
      if (filter === "complete") return data.isComplete;
      return !data.isComplete;
    })
    .sort(([, a], [, b]) => {
      const dateA = new Date(a.startedAt);
      const dateB = new Date(b.startedAt);
      return reverse ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="space-y-6">
      {/* Filter + Sort */}
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex gap-2">
          {["all", "incomplete", "complete"].map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setReverse((r) => !r)}
          className="text-zinc-400 hover:text-white"
        >
          {reverse ? <><ArrowUp className="w-4 h-4 text-zinc-300" /> Oldest First</> : <><ArrowDown className="w-4 h-4 text-zinc-300" /> Newest First</>}
        </Button>
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(([title, data]) => (
          <div
            key={title}
            className="rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition p-5 shadow-sm hover:shadow-md"
          >
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-zinc-400">
              Started: {new Date(data.startedAt).toLocaleDateString()}
            </p>
            <div className="flex items-center gap-2 mt-2 text-sm">
              {data.isComplete ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Hourglass className="w-4 h-4 text-yellow-400 animate-pulse" />
              )}
              <span>{data.isComplete ? "Completed" : "In Progress"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
