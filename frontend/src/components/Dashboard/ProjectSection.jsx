import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Plus,Info } from "lucide-react";
import NullImg from "@/assets/Null.png";
import ListProject from "./ListProject";
import { addProject } from '@/lib/project'
import { Link } from "react-router-dom";
import { getTotalSales } from "@/lib/project";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { handleWithdraw as impHandleWithdraw } from "@/lib/project"

export default function ProjectSection({ projects = [], userSales = [], onListProject, user }) {
    const [filter, setFilter] = useState("all");
    const [open, setOpen] = useState(false);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [amount, setAmount] = useState("");
    const [withdrawOpen, setWithdrawOpen] = useState(false);


    useEffect(() => {
        if (user) {
            getTotalSales(setTotalEarnings, user);
        }
    }, [user]);


    const handleWithdraw = () => {
        impHandleWithdraw(user.uid, totalEarnings, amount)
    };

    const filtered = projects.filter((project) => {
        if (filter === "all") return true;
        if (filter === "available") return project.is_available;
        if (filter === "sold") return !project.is_available;
    });

    return (<>
        <div className="space-y-6">
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

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 items-center">
                <div className="flex gap-2">
                    {["all", "available", "sold"].map((f) => (
                        <Button
                            key={f}
                            size="sm"
                            variant={filter === f ? "default" : "outline"}
                            onClick={() => setFilter(f)}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </Button>
                    ))}
                </div>
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
                className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-5 ${filtered.length > 0 ? "" : "place-items-center"
                    }`}
            >
                {filtered.length > 0 ? (
                    filtered.map((project) => (
                        <Link key={project.id} to={`/project/${project.id}`}>
                            <div
                                key={project.id}
                                className="rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition p-5 shadow-sm hover:shadow-md"
                            >
                                {project.images && project.images.length > 0 ? (
                                    <img
                                        src={project.images[0]}
                                        alt={project.title}
                                        className="w-full h-40 object-cover rounded-md mb-3"
                                    />
                                ) : (
                                    <div className="w-full h-40 bg-zinc-800 rounded-md mb-3 flex items-center justify-center text-zinc-500">
                                        No Image
                                    </div>
                                )}

                                <h3 className="text-lg font-semibold text-white mb-2 text-start">
                                    {project.title}
                                </h3>
                                <p className="text-sm text-zinc-400 mb-2 text-start">{project.description}</p>
                                <p className="mb-2 font-semibold text-start">Price : ₹{project.price}</p>

                                {project.link && (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 underline"
                                    >
                                        Demo Link
                                    </a>
                                )}

                                <div className="mt-3 text-sm text-zinc-400 text-start">
                                    Status:{" "}
                                    {project.is_available ? (
                                        <span className="text-green-400 font-semibold">Active</span>
                                    ) : (
                                        <span className="text-red-500 font-semibold">Sold</span>
                                    )}
                                </div>
                            </div>
                        </Link>

                    ))
                ) : (
                    <img src={NullImg} alt="No projects found" />
                )}
            </div>

        </div>

        <ListProject
            open={open}
            onOpenChange={setOpen}
            onSubmit={addProject}
            user={user}
        />
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
                    <Button
                        variant="secondary"
                        onClick={() => setWithdrawOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="default"
                        onClick={handleWithdraw}
                    >
                        Withdraw
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>

    );
}
