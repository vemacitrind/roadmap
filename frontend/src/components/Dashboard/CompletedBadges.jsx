import HexBadge from "./HexBadge";
import NullImg from "@/assets/Null.png";

export default function CompletedBadges({ data }) {
  const completed = data;

  return (
    <div className="h-auto rounded-xl border border-zinc-800 p-4 text-zinc-500">
      <h2 className="text-xl font-semibold text-start text-white px-4">
        Badges
      </h2>
      {completed && completed.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="flex gap-6 whitespace-nowrap">
            {completed.map(({ title, icon }, index) => (
              <div key={index} className="flex-shrink-0">
                <HexBadge title={title} icon={icon} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <img src={NullImg} alt="empty" className="w-32 h-32" />
        </div>
      )}
    </div>
  );
}
