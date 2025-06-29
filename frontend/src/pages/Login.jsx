import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AuthPage from "@/components/AuthPage";
import AboutSection from "@/components/AboutSection";
import Threads from "@/components/Threads"; 

export default function Login() {
  return (
    <div className="relative min-h-screen w-screen bg-zinc-950 overflow-hidden">

      <div className="absolute inset-0 z-0">
        <Threads amplitude={1} distance={0} enableMouseInteraction={false} />
      </div>

      <header className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-[90%] flex items-center justify-between z-50">
        <Link to="/" className="flex items-center gap-1 text-zinc-400 hover:text-white">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </Link>

        <Link to="/" className="text-white font-semibold text-2xl tracking-wide hover:opacity-90">
          roadmap.in
        </Link>

        <div className="w-[54px]" />
      </header>

      <div className="relative z-10">
        <AuthPage />
      </div>

    </div>
  );
}
