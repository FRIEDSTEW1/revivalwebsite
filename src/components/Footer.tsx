import { Link } from "react-router-dom"
import { Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <img src="/logo.jpeg" alt="Revival MMA logo" className="h-9 w-9 rounded-full object-cover" />
            <span className="font-serif text-lg font-bold">Revival MMA</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Rise above excellence.</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/classes" className="hover:text-foreground">Classes</Link></li>
            <li><Link to="/timetable" className="hover:text-foreground">Timetable</Link></li>
            <li><Link to="/team" className="hover:text-foreground">Team</Link></li>
            <li><Link to="/faq" className="hover:text-foreground">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Company
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/newsletter" className="hover:text-foreground">Newsletter</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Contact
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" /> Harrow, Greater London, UK
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" />
              <a href="tel:+447540467320" className="hover:text-foreground">+44 7540 467 320</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              <a href="mailto:info@revivalmma.co.uk" className="hover:text-foreground">info@revivalmma.co.uk</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Revival MMA. All rights reserved.
      </div>
    </footer>
  )
}
