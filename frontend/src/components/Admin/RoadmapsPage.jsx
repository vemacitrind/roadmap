import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash, Pencil } from "lucide-react"
import { getAllRoadmaps, deleteRoadmapById } from "@/lib/roadmapData"
import { toast } from "sonner"

export default function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRoadmaps()
  }, [])

  const fetchRoadmaps = async () => {
    setLoading(true)
    const data = await getAllRoadmaps()
    setRoadmaps(data)
    setLoading(false)
  }

  const handleDelete = async (id) => {
    await deleteRoadmapById(id)
    toast("Roadmap deleted", {
      description: "The roadmap was successfully removed.",
    })
    fetchRoadmaps()
  }
  console.log(roadmaps)
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Roadmaps</h1>
        <Button>
          <Plus className="w-4 h-4 mr-1" /> Add Roadmap
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-zinc-400">Loading roadmaps…</p>
        ) : (
          roadmaps.map((roadmap) => (
            <Card key={roadmap.id} className="bg-zinc-900 border-zinc-800">
              <CardHeader className="flex justify-between items-start">
                <CardTitle className="text-lg">{roadmap.title}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => console.log("Edit", roadmap.id)}
                  >
                    <Pencil className="w-4 h-4 text-yellow-400" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(roadmap.id)}
                  >
                    <Trash className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="text-zinc-400 text-sm">
                {roadmap.description || "No description"}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
