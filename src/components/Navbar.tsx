import { useEffect, useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { CalendarDays, Menu, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { useTheme } from "@/lib/theme"
import { cn } from "@/lib/utils"

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/classes", label: "Classes" },
  { to: "/timetable", label: "Timetable" },
  { to: "/team", label: "Team" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
]

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <img
        src="/logo.jpeg"
        alt="Revival MMA"
        className="h-11 w-11 rounded-full object-cover ring-1 ring-gold/40"
      />
      <span className="flex flex-col leading-none">
        <span className="font-sans text-xl font-extrabold tracking-[0.14em] text-gold-dark dark:text-gold">
          REVIVAL
        </span>
        {!compact && (
          <span className="mt-1 text-[11px] font-medium tracking-wide text-gold-dark/80 dark:text-gold/80">
            Rising above excellence
          </span>
        )}
      </span>
    </span>
  )
}

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-all duration-300",
        scrolled
          ? "border-border bg-background/85 backdrop-blur-xl shadow-sm"
          : "border-transparent bg-background"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <NavLink to="/" aria-label="Revival MMA — home">
          <Logo />
        </NavLink>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "relative py-1 text-sm font-medium transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:bg-gold after:transition-all",
                  isActive
                    ? "text-foreground after:w-full"
                    : "text-muted-foreground after:w-0 hover:text-foreground hover:after:w-full"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button asChild className="hidden sm:inline-flex">
            <NavLink to="/contact">
              <CalendarDays className="h-4 w-4" />
              Get Started
            </NavLink>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <Logo />
              <nav className="mt-2 flex flex-col gap-1" aria-label="Mobile">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.to === "/"}
                    className={({ isActive }) =>
                      cn(
                        "rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors",
                        isActive
                          ? "bg-accent text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
              </nav>
              <SheetClose asChild>
                <Button asChild size="lg" className="mt-auto">
                  <NavLink to="/contact">
                    <CalendarDays className="h-4 w-4" />
                    Get Started
                  </NavLink>
                </Button>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
