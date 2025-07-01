import Home from "./pages/Home";
import Login from "./pages/Login";
import Explore from "./pages/Explore"
import PageNotFound from "./pages/PageNotFound";
import RoleBasedCategoryPage from "./pages/RoleBasedCategoryPage";
import SkillBasedCategoryPage from "./pages/SkillBasedCategoryPage";
import AdminPanel from "./pages/AdminPanel";
import { isAdmin } from "./auth/isAdmin";
import { Routes , Route, Link ,Navigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import "@/lib/console"

function App() {
  const { user } = useAuth();
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/explore" element={<Explore />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/explore/role/:category" element={<RoleBasedCategoryPage />} />
        <Route path="/explore/skill/:category" element={<SkillBasedCategoryPage />} />
        <Route path="/admin" element={user && isAdmin(user) ? <AdminPanel /> : <Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
