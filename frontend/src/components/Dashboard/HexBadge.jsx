import { Icon } from "@iconify/react";
import "./HexBadge.css";

export default function HexBadge({ title, icon }) {
  return (
    <div className="badge3d" title={title}>
      <svg
        className="svg-bg"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3f3f46" />
            <stop offset="100%" stopColor="#18181b" />
          </linearGradient>
        </defs>
        <g fill="none" fillRule="evenodd">
          <path
            d="M10.75,2.56687 C11.5235,2.12029 12.4765,2.12029 13.25,2.56687 L19.5443,6.20084 C20.3178,6.64743 20.7943,7.47274 20.7943,8.36591 L20.7943,15.6339 C20.7943,16.527 20.3178,17.3523 19.5443,17.7989 L13.25,21.4329 C12.4765,21.8795 11.5235,21.8795 10.75,21.4329 L4.45581,17.7989 C3.68231,17.3523 3.20581,16.527 3.20581,15.6339 L3.20581,8.36591 C3.20581,7.47274 3.68231,6.64743 4.45581,6.20084 L10.75,2.56687 Z"
            fill="url(#hexGradient)"
          />
        </g>
      </svg>

      <div className="text flex flex-col items-center justify-center gap-2">
  <Icon
    icon={icon}
    className="text-white w-8 h-8 flex-shrink-0"
  />
  <span
    className="text-md text-zinc-100 font-semibold text-center truncate max-w-[100px]"
    title={title} // Tooltip on hover
  >
    {title}
  </span>
</div>
    </div>
  );
}
