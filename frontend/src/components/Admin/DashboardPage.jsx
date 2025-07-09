import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart2, Users, List, TrendingUp } from "lucide-react";
import { getAnalyticsData } from "@/lib/adminData"; // ← analytics helper

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalyticsData()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  const Metric = ({ icon, label, value, color }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-bold">
        {loading ? <Skeleton className="h-7 w-16" /> : value}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome to Admin Dashboard</h1>

      {/* Search Bar */}
      <div className="max-w-md">
        <Input placeholder="Search anything…" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Metric
          icon={<Users className="w-5 h-5 text-zinc-200" />}
          label="Users"
          value={stats?.totalUsers}
        />
        <Metric
          icon={<List className="w-5 h-5 text-zinc-200" />}
          label="Roadmaps"
          value={stats?.totalRoadmaps ?? 24}
        />
        <Metric
          icon={<TrendingUp className="w-5 h-5 text-zinc-200" />}
          label="Daily Visits"
          value={stats?.dailyVisits ?? 0}
        />
        <Metric
          icon={<BarChart2 className="w-5 h-5 text-zinc-200" />}
          label="Engagement"
          value={`${stats?.engagement ?? 0}%`}
        />
      </div>

      {/* Chart Placeholder */}
      <div className="h-64 rounded-xl border border-zinc-800 bg-zinc-900 grid place-items-center text-zinc-500">
        {loading ? "Loading chart…" : "Graph or analytics will go here…"}
      </div>
    </div>
  );
}
