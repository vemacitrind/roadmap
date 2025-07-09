import { Outlet } from "react-router-dom";
import AppBar from "@/components/Admin/Appbar";
import AppSidebar from "@/components/Admin/AppSidebar";

export default function AdminDashBoard() {
    return (
        <div className="flex min-h-screen">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
                <AppBar />
                <main className="p-6 flex-1 overflow-y-auto">
                    <Outlet /> {/* ✅ This is what renders nested routes */}
                </main>
            </div>
        </div>
    );
}
