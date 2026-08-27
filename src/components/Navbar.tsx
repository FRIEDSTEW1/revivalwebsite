import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Menu, Moon, Sun } from "lucide-react"
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

function NavItem({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "text-sm font-medium transition-colors hover:text-foreground",
          isActive ? "text-foreground" : "text-muted-foreground"
        )
      }
    >
      {label}
    </NavLink>
  )
}

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2">
          <img src="/logo.jpeg" alt="Revival MMA logo" className="h-9 w-9 rounded-full object-cover" />
          <span className="font-serif text-lg font-bold tracking-tight">Revival MMA</span>
        </NavLink>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <NavItem key={l.to} {...l} />
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
            <NavLink to="/contact">Book Free Trial</NavLink>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle>Revival MMA</SheetTitle>
              <nav className="flex flex-col gap-5">
                {links.map((l) => (
                  <NavItem key={l.to} {...l} onClick={() => setOpen(false)} />
                ))}
              </nav>
              <SheetClose asChild>
                <Button asChild>
                  <NavLink to="/contact">Book Free Trial</NavLink>
                </Button>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
