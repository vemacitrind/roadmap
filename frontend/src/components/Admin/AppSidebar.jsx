// src/components/Admin/AppSidebar.jsx
import { Home, Users, BarChart2, List, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import clsx from "clsx";

export default function AppSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/admin", icon: <Home className="w-4 h-4" /> },
    { name: "Roadmaps", path: "/admin/roadmaps", icon: <List className="w-4 h-4" /> },
    { name: "Users", path: "/admin/users", icon: <Users className="w-4 h-4" /> },
    { name: "Analytics", path: "/admin/analytics", icon: <BarChart2 className="w-4 h-4" /> },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <aside className="h-screen w-64 bg-zinc-900 border-r border-zinc-800 p-4 text-white flex flex-col">
      <div className="text-xl font-bold mb-8 px-2">Admin</div>

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
            {link.name}
          </Button>
        ))}
      </nav>

      <Button
        variant="ghost"
        onClick={handleLogout}
        className="w-full justify-start gap-2 text-left text-red-400"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
    </aside>
  );
}
