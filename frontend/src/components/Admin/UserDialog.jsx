import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, Github, Instagram, Linkedin, Globe } from "lucide-react";
import { format } from "date-fns";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import Null from "@/assets/Null.png";
import { Icon } from "@iconify/react";

export default function UserDialog({ user }) {
  const [roadmapMeta, setRoadmapMeta] = useState({});
  const [projects, setProjects] = useState([]);
  const [activeView, setActiveView] = useState("roadmap");

  if (!user) return null;

  const {
    name,
    about,
    createdAt,
    email,
    github,
    instagram,
    linkedin,
    profileLink,
    urls = [],
    roadmapsProgress = {},
    uid,
  } = user;

  async function fetchRoadmapMeta(type, id) {
    try {
      const roadmapDocRef = doc(db, `roadmaps/${type}/documents`, id);
      const roadmap = await getDoc(roadmapDocRef);
      if (roadmap.exists()) {
        const data = roadmap.data();
        return { name: data.title, icon: data.icon };
      }
    } catch {
      return { name: "Unknown", icon: null };
    }
    return { name: "Unknown", icon: null };
  }

  const formattedDate = createdAt?.seconds
    ? format(new Date(createdAt.seconds * 1000), "PPPpp")
    : null;

  useEffect(() => {
    async function fetchAllRoadmapMeta() {
      const metaPromises = Object.entries(roadmapsProgress).map(async ([rid, rp]) => {
        if (!rp.type) return [rid, { name: "Unknown", icon: null }];
        const meta = await fetchRoadmapMeta(rp.type, rid);
        return [rid, meta];
      });
      const metaPairs = await Promise.all(metaPromises);
      setRoadmapMeta(Object.fromEntries(metaPairs));
    }
    if (roadmapsProgress && Object.keys(roadmapsProgress).length) {
      fetchAllRoadmapMeta();
    }
  }, [JSON.stringify(roadmapsProgress)]);

  useEffect(() => {
    async function fetchUserProjects() {
      const q = query(collection(db, "projects"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      setProjects(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    }
    if (uid) fetchUserProjects();
  }, [uid]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">View</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-zinc-900 text-white border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-xl">{name || "Anonymous"}</DialogTitle>
          <DialogDescription className="text-zinc-400">User Details & Progress</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-8 mt-4">
          {/* LEFT Side: User Info & Links */}
          <div className="w-full md:w-1/3 space-y-4 flex flex-col items-center">
            {profileLink && (
              <img src={profileLink} alt="profile" className="w-24 h-24 rounded-full border" />
            )}
            {about && (
              <p className="text-center text-zinc-300 italic">“{about}”</p>
            )}
            <div className="flex flex-col gap-1 text-sm mt-4 w-full items-center">
              {email && <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> {email}</p>}
              {formattedDate && <p className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {formattedDate}</p>}
            </div>
            <div className="flex gap-3 mt-3 text-xl items-center justify-center">
              {github && <a href={github} target="_blank" rel="noreferrer"><Github /></a>}
              {instagram && <a href={instagram} target="_blank" rel="noreferrer"><Instagram /></a>}
              {linkedin && <a href={linkedin} target="_blank" rel="noreferrer"><Linkedin /></a>}
              {urls?.map((u, i) => <a key={i} href={u} target="_blank" rel="noreferrer"><Globe /></a>)}
            </div>
          </div>

          <div className="w-full md:w-2/3 space-y-6">
            {/* Tab Buttons */}
            <div className="flex relative mb-6 border-b border-zinc-700 justify-around">
              {["roadmap", "projects"].map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 
                    ${activeView === view ? "text-zinc-50" : "text-zinc-200 hover:text-zinc-100"}`}
                >
                  {view === "roadmap" ? "Roadmaps" : "Projects"}
                </button>
              ))}
              {/* Animated underline */}
              <span
                className="absolute bottom-0 h-[2px] bg-zinc-50 transition-all duration-300"
                style={{
                  left: activeView === "roadmap" ? "0%" : "50%",
                  width: "50%",
                }}
              />
            </div>

            {/* ROADMAP VIEW */}
            {activeView === "roadmap" && (
              <>
                {roadmapsProgress && Object.keys(roadmapsProgress).length > 0 ? (
                  <Accordion type="multiple" className="mb-5">
                    {Object.entries(roadmapsProgress).map(([rid, rp], idx) => {
                      const progress = rp.progress ?? 0;
                      const startedAt = rp.startedAt
                        ? format(new Date(rp.startedAt), "PPPpp")
                        : "N/A";
                      const meta = roadmapMeta[rid] || {};
                      return (
                        <AccordionItem value={rid} key={rid}>
                          <AccordionTrigger>
                            <span className="flex items-center gap-2">
                              {meta.icon ? <Icon icon={meta.icon} alt="" className="w-6 h-6 inline" /> : null}
                              {meta.name || "Unknown Roadmap"}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="text-sm space-y-2">
                              <p><strong>Progress:</strong> <Badge>{progress}%</Badge></p>
                              <p><strong>Started At:</strong> {startedAt}</p>
                              <p><strong>Type:</strong> {rp.type || "N/A"}</p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <img src={Null} alt="Null State" className="w-32 h-32 mb-2" />
                    <p className="text-zinc-400">No Roadmap selected</p>
                  </div>
                )}
              </>
            )}

            {/* PROJECT VIEW */}
            {activeView === "projects" && (
              <>
                {projects.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {projects.map((project) => (
                      <div key={project.id} className="rounded border border-zinc-800 bg-zinc-950 p-3 min-w-[180px] max-w-[250px]">
                        {project.images && project.images.length > 0 ? (
                          <img src={project.images[0]} alt={project.title} className="w-full h-20 object-cover rounded mb-2" />
                        ) : (
                          <div className="w-full h-20 bg-zinc-800 flex items-center justify-center text-zinc-500 rounded mb-2">
                            No Image
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-base mb-1">{project.title}</h4>
                          <p className="text-sm text-zinc-400 truncate">{project.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <img src={Null} alt="Null State" className="w-32 h-32 mb-2" />
                    <p className="text-zinc-400">No Project found</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
