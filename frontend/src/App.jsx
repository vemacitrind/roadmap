import Home from "./pages/Home";
import Login from "./pages/Login";
import { BrowserRouter as Router , Routes , Route, Link } from "react-router-dom";
import Explore from "./pages/Explore"
import PageNotFound from "./pages/PageNotFound";
import RoleBasedCategoryPage from "./pages/RoleBasedCategoryPage";
import SkillBasedCategoryPage from "./pages/SkillBasedCategoryPage";
import "@/lib/console"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/explore" element={<Explore />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/explore/role/:category" element={<RoleBasedCategoryPage />} />
        <Route path="/explore/skill/:category" element={<SkillBasedCategoryPage />} />
      </Routes>
    </>
  );
}

export default App;
