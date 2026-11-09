import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Toaster } from "sonner"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export function Layout() {
  const { pathname } = useLocation()

  // Land at the top of each new page rather than keeping the old scroll offset.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main key={pathname} className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors position="top-center" />
    </div>
  )
}
