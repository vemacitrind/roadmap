import { useAuth } from "@/auth/AuthContext";
import { useState } from "react";
import { doc, setDoc, collection, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BasicHeader from "@/components/BasicHeader";
import { Separator } from "@/components/ui/separator";
import Squares from "@/components/Squres";


export default function AdminPanel() {
  const [selected, setSelected] = useState("view");
  const { user } = useAuth();
  const [fileContent, setFileContent] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/json") {
      alert("Only .json files are allowed");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        setFileContent(json);
      } catch {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!fileContent?.type) return alert("JSON must contain a type field");
    const fileInput = document.querySelector("input[type='file']");
    const category = fileInput?.files[0]?.name?.replace(/\.json$/, "");
    if (!category) return alert("Invalid filename");

    try {
      setUploading(true);

      /*Upload JSON to roadmaps/{type}/{category}/{autoId}              */
      const docRef = doc(collection(db, "roadmaps", fileContent.type, category));
      await setDoc(docRef, fileContent);

      /* Add category to roadmaps/{type}.collections (create if missing) */
      const typeDocRef = doc(db, "roadmaps", fileContent.type);
      await updateDoc(
        typeDocRef,
        { collections: arrayUnion(category) },
        { merge: true } // create the doc if it doesn't exist
      );
      console.log(`📌 Added "${category}" to collections`);
      alert("Roadmap uploaded successfully!");
      setFileContent(null);
    } catch (e) {
      console.error("❌ Upload error:", e);
      alert("Upload failed: " + e.message);
    } finally {
      setUploading(false);
    }
  };

  return (<>
    <div className="w-screen h-screen pt-24 text-white bg-zinc-950 overflow-auto">
    <BasicHeader />
      <div className="flex justify-center mb-2 items-center gap-4 h-40 relative">
        {/* <Squares speed={0.3} direction='diagonal'  /> */}
        {user?.photoURL && (
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-24 h-24 rounded-full border border-zinc-800 z-[10]"
          />
        )}
        <div className="text-2xl font-semibold z-[10]">
          Welcome, {user?.name || user?.email}
        </div>
      </div>
      <Separator className="bg-zinc-700 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 lg:mx-60">
        {/* BUttons */}
        <div className="space-y-4 col-span-1">
          <button
            onClick={() => setSelected("view")}
            className={`w-full px-4 py-1 rounded-lg text-left text-sm font-medium ${selected === "view"
              ? "text-zinc-50"
              : "text-zinc-500"
              }`}
          >
            View
          </button>
          <Separator className="my-6" />
          <button
            onClick={() => setSelected("upload")}
            className={`w-full px-4 py-1 rounded-lg text-left text-sm font-medium ${selected === "upload"
              ? "text-zinc-50"
              : "text-zinc-500"
              }`}
          >
            Upload
          </button>
        </div>

        <div className="md:col-span-4 flex items-center justify-center min-h-[300px]">
          {selected !== "view" ? (
            <>
              <Input
                type="file"
                accept=".json"
                onChange={handleFile}
                className=" text-white file:text-sm file:bg-blue-600 file:text-white"
              />

              {fileContent && (
                <div className="bg-zinc-800 p-4 rounded text-sm overflow-auto max-h-60">
                  <pre>{JSON.stringify(fileContent, null, 2)}</pre>
                </div>
              )}

              <Button
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!fileContent || uploading}
                onClick={handleUpload}
              >
                {uploading ? "Uploading..." : "Upload Roadmap"}
              </Button>
            </>
          ) : (
            "Nothing here"
          )}
        </div>
      </div>
      <div className="space-y-4">

      </div>
    </div>
  </>
  );
}
