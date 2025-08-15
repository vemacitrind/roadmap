import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
      <div className="w-full text-center py-16 bg-[linear-gradient(to_right,#09090b_60%,#18181b_100%)] relative overflow-hidden">
        <h1 className="text-4xl md:text-6xl font-extrabold ">
          Explore Roadmaps
        </h1>
        <p className="mt-3 text-zinc-400 text-lg">
          Pick your path. Master your future.
        </p>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_30%,#27272a,transparent_70%)]"></div>
      </div>

      <div className="min-h-screen w-full bg-zinc-950 px-6 py-12 text-white flex justify-center">
        <div className="w-full max-w-6xl">
          <Tabs
            value={selected}
            onValueChange={setSelected}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full md:w-[400px] mx-auto bg-transparent p-0">
              <TabsTrigger
                value="role"
                className="relative py-2 px-4 text-sm font-medium text-zinc-400 data-[state=active]:text-white after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-transparent data-[state=active]:after:bg-white transition-all"
              >
                Role-Based
              </TabsTrigger>
              <TabsTrigger
                value="skill"
                className="relative py-2 px-4 text-sm font-medium text-zinc-400 data-[state=active]:text-white after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-transparent data-[state=active]:after:bg-white transition-all"
              >
                Skill-Based
              </TabsTrigger>
            </TabsList>

            <Separator className="my-8 bg-zinc-800" />

            <TabsContent value="role" className="mt-6">
              <div className="p-4 md:p-8 rounded-xl bg-zinc-900/50 shadow-md border border-zinc-800">
                <ExploreRoleBased />
              </div>
            </TabsContent>
            <TabsContent value="skill" className="mt-6">
              <div className="p-4 md:p-8 rounded-xl bg-zinc-900/50 shadow-md border border-zinc-800">
                <ExploreSkillBased />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );

  return <BasicTemplate1>{x}</BasicTemplate1>;
}
