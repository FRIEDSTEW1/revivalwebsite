import { NavLink, Navigate, Outlet } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import { cn } from "@/lib/utils"

const tabs = [
  { to: "/admin", label: "Classes", end: true },
  { to: "/admin/team", label: "Team" },
  { to: "/admin/timetable", label: "Timetable" },
  { to: "/admin/faq", label: "FAQ" },
  { to: "/admin/content", label: "Page Content" },
  { to: "/admin/messages", label: "Messages" },
  { to: "/admin/newsletter", label: "Newsletter Subscribers" },
]

export function AdminLayout() {
  const { session, loading, signOut } = useAuth()

  if (loading) return <p className="py-24 text-center text-sm text-muted-foreground">Loading...</p>
  if (!session) return <Navigate to="/admin/login" replace />

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your website content and settings</p>
        </div>
        <Button variant="outline" onClick={() => signOut()}>
          Sign Out
        </Button>
      </div>

      <nav className="mb-8 flex flex-wrap gap-2 border-b border-border pb-4">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  )
}
