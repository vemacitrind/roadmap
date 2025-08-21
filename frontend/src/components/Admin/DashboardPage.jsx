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

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalyticsData()
      .then(setStats)
      .finally(() => setLoading(false));
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

  const userActivityData = stats ? stats.userActivity24h || [] : [];

  const projectsThisMonthData = stats ? stats.projectsThisMonth || [] : [];

  const emptyBarData = [{ name: "None", value: 0 }];

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

      {/* Three small charts in one row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="bg-zinc-900 border-zinc-800 p-4">
          <CardHeader>
            <CardTitle className="text-zinc-200">
              Most Popular Roadmaps (Last Month)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              "Loading chart…"
            ) : (
              <ResponsiveContainer width="100%" height={150}>
                <BarChart
                  data={stats?.popularRoadmapsLastMonth?.length ? stats.popularRoadmapsLastMonth : emptyBarData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1f2937", borderRadius: 6 }}
                    itemStyle={{ color: "white" }}
                  />
                  <Bar dataKey="value" fill="#60a5fa" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>


        <Card className="bg-zinc-900 border-zinc-800 p-4">
          <CardHeader>
            <CardTitle className="text-zinc-200">
              User Activity (Last 24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              "Loading chart…"
            ) : (
              <ResponsiveContainer width="100%" height={150}>
                <LineChart
                  data={userActivityData.length ? userActivityData : emptyBarData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1f2937", borderRadius: 6 }}
                    itemStyle={{ color: "white" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4ade80"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 p-4">
          <CardHeader>
            <CardTitle className="text-zinc-200">
              Projects This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              "Loading chart…"
            ) : (
              <ResponsiveContainer width="100%" height={150}>
                <BarChart
                  data={projectsThisMonthData.length ? projectsThisMonthData : emptyBarData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1f2937", borderRadius: 6 }}
                    itemStyle={{ color: "white" }}
                  />
                  <Bar dataKey="value" fill="#fb923c" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
