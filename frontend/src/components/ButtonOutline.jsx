import { Button } from "@/components/ui/button"

export function ButtonOutline({ children, ...props }) {
  return (
    <Button variant="outline" {...props}>
      {children}
    </Button>
  );
}

