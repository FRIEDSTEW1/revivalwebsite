import { useState, type ComponentProps } from "react"
import { framingStyle } from "@/lib/imageFraming"

/** Parent supplies the crop shape and overflow clipping. */
export function FramedImage({ framing, defaultY = 50, fallback, src, style, ...props }: ComponentProps<"img"> & {
  framing?: unknown
  defaultY?: number
  fallback?: React.ReactNode
}) {
  const [failedSource, setFailedSource] = useState<string>()
  if (!src?.trim() || failedSource === src) return <>{fallback}</>
  return <img {...props} src={src.trim()} style={{ ...style, ...framingStyle(framing, defaultY) }} onError={() => setFailedSource(src)} />
}
