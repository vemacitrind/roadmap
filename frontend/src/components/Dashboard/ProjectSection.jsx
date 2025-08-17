import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Plus, Info } from "lucide-react";
import NullImg from "@/assets/Null.png";
import ListProject from "./ListProject";
import { addProject, getTotalSales, handleWithdraw as impHandleWithdraw } from '@/lib/project';
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ProjectLayout2 from "../Projects/ProjectLayout2";
import { Icon } from "@iconify/react";  
import techList from "@/lib/technologies.json";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

export default function ProjectSection({ projects = [], user }) {
  const [open, setOpen] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [amount, setAmount] = useState("");
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const [selectedTech, setSelectedTech] = useState([]);

  useEffect(() => {
    if (user) {
      getTotalSales(setTotalEarnings, user);
    }
  }, [user]);

  const handleWithdraw = () => {
    impHandleWithdraw(user.uid, totalEarnings, amount);
  };

  const allTechnologies = [
    ...new Set(projects.flatMap((p) => p.technologies || [])),
  ];

  // ✅ Filtering
  const filtered = projects.filter((project) => {
    if (selectedTech.length === 0) return true; // "All"
    return project.technologies?.some((t) => selectedTech.includes(t));
  });

  return (
    <>
      <div className="space-y-6">
        {/* Earnings */}
        <div className="flex justify-between items-center bg-green-500 rounded-lg p-4 h-28">
          <div className="flex items-center gap-2 text-lg font-semibold text-white">
            Total Earnings: ₹{totalEarnings.toLocaleString("en-IN")}
          </div>
          <Button
            onClick={() => setWithdrawOpen(true)}
            size="sm"
            variant="default"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-md px-3 py-1"
          >
            <Wallet className="w-4 h-4" />
            Withdraw
          </Button>
        </div>

        {/* ✅ Technology Filter Dropdown */}
        <div className="flex flex-wrap gap-2 items-center w-full">
          <DropdownMenu>
            <DropdownMenuTrigger className="border border-zinc-700 px-3 py-2 rounded text-white">
              Filter
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-900 border border-zinc-700 p-2">
              {/* All option */}
              <DropdownMenuCheckboxItem
                key="all"
                checked={selectedTech.length === 0}
                onCheckedChange={() => setSelectedTech([])}
                className="flex items-center gap-2 text-white"
              >
                <Icon icon="mdi:apps" className="w-4 h-4" />
                All
              </DropdownMenuCheckboxItem>

              {/* Technologies */}
              {allTechnologies.map((tech) => {
                const techInfo = techList.find((t) => t.name === tech);
                return (
                  <DropdownMenuCheckboxItem
                    key={tech}
                    checked={selectedTech.includes(tech)}
                    onCheckedChange={(checked) => {
                      setSelectedTech((prev) =>
                        checked ? [...prev, tech] : prev.filter((t) => t !== tech)
                      );
                    }}
                    className="flex items-center gap-2 text-white"
                  >
                    {techInfo ? <Icon icon={techInfo.icon} className="w-4 h-4" /> : null}
                    {tech}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add Project */}
          <Button
            onClick={() => setOpen(true)}
            size="sm"
            variant="default"
            className="flex items-center gap-1 ml-auto"
          >
            <Plus className="w-4 h-4" />
            List a Project
          </Button>
        </div>

        {/* Projects Grid */}
        <div
          className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-5 ${
            filtered.length > 0 ? "" : "place-items-center"
          }`}
        >
          {filtered.length > 0 ? (
            filtered.map((project) => (
              // <Link key={project.id} to={`/project/${project.id}`}>
                <ProjectLayout2 project={project} />
              // </Link>
            ))
          ) : (
            <img src={NullImg} alt="No projects found" />
          )}
        </div>
      </div>

      {/* List Project Dialog */}
      <ListProject
        open={open}
        onOpenChange={setOpen}
        onSubmit={addProject}
        user={user}
      />

      {/* Withdraw Dialog */}
      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent className="bg-zinc-950 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Withdraw Funds</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <label className="block text-sm flex items-center gap-1">
              Amount
              <Info className="w-4 h-4 text-gray-400" title="30% platform charges" />
              <span className="text-xs text-gray-400 ml-1">30% platform charges</span>
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-white text-black"
              placeholder="Enter amount"
            />
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setWithdrawOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleWithdraw}>
              Withdraw
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
