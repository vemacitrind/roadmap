import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import EditProfileDialog from "@/components/Dashboard/EditProfileDialog";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import Img from "@/assets/people-user.png"
import { LuGlobe } from "react-icons/lu";
import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function ProfileHeader({ user, onSave }) {
  const [open, setOpen] = useState(false);
  const [openImg, setOpenImg] = useState(false);

  return (
    <>
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="flex items-center gap-4 mb-2 sm:mb-0">
            <img
              src={user?.profileLink}
              alt="Profile"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = Img;
              }}
              onClick={() => setOpenImg(true)}
              className="w-16 h-16 rounded-full object-cover border border-zinc-700"
            />
            <h2 className="text-2xl font-bold">{user?.name || "Anonymous"}</h2>
          </div>
          <Button size="sm" variant="outline" onClick={() => setOpen(true)} className="gap-1">
            <Pencil size={16} /> Edit Profile
          </Button>
        </div>


        {user?.about && (
          <p className="text-sm text-zinc-400 mt-2 italic">
            {user.about}
          </p>
        )}

        <div className="flex gap-4 mt-4 text-xl text-zinc-300">
          {user?.github && (
            <a href={user.github} target="_blank" rel="noreferrer">
              <FaGithub className="hover:text-white transition" />
            </a>
          )}
          {user?.instagram && (
            <a href={user.instagram} target="_blank" rel="noreferrer">
              <FaInstagram className="hover:text-white transition" />
            </a>
          )}
          {user?.linkedin && (
            <a href={user.linkedin} target="_blank" rel="noreferrer">
              <FaLinkedin className="hover:text-white transition" />
            </a>
          )}
          {user?.urls?.map((v, i) => (
            <a key={i} href={v} target="_blank" rel="noreferrer">
              <LuGlobe className="hover:text-white transition" />
            </a>
          ))}
        </div>
      </div>

      <Dialog open={openImg} onOpenChange={setOpenImg}>
        <DialogContent className="pointer-events-none">
          <div className="pointer-events-auto">
            <img
              src={user?.profileLink }
              alt="Profile Enlarged"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = Img
              }}
              className="w-40 h-40 rounded-full object-cover mx-auto"
            />
            <p className="text-center mt-4 text-lg font-semibold">{user?.name || "User Name"}</p>
          </div>
        </DialogContent>
      </Dialog>

      <EditProfileDialog
        open={open}
        onClose={() => setOpen(false)}
        userData={user}
        onSave={onSave}
      />
    </>
  );
}