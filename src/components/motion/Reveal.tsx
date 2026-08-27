import { motion, useReducedMotion, type Variants } from "framer-motion"
import type { ReactNode } from "react"

type Direction = "up" | "left" | "right" | "none"

const OFFSET = 22

// Resolved once — indexing `motion` during render would hand React a new
// component type on every pass and remount the subtree.
const TAGS = {
  div: motion.div,
  section: motion.section,
  li: motion.li,
  article: motion.article,
} as const

interface RevealProps {
  children: ReactNode
  /** Stagger position — each step adds ~60ms. Use for cards in a grid. */
  index?: number
  direction?: Direction
  delay?: number
  className?: string
  as?: "div" | "section" | "li" | "article"
}

/**
 * Fades content in as it scrolls into view. Deliberately restrained:
 * a short rise, one run only, and fully disabled when the visitor has
 * asked for reduced motion.
 */
export function Reveal({
  children,
  index = 0,
  direction = "up",
  delay = 0,
  className,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion()
  const MotionTag = TAGS[as]

  if (reduce) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  const from =
    direction === "up"
      ? { y: OFFSET }
      : direction === "left"
        ? { x: -OFFSET }
        : direction === "right"
          ? { x: OFFSET }
          : {}

  const variants: Variants = {
    hidden: { opacity: 0, ...from },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.55,
        delay: delay + index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
    >
      {children}
    </MotionTag>
  )
}
