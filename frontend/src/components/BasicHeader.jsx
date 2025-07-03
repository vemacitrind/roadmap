import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react";

export default function BasicHeader() {
  const navigate = useNavigate();
  return (
    <header className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-[90%] flex items-center justify-between z-50">
      <button
        onClick={() => navigate(-1)} // 👈 Go back one step in history
        className="flex items-center gap-1 text-zinc-400 hover:text-white"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">Back</span>
      </button>

      <Link to="/" className="text-white font-bold text-2xl tracking-wide hover:opacity-90" style={{ fontFamily: 'Noto Serif JP' }}>
        roadmap.in
      </Link>

      <div className="w-[54px]" />
    </header>
  )
}