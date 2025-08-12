import { Link } from "react-router-dom";
import SpotlightCard from "./SpotlightCard";

const RoleCard = ({ title, subtitle, icon, path, borderColor = "#71717a", gradient = "linear-gradient(145deg, #18181b, #3f3f46)" }) => {
  return (
    <Link to={path} className="block">
      <SpotlightCard
        spotlightColor="rgba(255, 255, 255, 0.25)"
        className="border px-6 py-5 text-white"
      >
        <div className="flex items-center gap-4 mb-3">
          <div className="text-white">{icon}</div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p className="text-sm text-zinc-400">{subtitle}</p>
      </SpotlightCard>
    </Link>
  );
};

export default RoleCard;
