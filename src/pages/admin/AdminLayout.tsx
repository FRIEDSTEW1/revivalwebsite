import { useEffect, useState } from "react"
import { NavLink, Navigate, Outlet } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import { countRows } from "@/lib/adminApi"
import { isSupabaseConfigured } from "@/lib/supabase"
import { cn } from "@/lib/utils"

interface AdminTab {
  to: string
  label: string
  end?: boolean
  badge?: "unread" | "pending"
}

const tabs: AdminTab[] = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/classes", label: "Classes" },
  { to: "/admin/team", label: "Team" },
  { to: "/admin/testimonials", label: "Testimonials" },
  { to: "/admin/timetable", label: "Timetable" },
  { to: "/admin/booking-classes", label: "Booking Classes" },
  { to: "/admin/booking-requests", label: "Booking Requests", badge: "pending" },
  { to: "/admin/faq", label: "FAQ" },
  { to: "/admin/content", label: "Page Content" },
  { to: "/admin/messages", label: "Messages", badge: "unread" },
  { to: "/admin/newsletter", label: "Newsletter Subscribers" },
]

export function AdminLayout() {
  const { session, loading, signOut } = useAuth()
  const [unread, setUnread] = useState(0)
  const [pending, setPending] = useState(0)

  useEffect(() => {
    if (!session || !isSupabaseConfigured) return
    countRows("contact_submissions", { column: "read", value: false })
      .then(setUnread)
      .catch(() => {})
    countRows("booking_requests", { column: "payment_status", value: "pending" })
      .then(setPending)
      .catch(() => {})
  }, [session])

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
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              )
            }
          >
            {tab.label}
            {tab.badge === "unread" && unread > 0 && (
              <span className="rounded-full bg-gold px-1.5 py-0.5 text-[10px] font-bold leading-none text-gray-900">
                {unread}
              </span>
            )}
            {tab.badge === "pending" && pending > 0 && (
              <span className="rounded-full bg-gold px-1.5 py-0.5 text-[10px] font-bold leading-none text-gray-900">
                {pending}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  )
}
