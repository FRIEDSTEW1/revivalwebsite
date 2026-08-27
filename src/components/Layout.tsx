import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { Toaster } from "sonner"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export function Layout() {
  const { pathname } = useLocation()
  const reduce = useReducedMotion()

  // Land at the top of each new page rather than keeping the old scroll offset.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <motion.main
        key={pathname}
        className="flex-1"
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <Outlet />
      </motion.main>
      <Footer />
      <Toaster richColors position="top-center" />
    </div>
  )
}
