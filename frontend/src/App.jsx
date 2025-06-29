import RoadmapTree from "@/components/RoadmapTree";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { BrowserRouter as Router , Routes , Route, Link } from "react-router-dom";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </>
  );
}

export default App;
