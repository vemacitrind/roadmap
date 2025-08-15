import { useEffect, useState } from "react";
import { getAllUsers } from "@/lib/adminData";
import UserDialog from "./UserDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowDownUp } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const location = useLocation();


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const s = params.get("s");
    if (s) setSearch(s);
  }, [location.search]);

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, []);

  const filteredUsers = users
    .filter(
      (user) =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aVal =
        sortBy === "createdAt"
          ? new Date(a.createdAt?.seconds * 1000 || 0)
          : a.name?.toLowerCase() || "";
      const bVal =
        sortBy === "createdAt"
          ? new Date(b.createdAt?.seconds * 1000 || 0)
          : b.name?.toLowerCase() || "";
      return order === "asc"
        ? aVal > bVal
          ? 1
          : -1
        : aVal < bVal
        ? 1
        : -1;
    });

  return (
    <div className="space-y-6">
      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <ArrowDownUp className="w-4 h-4" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
              <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="createdAt">
                Created At
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuRadioGroup value={order} onValueChange={setOrder}>
              <DropdownMenuRadioItem value="asc">
                Ascending
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="desc">
                Descending
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table Layout */}
      <div className="overflow-x-auto border border-zinc-800 rounded-lg">
        <table className="w-full text-left text-white border-collapse">
          <thead className="bg-zinc-900 border-b border-zinc-700">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => {
              const joinedDate = user.createdAt
                ? new Date(user.createdAt.seconds * 1000).toLocaleDateString()
                : "Unknown";

              return (
                <tr
                  key={index}
                  className="hover:bg-zinc-800 transition-colors"
                >
                  <td className="px-4 py-3 flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-zinc-700">
                      <AvatarImage src={user.profileLink} alt={user.name} />
                      <AvatarFallback>
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.name || "Unknown"}</span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                      {user.role || "User"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{joinedDate}</td>
                  <td className="px-4 py-3">
                    <UserDialog user={user} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
