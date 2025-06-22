import { Button } from "@/components/ui/button"

export function ButtonWithIcon({children,...props}) {
  return (
    <Button variant="outline" {...props} className="flex items-center group">
      {children}
    </Button>
  )
}
