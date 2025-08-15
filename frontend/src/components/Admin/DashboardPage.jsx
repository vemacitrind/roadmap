import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart2,
  Users,
  List,
  TrendingUp,
  UsersRound,
  FolderKanban,
} from "lucide-react";
import { getAnalyticsData } from "@/lib/adminData";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalyticsData()
      .then(setStats)
      .finally(() => setLoading(false));
    console.log(stats)
  }, []);

  const Metric = ({ icon, label, value }) => (
    <Card className="bg-zinc-900 border-zinc-800 hover:shadow-lg hover:shadow-zinc-800/40 transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg text-zinc-200">
          {icon}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-3xl font-bold text-white">
        {loading ? <Skeleton className="h-8 w-20 rounded" /> : value}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Welcome to Admin Dashboard
        </h1>
        <p className="text-zinc-400 mt-1">
          Manage and monitor users, roadmaps, projects, and community activity.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <Input
          placeholder="Search anything…"
          className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
        />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-6">
        <Metric
          icon={<Users className="w-5 h-5 text-blue-400" />}
          label="Users"
          value={stats?.totalUsers ?? 0}
        />
        <Metric
          icon={<List className="w-5 h-5 text-purple-400" />}
          label="Roadmaps"
          value={stats?.totalRoadmaps ?? 24}
        />
        <Metric
          icon={<TrendingUp className="w-5 h-5 text-green-400" />}
          label="Daily Visits"
          value={stats?.dailyVisits ?? 0}
        />
        <Metric
          icon={<BarChart2 className="w-5 h-5 text-yellow-400" />}
          label="Engagement"
          value={`${stats?.engagement ?? 0}%`}
        />
        <Metric
          icon={<UsersRound className="w-5 h-5 text-pink-400" />}
          label="Community"
          value={stats?.totalCommunity ?? 0}
        />
        <Metric
          icon={<FolderKanban className="w-5 h-5 text-orange-400" />}
          label="Projects"
          value={stats?.totalProjects ?? 0}
        />
      </div>

      {/* Chart Placeholder */}
      <Card className="bg-zinc-900 border-zinc-800 h-64">
        <CardHeader>
          <CardTitle className="text-zinc-200">Site Analytics</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center text-zinc-500">
          {loading ? "Loading chart…" : "Graph or analytics will go here…"}
        </CardContent>
      </Card>
    </div>
  );
}
