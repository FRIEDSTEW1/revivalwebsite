import { useRef, useState } from "react"
import { ImageOff, Loader2, Upload } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { uploadImage } from "@/lib/adminApi"
import { isSupabaseConfigured } from "@/lib/supabase"

interface ImageUploadFieldProps {
  value: string
  onChange: (url: string) => void
  /** Storage sub-folder, e.g. "classes", "team", "testimonials". */
  folder: string
}

const MAX_BYTES = 5 * 1024 * 1024

export function ImageUploadField({ value, onChange, folder }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [broken, setBroken] = useState(false)

  async function handleFile(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.")
      return
    }
    if (file.size > MAX_BYTES) {
      toast.error("Images must be under 5MB.")
      return
    }

    setUploading(true)
    try {
      const url = await uploadImage(file, folder)
      onChange(url)
      setBroken(false)
      toast.success("Image uploaded")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
          {value && !broken ? (
            <img
              src={value}
              alt=""
              className="h-full w-full object-cover"
              onError={() => setBroken(true)}
            />
          ) : (
            <ImageOff className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading || !isSupabaseConfigured}
          onClick={() => inputRef.current?.click()}
          className="gap-1.5"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? "Uploading..." : "Upload Image"}
        </Button>
      </div>

      {!isSupabaseConfigured && (
        <p className="text-xs text-muted-foreground">
          Connect Supabase to upload images (see supabase/README.md) — paste a URL below instead.
        </p>
      )}

      <Input
        value={value}
        placeholder="Or paste an image URL"
        onChange={(e) => {
          onChange(e.target.value)
          setBroken(false)
        }}
      />
    </div>
  )
}
