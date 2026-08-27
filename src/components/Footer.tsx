import { Link } from "react-router-dom"
import { Mail, MapPin, Phone } from "lucide-react"
import { Logo } from "@/components/Navbar"

const quickLinks = [
  { to: "/classes", label: "Classes" },
  { to: "/timetable", label: "Timetable" },
  { to: "/team", label: "Team" },
  { to: "/faq", label: "FAQ" },
]

const companyLinks = [
  { to: "/about", label: "About" },
  { to: "/newsletter", label: "Newsletter" },
  { to: "/terms", label: "Terms & Conditions" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Harrow's largest dedicated martial arts academy. Premium training with fully
            qualified coaches, for every age and every level.
          </p>
        </div>

        <nav aria-labelledby="footer-quick">
          <h2
            id="footer-quick"
            className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-gold-dark dark:text-gold"
          >
            Quick Links
          </h2>
          <ul className="mt-5 space-y-3 text-sm">
            {quickLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-company">
          <h2
            id="footer-company"
            className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-gold-dark dark:text-gold"
          >
            Company
          </h2>
          <ul className="mt-5 space-y-3 text-sm">
            {companyLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-gold-dark dark:text-gold">
            Get In Touch
          </h2>
          <ul className="mt-5 space-y-3.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark dark:text-gold" />
              Harrow, Greater London, UK
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark dark:text-gold" />
              <a href="tel:+447540467320" className="transition-colors hover:text-foreground">
                +44 7540 467 320
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark dark:text-gold" />
              <a
                href="mailto:info@revivalmma.co.uk"
                className="break-all transition-colors hover:text-foreground"
              >
                info@revivalmma.co.uk
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-5 py-6 text-center text-xs text-muted-foreground sm:px-8">
          © {new Date().getFullYear()} Revival MMA. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
