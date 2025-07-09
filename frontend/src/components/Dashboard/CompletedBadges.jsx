import HexBadge from "./HexBadge";

export default function CompletedBadges(props) {
    const completed = props.data;
    return (
        <div className="h-auto rounded-xl border border-zinc-800 p-4 text-zinc-500">
            <h2 className="text-xl font-semibold text-start text-white px-4">Badges</h2>
            <div className="flex flex-wrap gap-6 justify-start">
                {completed.map(({ title, name }, index) => (
                    <HexBadge key={index} title={title} name={name} />
                ))}
            </div>
        </div>
    )
}