import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { useAuth as ua } from "@/auth/useAuth"
import { useNavigate ,Link } from "react-router-dom";

export default function AppBar() {
  const { user } = useAuth();
  const {logout} = ua();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <header className="w-full bg-zinc-900 border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
      <Link to="/">
      <div className="text-white font-bold text-2xl tracking-wide" style={{ fontFamily: 'Noto Serif JP' }}>roadmap.in</div>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="rounded-full p-0">
            <Avatar className="w-9 h-9">
              <AvatarImage
                src={user?.photoURL || "/default-user.png"}
                alt="User"
              />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-700 text-white">
          <DropdownMenuItem onClick={() => navigate(`/${user.uid}`)}>
            <LayoutDashboard className="mr-2 w-4 h-4" />
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 w-4 h-4 text-red-400" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
