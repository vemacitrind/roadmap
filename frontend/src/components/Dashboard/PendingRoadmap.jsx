import { useEffect, useState } from "react";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Icon } from "@iconify/react";
import NullImg from "@/assets/Null.png";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function PendingRoadmap({ roadmapDetails = {} }) {
  const [filter, setFilter] = useState("all");
  const [sortAsc, setSortAsc] = useState(true);
  const filteredRoadmaps = roadmapDetails
    .filter((roadmap) => {
      if (filter === "all") return true;
      if (filter === "complete") return roadmap.status === "Completed";
      if (filter === "incomplete") return roadmap.status === "Incomplete";
      return true;
    })
    .sort((a, b) => {
      const timeA = new Date(a.timestamp);
      const timeB = new Date(b.timestamp);
      return sortAsc ? timeA - timeB : timeB - timeA;
    });

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap justify-between w-full">
        <div className="flex gap-2 flex-wrap">
          {["all", "complete", "incomplete"].map((f) => (
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
          variant="default"
          onClick={() => setSortAsc(!sortAsc)}
          className="flex items-center space-x-2"
        >
          {sortAsc ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          <span>{sortAsc ? "Time Asc" : "Time Desc"}</span>
        </Button>
      </div>


      {/* Roadmap Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredRoadmaps.length > 0 ? (
          filteredRoadmaps.map((roadmap) => (
            <div
              key={roadmap.id}
              className="flex items-center p-4 border rounded-lg shadow-sm bg-white dark:bg-zinc-900 gap-4"
            >
              {/* Left: Progress Circle with Icon Centered */}
              <div className="relative w-20 h-20 flex-shrink-0">
                <CircularProgressbar
                  value={roadmap.progress}
                  styles={buildStyles({
                    pathColor:
                      roadmap.status === "Completed" ? "#22c55e" : "#3b82f6",
                    trailColor: "#d1d5db",
                  })}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  {roadmap.icon ? (
                    <Icon icon={roadmap.icon} className="w-8 h-8" />
                  ) : (
                    <img
                      src={NullImg}
                      alt="No Icon"
                      className="w-8 h-8 object-contain"
                    />
                  )}
                </div>
              </div>

              {/* Right: Title + Status */}
              <div>
                <h3 className="text-lg font-semibold">{roadmap.title}</h3>
                <p
                  className={`mt-1 text-sm text-start ${roadmap.status === "Completed"
                    ? "text-green-500"
                    : "text-yellow-500"
                    }`}
                >
                  {roadmap.status}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex justify-center">
            <img src={NullImg} alt="No Roadmaps" className="w-48" />
          </div>
        )}
      </div>
    </div>
  );
}
