import { useState, type ComponentProps } from "react"
import { framingStyle } from "@/lib/imageFraming"

type FramedImageProps = ComponentProps<"img"> & {
  framing?: unknown
  defaultY?: number
  fallback?: React.ReactNode
}

const cdnSources = [
  /^https:\/\/xkathwpvizoyzqnxpdgd\.supabase\.co\/storage\/v1\/object\/public\/media\//,
  /^https:\/\/i\.postimg\.cc\//,
]

/** Parent supplies the crop shape and overflow clipping. */
export function FramedImage({ src, fallback, ...props }: FramedImageProps) {
  const source = src?.trim()
  return source ? <Photo key={source} src={source} fallback={fallback} {...props} /> : <>{fallback}</>
}

function Photo({ src, framing, defaultY = 50, fallback, style, sizes, onLoad, onError, ...props }: FramedImageProps & { src: string }) {
  const [loaded, setLoaded] = useState(false)
  const [loadOriginal, setLoadOriginal] = useState(false)
  const [failed, setFailed] = useState(false)
  if (failed) return <>{fallback}</>

  const optimize = import.meta.env.VITE_NETLIFY_IMAGE_CDN && !loadOriginal
    && cdnSources.some((pattern) => pattern.test(src))
  const widths = sizes ? [480, 800, 1200] : [128]
  const imageUrl = (width: number) => `/.netlify/images?url=${encodeURIComponent(src)}&w=${width}&q=80`
  const srcSet = optimize && sizes ? widths.map((width) => `${imageUrl(width)} ${width}w`).join(", ") : undefined

  return (
    <img
      {...props}
      src={optimize ? imageUrl(widths[0]) : src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      decoding="async"
      style={{ ...style, ...framingStyle(framing, defaultY), visibility: loaded ? undefined : "hidden" }}
      onLoad={(event) => {
        setLoaded(true)
        onLoad?.(event)
      }}
      onError={(event) => {
        setLoaded(false)
        if (optimize) setLoadOriginal(true)
        else {
          setFailed(true)
          onError?.(event)
        }
      }}
    />
  )
}
