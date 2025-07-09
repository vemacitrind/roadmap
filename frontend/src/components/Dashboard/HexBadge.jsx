import { useRef } from "react";
import "./HexBadge.css";
import * as Icons from "@/components/Icon";

export default function HexBadge({ title, name }) {
  const IconComponent = Icons[`${name.charAt(0).toUpperCase()}${name.slice(1)}Icon`];

  return (
    <div className="badge3d" title={title}>

        <svg className="svg-bg" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
          <defs>
            <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3f3f46" />
              <stop offset="100%" stopColor="#18181b" />
            </linearGradient>
          </defs>
          <g id="页面-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="Shape" transform="translate(-48.000000, -48.000000)" fillRule="nonzero">
              <g id="hexagon_fill" transform="translate(48.000000, 48.000000)">
                <path d="M10.75,2.56687 C11.5235,2.12029 12.4765,2.12029 13.25,2.56687 L19.5443,6.20084 C20.3178,6.64743 20.7943,7.47274 20.7943,8.36591 L20.7943,15.6339 C20.7943,16.527 20.3178,17.3523 19.5443,17.7989 L13.25,21.4329 C12.4765,21.8795 11.5235,21.8795 10.75,21.4329 L4.45581,17.7989 C3.68231,17.3523 3.20581,16.527 3.20581,15.6339 L3.20581,8.36591 C3.20581,7.47274 3.68231,6.64743 4.45581,6.20084 L10.75,2.56687 Z" id="hexagon" fill="url(#hexGradient)">
                </path>
              </g>
            </g>
          </g>
        </svg>
        <div className="text flex flex-col items-center justify-center gap-2">
          {IconComponent && <IconComponent className="text-4xl" />}
          <span className="text-md text-zinc-100 font-semibold">{name[0].toUpperCase() + name.slice(1)}</span>
        </div>
      </div>
  );
}
