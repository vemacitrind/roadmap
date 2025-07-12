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

export default function UserDialog({ user }) {
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
    roadmap,
    urls = [],
  } = user;

  const formattedDate = createdAt?.seconds
    ? format(new Date(createdAt.seconds * 1000), "PPPpp")
    : null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">View</Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl bg-zinc-900 text-white border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-xl">{name || "Anonymous"}</DialogTitle>
          <DialogDescription className="text-zinc-400">User Details & Roadmap Info</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {profileLink && (
            <img src={profileLink} alt="profile" className="w-24 h-24 rounded-full border mx-auto" />
          )}

          {about && (
            <p className="text-center text-zinc-300 italic">“{about}”</p>
          )}

          <div className="flex flex-col gap-1 text-sm mt-4">
            {email && <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> {email}</p>}
            {formattedDate && <p className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {formattedDate}</p>}
          </div>

          <div className="flex gap-4 mt-2 text-xl">
            {github && <a href={github} target="_blank" rel="noreferrer"><Github /></a>}
            {instagram && <a href={instagram} target="_blank" rel="noreferrer"><Instagram /></a>}
            {linkedin && <a href={linkedin} target="_blank" rel="noreferrer"><Linkedin /></a>}
            {urls?.map((u, i) => <a key={i} href={u} target="_blank" rel="noreferrer"><Globe /></a>)}
          </div>

          {/* Roadmaps Accordion */}
          {roadmap && (
            <Accordion type="multiple" className="mt-4">
              {Object.entries(roadmap).map(([title, data], index) => (
                <AccordionItem value={title} key={index}>
                  <AccordionTrigger>{title}</AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm space-y-2">
                      <p><strong>Name:</strong> {data.name}</p>
                      <p><strong>Started At:</strong> {data.startedAt ? new Date(data.startedAt).toLocaleString() : "N/A"}</p>
                      <p><strong>Completed:</strong> {data.isComplete ? <Badge variant={"success"} asChild>Yes</Badge>:<Badge variant={"destructive"} asChild>No</Badge> }</p>
                      <p><strong>Lessons:</strong> <Badge>{data.completedLessons?.length || 0}</Badge></p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
