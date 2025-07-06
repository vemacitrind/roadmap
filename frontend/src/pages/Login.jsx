import AuthPage from "@/components/AuthPage";
import Threads from "@/components/Threads"; 
import BasicHeader from "@/components/BasicHeader";

export default function Login() {
  return (
    <div className="relative min-h-screen w-screen bg-zinc-950 overflow-hidden">

      <div className="absolute inset-0 z-0">
        <Threads amplitude={1} distance={0} enableMouseInteraction={false} />
      </div>

      <BasicHeader/>

      <div className="relative z-10">
        <AuthPage />
      </div>

    </div>
  );
}
