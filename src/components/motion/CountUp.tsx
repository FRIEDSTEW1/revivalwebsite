import { useEffect, useMemo, useRef, useState } from "react"
import { useInView, useReducedMotion } from "framer-motion"

interface CountUpProps {
  /** Raw label such as "500+" or "15+" — digits animate, suffix is preserved. */
  value: string
  className?: string
}

/** Counts up to the target once the number scrolls into view. */
export function CountUp({ value, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" })
  const reduce = useReducedMotion()

  // Memoized on `value` alone — String.match() returns a new array every
  // call, and having that array in the effect's deps below was restarting
  // the animation (and cancelling the in-flight frame) on every tick.
  const { target, suffix, hasDigits } = useMemo(() => {
    const match = value.match(/^(\d+)(.*)$/)
    return {
      target: match ? parseInt(match[1], 10) : 0,
      suffix: match ? match[2] : value,
      hasDigits: Boolean(match),
    }
  }, [value])

  const [display, setDisplay] = useState(reduce || !hasDigits ? target : 0)

  useEffect(() => {
    if (!inView || reduce || !hasDigits) return

    const duration = 1400
    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      // easeOutExpo — fast start, gentle settle
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setDisplay(Math.round(eased * target))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduce, hasDigits, target])

  return (
    <span ref={ref} className={className}>
      {hasDigits ? display : ""}
      {suffix}
    </span>
  )
}
