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
        title="Contact"
        description="Get in touch with Revival MMA. Book your free trial session or ask us a question."
      />
      <PageHeader
        eyebrow="Get In Touch"
        title="Book Your Free Trial"
        subtitle="Tell us about your goals and we'll get you on the mats. Contact us if you have any questions!"
      />

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr]">
          <div className="flex flex-col gap-8">
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

          <div className="rounded-xl border border-border bg-card p-8 shadow-sm sm:p-10">
            <h2 className="font-serif text-2xl font-bold">Send Us a Message</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We'll get back to you as soon as possible.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
