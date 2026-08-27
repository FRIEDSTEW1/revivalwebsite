import { useEffect, useState } from "react"
import ReactQuill from "react-quill-new"
import "react-quill-new/dist/quill.snow.css"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageError, PageLoading } from "@/components/PageState"
import { getPageContent } from "@/lib/data"
import { upsertPageContent } from "@/lib/adminApi"

export function ManagePageContent() {
  const [termsContent, setTermsContent] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savingTerms, setSavingTerms] = useState(false)
  const [savingVideo, setSavingVideo] = useState(false)

  useEffect(() => {
    Promise.all([getPageContent("terms"), getPageContent("about_video")])
      .then(([terms, video]) => {
        setTermsContent(terms ?? "")
        setVideoUrl(video ?? "")
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Something went wrong."))
      .finally(() => setLoading(false))
  }, [])

  async function saveTerms() {
    setSavingTerms(true)
    try {
      await upsertPageContent("terms", termsContent)
      toast.success("Terms & Conditions saved")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save content")
    } finally {
      setSavingTerms(false)
    }
  }

  async function saveVideo() {
    setSavingVideo(true)
    try {
      await upsertPageContent("about_video", videoUrl)
      toast.success("About video saved")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save content")
    } finally {
      setSavingVideo(false)
    }
  }

  if (loading) return <PageLoading />
  if (error) return <PageError message={error} />

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <h2 className="font-serif text-xl font-semibold">About Page Video</h2>
        <p className="text-sm text-muted-foreground">Embed URL for the Revival MMA documentary (Vimeo/YouTube embed link).</p>
        <div className="flex flex-col gap-2 sm:max-w-md">
          <Label htmlFor="videoUrl">Embed URL</Label>
          <Input id="videoUrl" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
        </div>
        <Button onClick={saveVideo} disabled={savingVideo} className="w-fit">
          {savingVideo ? "Saving..." : "Save"}
        </Button>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-serif text-xl font-semibold">Terms & Conditions</h2>
        <p className="text-sm text-muted-foreground">
          Use the rich text editor below to format your content.
        </p>
        <ReactQuill theme="snow" value={termsContent} onChange={setTermsContent} className="bg-background" />
        <Button onClick={saveTerms} disabled={savingTerms} className="w-fit">
          {savingTerms ? "Saving..." : "Save Terms & Conditions"}
        </Button>
      </section>
    </div>
  )
}
