import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import ExploreRoleBased from "@/components/Explore/ExploreRoleBased";
import ExploreSkillBased from "@/components/Explore/ExploreSkillBased";
import BasicTemplate1 from "@/components/BaseTemplates/BasicTemplate1";

export default function Explore() {
  const [selected, setSelected] = useState("role");
  const [searchParams] = useSearchParams();


  useEffect(() => {
    const type = searchParams.get("type");
    if (type) {
      setSelected(type);
    }
  }, [searchParams]);



  const x = (
    <>
      <div className="w-full mx-auto text-center h-32 content-center bg-[linear-gradient(to_right,_#09090b_60%,_#e4e4e7_100%)]">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-zinc-200 to-white bg-clip-text text-transparent drop-shadow-lg">
          Explore Roadmaps
        </h1>
        <p className="mt-2 text-zinc-400 text-sm md:text-base">
          Pick your path. Master your future.
        </p>
      </div>
      <div className="min-h-screen w-full overflow-x-hidden grid justify-items-center bg-zinc-950 px-6 py-0 mx-0 text-white">
        <div className="w-full max-w-6xl">
          <Separator className="bg-zinc-700 mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* BUttons */}
            <div className="space-y-4 col-span-1">
              <button
                onClick={() => setSelected("role")}
                className={`w-full px-4 py-1 rounded-lg text-left text-sm font-medium ${selected === "role"
                  ? "text-zinc-50"
                  : "text-zinc-500"
                  }`}
              >
                Role-Based
              </button>
              <Separator className="my-6" />
              <button
                onClick={() => setSelected("skill")}
                className={`w-full px-4 py-1 rounded-lg text-left text-sm font-medium ${selected === "skill"
                  ? "text-zinc-50"
                  : "text-zinc-500"
                  }`}
              >
                Skill-Based
              </button>
            </div>

            <div className="md:col-span-4 flex items-center justify-center min-h-[300px]">
              {selected === "role" ? (
                <ExploreRoleBased />
              ) : (
                <ExploreSkillBased />
              )}
            </div>
          </div>
        </div>
      </div>

    </>
  );

  return(
    <BasicTemplate1 children={x}/>
  )


}
