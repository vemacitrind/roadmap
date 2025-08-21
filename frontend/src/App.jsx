import Home from "./pages/Home";
import Login from "./pages/Login";
import Explore from "./pages/Explore"
import PageNotFound from "./pages/PageNotFound";
import { isAdmin } from "./auth/isAdmin";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "@/auth/AuthContext";
import "@/lib/console"
import './App.css'
import AdminDashBoard from "./pages/AdminDashBoard";
import UsersPage from "@/components/Admin/UsersPage";
import DashboardPagea from "@/components/Admin/DashboardPage";
import RoadmapsPage from "@/components/Admin/RoadmapsPage";
import AnalyticsPage from "@/components/Admin/AnalyticsPage";
import Community from "@/pages/Community"
import { Toaster } from "sonner";
import ProjectDetails from "@/pages/Project/ProjectDetails"
import Projects from "@/pages/Project/Projects"
import ProjectsPage from "@/components/Admin/ProjectsPage";
import CommunityPage from "@/components/Admin/CommunityPage";
import RoadmapPage from "@/pages/Roadmap"
import PublicDashboard from "./pages/PublicPage";

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      <Toaster richColors closeButton position="top-center" theme="dark" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/community" element={<Community />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/:type/:slug" element={<RoadmapPage />} />
        <Route path="/project/:projectId" element={<ProjectDetails />} />
        <Route path="/:uid" element={<PublicDashboard/>}/>
        <Route
          path="/admin"
          element={user && isAdmin(user) ? <AdminDashBoard /> : <Navigate to="/" />}
        >
          <Route index element={<DashboardPagea />} />
          <Route path="roadmaps" element={<RoadmapsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="community" element={<CommunityPage />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
