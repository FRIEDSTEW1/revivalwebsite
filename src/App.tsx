import { Suspense, lazy } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "@/components/Layout"
import { AdminLayout } from "@/pages/admin/AdminLayout"
import { PageLoading } from "@/components/PageState"

const Home = lazy(() => import("@/pages/Home").then((m) => ({ default: m.Home })))
const Book = lazy(() => import("@/pages/Book").then((m) => ({ default: m.Book })))
const About = lazy(() => import("@/pages/About").then((m) => ({ default: m.About })))
const Classes = lazy(() => import("@/pages/Classes").then((m) => ({ default: m.Classes })))
const Team = lazy(() => import("@/pages/Team").then((m) => ({ default: m.Team })))
const Timetable = lazy(() => import("@/pages/Timetable").then((m) => ({ default: m.Timetable })))
const FAQ = lazy(() => import("@/pages/FAQ").then((m) => ({ default: m.FAQ })))
const Contact = lazy(() => import("@/pages/Contact").then((m) => ({ default: m.Contact })))
const Newsletter = lazy(() => import("@/pages/Newsletter").then((m) => ({ default: m.Newsletter })))
const Terms = lazy(() => import("@/pages/Terms").then((m) => ({ default: m.Terms })))
const NotFound = lazy(() => import("@/pages/NotFound").then((m) => ({ default: m.NotFound })))

const AdminLogin = lazy(() => import("@/pages/admin/Login").then((m) => ({ default: m.AdminLogin })))
const Dashboard = lazy(() => import("@/pages/admin/Dashboard").then((m) => ({ default: m.Dashboard })))
const ManageClasses = lazy(() => import("@/pages/admin/ManageClasses").then((m) => ({ default: m.ManageClasses })))
const ManageTeam = lazy(() => import("@/pages/admin/ManageTeam").then((m) => ({ default: m.ManageTeam })))
const ManageTestimonials = lazy(() =>
  import("@/pages/admin/ManageTestimonials").then((m) => ({ default: m.ManageTestimonials }))
)
const ManageBookingClasses = lazy(() =>
  import("@/pages/admin/ManageBookingClasses").then((m) => ({ default: m.ManageBookingClasses }))
)
const BookingRequests = lazy(() =>
  import("@/pages/admin/BookingRequests").then((m) => ({ default: m.BookingRequests }))
)
const ManageTimetable = lazy(() =>
  import("@/pages/admin/ManageTimetable").then((m) => ({ default: m.ManageTimetable }))
)
const ManageFAQ = lazy(() => import("@/pages/admin/ManageFAQ").then((m) => ({ default: m.ManageFAQ })))
const ManagePageContent = lazy(() =>
  import("@/pages/admin/ManagePageContent").then((m) => ({ default: m.ManagePageContent }))
)
const Messages = lazy(() => import("@/pages/admin/Messages").then((m) => ({ default: m.Messages })))
const NewsletterSubscribers = lazy(() =>
  import("@/pages/admin/NewsletterSubscribers").then((m) => ({ default: m.NewsletterSubscribers }))
)

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="classes" element={<Classes />} />
            <Route path="book" element={<Book />} />
            <Route path="team" element={<Team />} />
            <Route path="timetable" element={<Timetable />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="contact" element={<Contact />} />
            <Route path="newsletter" element={<Newsletter />} />
            <Route path="terms" element={<Terms />} />

            <Route path="admin/login" element={<AdminLogin />} />
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="classes" element={<ManageClasses />} />
              <Route path="team" element={<ManageTeam />} />
              <Route path="testimonials" element={<ManageTestimonials />} />
              <Route path="booking-classes" element={<ManageBookingClasses />} />
              <Route path="booking-requests" element={<BookingRequests />} />
              <Route path="timetable" element={<ManageTimetable />} />
              <Route path="faq" element={<ManageFAQ />} />
              <Route path="content" element={<ManagePageContent />} />
              <Route path="messages" element={<Messages />} />
              <Route path="newsletter" element={<NewsletterSubscribers />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
