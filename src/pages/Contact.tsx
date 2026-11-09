import { Clock, Mail, MapPin, Phone } from "lucide-react"
import { SEO } from "@/components/SEO"
import { PageHeader } from "@/components/PageHeader"
import { ContactForm } from "@/components/ContactForm"

const details = [
  {
    icon: MapPin,
    label: "Find Us",
    value: "Harrow, Greater London, UK",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+44 7540 467 320",
    href: "tel:+447540467320",
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "info@revivalmma.co.uk",
    href: "mailto:info@revivalmma.co.uk",
  },
  {
    icon: Clock,
    label: "Class Times",
    value: "See the full weekly timetable",
    href: "/timetable",
  },
]

export function Contact() {
  return (
    <>
      <SEO
        title="Booking"
        path="/book"
        description="Request a trial class at Revival MMA in Harrow. Our team will help you choose a class and arrange your first session."
      />
      <PageHeader
        eyebrow="Booking"
        title="Book a Trial"
        subtitle="Tell us who the trial is for. We’ll be in touch to help you choose a class and confirm a time."
      />

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr]">
          <div
            className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-10 lg:col-start-2 lg:row-start-1"
          >
            <h2 className="font-serif text-2xl font-bold">Request a Trial</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Share your details and any questions you have about getting started.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
          <div className="flex flex-col gap-8 lg:col-start-1 lg:row-start-1">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {details.map(({ icon: Icon, label, value, href }) => (
                <li
                  key={label}
                  className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold-dark dark:text-gold">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {label}
                    </span>
                    {href ? (
                      <a
                        href={href}
                        className="mt-1 block break-words font-semibold transition-colors hover:text-gold-dark dark:hover:text-gold"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="mt-1 block break-words font-semibold">{value}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <div className="overflow-hidden rounded-xl border border-border shadow-sm">
              <iframe
                title="Revival MMA location"
                src="https://www.google.com/maps?q=Revival+MMA+Harrow&output=embed"
                className="h-72 w-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
