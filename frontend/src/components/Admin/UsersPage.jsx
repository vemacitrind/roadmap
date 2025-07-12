import { useEffect, useState } from "react";
import { getAllUsers } from "@/lib/userData";
import UserDialog from "./UserDialog";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { ArrowDownUp } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, []);

  const filteredUsers = users
    .filter((user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = sortBy === "createdAt"
        ? new Date(a.createdAt?.seconds * 1000 || 0)
        : a.name?.toLowerCase() || "";
      const bVal = sortBy === "createdAt"
        ? new Date(b.createdAt?.seconds * 1000 || 0)
        : b.name?.toLowerCase() || "";
      return order === "asc" ? aVal > bVal ? 1 : -1 : aVal < bVal ? 1 : -1;
    });

  return (
    <div className="space-y-6">
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
              <DropdownMenuRadioItem value="createdAt">Created At</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuRadioGroup value={order} onValueChange={setOrder}>
              <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredUsers.map((user, index) => (
          <Card key={index} className="bg-zinc-900 border border-zinc-800 text-white">
            <CardHeader className="flex items-center gap-4">
              <img
                src={user.profileLink}
                alt={user.name}
                // referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full border"
              />
              {console.log(user.profileLink)}
              <div>
                <p className="font-semibold">{user.name || "Unknown"}</p>
                <p className="text-sm text-zinc-400">{user.email}</p>
              </div>
            </CardHeader>
            <CardContent className="flex justify-end">
              <UserDialog user={user} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
