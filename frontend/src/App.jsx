import Home from "./pages/Home";
import Login from "./pages/Login";
import Explore from "./pages/Explore"
import PageNotFound from "./pages/PageNotFound";
import RoleBasedCategoryPage from "./pages/RoleBasedCategoryPage";
import SkillBasedCategoryPage from "./pages/SkillBasedCategoryPage";
import AdminPanel from "./pages/AdminPanel";
import { isAdmin } from "./auth/isAdmin";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import "@/lib/console"
import './App.css'
import DashboardPage from "./pages/DashboardPage";
import AdminDashBoard from "./pages/AdminDashBoard";
import UsersPage from "@/components/Admin/UsersPage";
import DashboardPagea from "@/components/Admin/DashboardPage";
import RoadmapsPage from "@/components/Admin/RoadmapsPage";
import AnalyticsPage from "@/components/Admin/AnalyticsPage";

function App() {
  const { user } = useAuth();
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/explore/role/:category" element={<RoleBasedCategoryPage />} />
        <Route path="/explore/skill/:category" element={<SkillBasedCategoryPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminDashBoard />}>
          <Route index element={<DashboardPagea />} />
          <Route path="roadmaps" element={<RoadmapsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
        <Route path="/aaa" element={user && isAdmin(user) ? <AdminPanel /> : <Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
