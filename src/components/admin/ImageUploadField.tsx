import { useId, useRef, useState } from "react"
import { ImageOff, Loader2, Upload } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { uploadImage } from "@/lib/adminApi"
import { dragFraming, framingStyle, normalizeFraming, parseFraming, type ImageFraming } from "@/lib/imageFraming"
import { isSupabaseConfigured } from "@/lib/supabase"

interface ImageUploadFieldProps {
  onBusyChange: (busy: boolean) => void
  id: string
  framing?: string
  onFramingChange: (value: ImageFraming) => void
  value: string
  onChange: (url: string) => void
  /** Storage sub-folder, e.g. "classes", "team", "testimonials". */
  folder: string
}

const MAX_BYTES = 5 * 1024 * 1024

export function ImageUploadField({ id, value, onChange, folder, framing, onFramingChange, onBusyChange }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [brokenSource, setBrokenSource] = useState<string>()
  const broken = brokenSource === value
  const sliderId = useId()
  const imageRef = useRef<HTMLImageElement>(null)
  const drag = useRef<{ x: number; y: number; framing: ImageFraming } | null>(null)
  const defaultY = folder === "team" ? 0 : 50
  const crop = parseFraming(framing, defaultY)
  const shape = folder === "team" ? "aspect-[4/5]" : folder === "testimonials" ? "aspect-square rounded-full max-w-48 mx-auto" : "aspect-[4/3]"

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
    onBusyChange(true)
    try {
      const url = await uploadImage(file, folder)
      onChange(url)
      setBrokenSource(undefined)
      toast.success("Image uploaded")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.")
    } finally {
      setUploading(false)
      onBusyChange(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
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
        id={id}
        disabled={uploading}
        value={value}
        placeholder="Or paste an image URL"
        onChange={(e) => {
          onChange(e.target.value)
          setBrokenSource(undefined)
        }}
      />
      {value.trim() && (
        <fieldset className="min-w-0 space-y-3" disabled={broken || uploading}>
          <legend className="mb-2 text-sm font-medium">Adjust photo</legend>
          <div
            className={`relative w-full overflow-hidden border border-border bg-muted ${shape} ${broken ? "" : "touch-none cursor-grab active:cursor-grabbing"}`}
            onPointerDown={(e) => {
              if (broken || uploading || e.button !== 0 || !imageRef.current?.naturalWidth) return
              e.currentTarget.setPointerCapture(e.pointerId)
              drag.current = { x: e.clientX, y: e.clientY, framing: crop }
            }}
            onPointerMove={(e) => {
              const start = drag.current
              const image = imageRef.current
              if (!start || !image) return
              const rect = e.currentTarget.getBoundingClientRect()
              onFramingChange(dragFraming(start.framing, e.clientX - start.x, e.clientY - start.y, rect.width, rect.height, image.naturalWidth, image.naturalHeight))
            }}
            onPointerUp={(e) => {
              drag.current = null
              if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
            }}
            onPointerCancel={() => { drag.current = null }}
            onLostPointerCapture={() => { drag.current = null }}
          >
            {broken ? <div className="flex h-full min-h-32 flex-col items-center justify-center gap-2 p-4 text-center text-sm" role="status"><ImageOff className="h-6 w-6" />Image could not load. Check the URL or upload another photo.</div> : (
              <img key={value} ref={imageRef} src={value.trim()} alt="Photo framing preview" draggable={false} className="absolute inset-0 h-full w-full select-none object-cover" style={framingStyle(crop)} onError={() => setBrokenSource(value)} />
            )}
          </div>
          <p className="text-xs text-muted-foreground">Drag the photo or use the sliders to frame it. Zoom resizes the photo inside its frame. Position controls move the crop where there is extra image to show.</p>
          {([
            ["zoom", "Zoom", 1, 3, 0.01],
            ["x", "Horizontal position", 0, 100, 1],
            ["y", "Vertical position", 0, 100, 1],
          ] as const).map(([key, label, min, max, step]) => (
            <div key={key} className="space-y-1">
              <label htmlFor={`${sliderId}-${key}`} className="flex justify-between gap-2 text-sm">
                {label}<span>{Math.round(crop[key] * (key === "zoom" ? 100 : 1))}%</span>
              </label>
              <input id={`${sliderId}-${key}`} type="range" min={min} max={max} step={step} value={crop[key]} aria-valuetext={`${Math.round(crop[key] * (key === "zoom" ? 100 : 1))} percent`} onChange={(e) => onFramingChange({ ...crop, [key]: Number(e.target.value) })} className="w-full accent-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" />
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => onFramingChange(normalizeFraming(null, defaultY))}>Reset framing</Button>
          <p className="text-xs text-muted-foreground">Your original photo stays unchanged. Press Save to apply, or Cancel to discard these adjustments.</p>
        </fieldset>
      )}
    </div>
  )
}
