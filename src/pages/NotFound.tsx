import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { SEO } from "@/components/SEO"

export function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-32 text-center sm:px-6">
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist." />
      <h1 className="font-serif text-4xl font-bold">Page Not Found</h1>
      <p className="text-muted-foreground">The page you're looking for doesn't exist or has moved.</p>
      <Button asChild>
        <Link to="/">Back to Home</Link>
      </Button>
    </div>
  )
}
