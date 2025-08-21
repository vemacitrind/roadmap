import { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/auth/useAuth";
import { useAuth as Auth } from "@/auth/AuthContext";
import Profile from "@/assets/people-user.png";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, LayoutDashboard } from "lucide-react";
import { fetchUserProfile } from "@/lib/userProfile";

export default function BasicHeader() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef();
  const [profile, setProfile] = useState(null);
  const userr = Auth()

  useEffect(() => {
    fetchUserProfile(userr?.user?.uid).
      then((data) => {
        setProfile(data)
      }).
      catch(err => console.log(err))
  }, [])

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-[90%] flex items-center justify-between z-50">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-zinc-400 hover:text-white"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">Back</span>
      </button>

      <Link to="/" className="text-white font-bold text-2xl tracking-wide hover:opacity-90" style={{ fontFamily: 'Noto Serif JP' }}>
        roadmap.in
      </Link>

      <div className="relative" ref={menuRef}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-full p-0">
              <Avatar className="w-9 h-9">
                <AvatarImage
                  src={profile?.profileLink || user?.photoURL || Profile}
                  alt="User"
                />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-700 text-white">
            <DropdownMenuItem onClick={() => navigate(`/${user?.uid}`)}>
              <LayoutDashboard className="mr-2 w-4 h-4" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-red-400">
              <LogOut className="mr-2 w-4 h-4 text-red-400" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </header>
  );
}
