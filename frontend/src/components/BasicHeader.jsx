import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react";

export default function BasicHeader() {
    return(
        <header className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-[90%] flex items-center justify-between z-50">
        <Link to="/" className="flex items-center gap-1 text-zinc-400 hover:text-white">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </Link>

        <Link to="/" className="text-white font-semibold text-2xl tracking-wide hover:opacity-90" style={{ fontFamily: 'Cascadia Mono' }}>
          roadmap.in
        </Link>

        <div className="w-[54px]" />
      </header>
    )
}