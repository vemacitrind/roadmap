import { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import BasicHeader from "@/components/BasicHeader";
import AboutSection from "@/components/AboutSection";
import { useAuth } from "@/auth/AuthContext";
import { fetchUserProfile } from "@/lib/community_page";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { purchase } from '@/lib/project';
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { Icon } from "@iconify/react";
import techList from "@/lib/technologies.json";
import Loader from "@/components/Loader";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [creatorProfile, setCreatorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrUrl, setQrUrl] = useState(null);

  // Disable Buy button if logged-in user is project creator
  const isCreator = user?.uid === project?.uid;

  const handleBuyClick = () => {
    if (!user) {
      setLoginDialogOpen(true);
    } else {
      setOpen(true);
      setQrLoading(true);

      // Simulate QR generation delay
      setTimeout(() => {
        setQrUrl("https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=vj63883@ptaxis");
        setQrLoading(false);
      }, 1200);
    }
  };

  useEffect(() => {
    const fetchProjectAndProfile = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "projects", projectId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const projectData = { id: docSnap.id, ...docSnap.data() };
          setProject(projectData);
          if (projectData.uid) {
            const profile = await fetchUserProfile(projectData.uid);
            setCreatorProfile(profile);
          } else {
            setCreatorProfile({ name: "Anonymous", profileLink: "/placeholder.png" });
          }
        } else {
          setProject(null);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndProfile();
  }, [projectId]);

  function handlePurchase() {
    purchase(project, user?.uid).then((result) => {
      console.log("Purchase data:", result);
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-zinc-950">
        Project not found.
      </div>
    );
  }

  return (
    <>
      <BasicHeader />
      <main className="min-h-screen bg-zinc-950 text-white p-6 md:p-10 max-w-4xl mx-auto mt-24">
        {/* Creator */}
        <div className="flex items-center gap-4 mb-6">
          <RouterLink to={`/${project?.uid}`}>
            <img
              src={creatorProfile?.profileLink || "/placeholder.png"}
              alt={creatorProfile?.name || "Creator"}
              className="w-14 h-14 rounded-full border border-zinc-700 object-cover cursor-pointer"
            />
          </RouterLink>
          <div>
            <p className="text-sm text-zinc-400 text-start">Created by</p>
            <h2 className="text-xl font-semibold">{creatorProfile?.name || "Unknown"}</h2>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4 text-start">{project.title}</h1>

        {/* Carousel */}
        {project.images?.length > 0 && (
          <Carousel className="w-full max-w-3xl mx-auto">
            <CarouselContent>
              {project.images.map((img, i) => (
                <CarouselItem key={i}>
                  <div className="w-full aspect-video">
                    <img
                      src={img}
                      alt={`Project image ${i + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}

        <p className="mt-6 text-zinc-300 text-start">{project.description}</p>

        {project.technologies?.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-start">Technologies Used:</h3>
            <div className="flex flex-wrap gap-3 mt-2">
              {project.technologies.map((tech, i) => {
                const techData = techList.find(
                  (t) => t.name.toLowerCase() === tech.toLowerCase()
                );
                return (
                  <Badge
                    key={i}
                    variant="outline"
                    className="flex items-center gap-2 text-white border-white/30 px-3 py-1.5 text-sm"
                  >
                    {techData && (
                      <Icon icon={techData.icon} className="w-5 h-5 text-white" />
                    )}
                    {tech}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6 text-lg font-semibold text-start">
          Price: ₹{project.price}
        </div>

        <div className="text-start">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 hover:shadow-lg"
            >
              Demo Link <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        <div className="mt-8">
          <Button
            variant="default"
            className="px-6 py-3 rounded transition"
            onClick={handleBuyClick}
            disabled={isCreator}
            title={isCreator ? "You cannot buy your own project" : undefined}
          >
            Buy Project
          </Button>
        </div>
      </main>
      <AboutSection />

      {/* Login Dialog */}
      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
          </DialogHeader>
          <p className="py-2">You must be logged in to buy a project.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLoginDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setLoginDialogOpen(false);
                window.location.href = "/login";
              }}
              className="ml-2"
            >
              Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan to Buy</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4">
            {qrLoading ? (
              <Loader />
            ) : (
              qrUrl && (
                <img
                  src={qrUrl}
                  alt="QR Code"
                  className="rounded-lg border-4 border-white"
                />
              )
            )}
            <p className="text-center text-sm text-gray-500">
              Scan the QR code or click the button to test.
            </p>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => handlePurchase()}>
              Test Button
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
