/** Non-destructive framing: position within the available crop, and cover-relative zoom. */
export interface ImageFraming { x: number; y: number; zoom: number }

export function normalizeFraming(value: unknown, defaultY = 50): ImageFraming {
  const v = value && typeof value === "object" ? value as Partial<ImageFraming> : {}
  const number = (n: unknown, fallback: number, min: number, max: number) =>
    typeof n === "number" && Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback
  return { x: number(v.x, 50, 0, 100), y: number(v.y, defaultY, 0, 100), zoom: number(v.zoom, 1, 1, 3) }
}

export function parseFraming(value: string | undefined, defaultY = 50): ImageFraming {
  try { return normalizeFraming(JSON.parse(value || "null"), defaultY) }
  catch { return normalizeFraming(null, defaultY) }
}

export function framingStyle(value: unknown, defaultY = 50) {
  const { x, y, zoom } = normalizeFraming(value, defaultY)
  return { objectPosition: `${x}% ${y}%`, transformOrigin: `${x}% ${y}%`, transform: `scale(${zoom})` }
}

/** Convert pointer movement into crop percentages without exposing empty edges. */
export function dragFraming(start: ImageFraming, dx: number, dy: number, width: number, height: number, imageWidth: number, imageHeight: number): ImageFraming {
  const cover = Math.max(width / imageWidth, height / imageHeight)
  const overflowX = imageWidth * cover * start.zoom - width
  const overflowY = imageHeight * cover * start.zoom - height
  return normalizeFraming({ ...start,
    x: overflowX > 0.5 ? start.x - dx / overflowX * 100 : start.x,
    y: overflowY > 0.5 ? start.y - dy / overflowY * 100 : start.y,
  })
}
