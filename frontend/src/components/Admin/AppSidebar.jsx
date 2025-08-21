// src/components/Admin/AppSidebar.jsx
import { Home, Users, BarChart2, List, LogOut, UsersRound, ChevronLeft, ChevronRight,Newspaper,HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth  } from "@/auth/useAuth"
import clsx from "clsx";
import { useState } from "react";

export default function AppSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    { name: "Dashboard", path: "/admin", icon: <Home className="w-4 h-4" /> },
    { name: "Roadmaps", path: "/admin/roadmaps", icon: <List className="w-4 h-4" /> },
    { name: "Users", path: "/admin/users", icon: <Users className="w-4 h-4" /> },
    { name: "Projects", path: "/admin/projects", icon: <HardDrive className="w-4 h-4" /> },
    { name: "Community", path: "/admin/community", icon: <Newspaper className="w-4 h-4" /> },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <aside
      className={clsx(
        "h-screen bg-zinc-900 border-r border-zinc-800 p-4 text-white flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        {!collapsed && <div className="text-lg font-semibold">Admin Panel</div>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-zinc-400 hover:text-white"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {links.map((link) => (
          <Button
            key={link.path}
            variant="ghost"
            onClick={() => navigate(link.path)}
            className={clsx(
              "w-full justify-start gap-2 text-left",
              location.pathname === link.path && "bg-zinc-800"
            )}
          >
            {link.icon}
            {!collapsed && link.name}
          </Button>
        ))}
      </nav>

      {/* Logout */}
      <Button
        variant="ghost"
        onClick={handleLogout}
        className="w-full justify-start gap-2 text-left text-red-400"
      >
        <LogOut className="w-4 h-4" />
        {!collapsed && "Logout"}
      </Button>
    </aside>
  );
}
