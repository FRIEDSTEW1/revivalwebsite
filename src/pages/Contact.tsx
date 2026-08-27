import { Mail, MapPin, Phone } from "lucide-react"
import { SEO } from "@/components/SEO"
import { ContactForm } from "@/components/ContactForm"

export function Contact() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <SEO
        title="Contact"
        description="Get in touch with Revival MMA. Book your free trial session or ask us a question."
      />

      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl font-bold sm:text-5xl">Get In Touch</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Contact us if you have any questions! Book your free trial session today.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span>Harrow, Greater London, UK</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <a href="tel:+447540467320" className="hover:underline">+44 7540 467 320</a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <a href="mailto:info@revivalmma.co.uk" className="hover:underline">info@revivalmma.co.uk</a>
            </li>
          </ul>

          <div className="aspect-video w-full overflow-hidden rounded-lg border border-border">
            <iframe
              title="Revival MMA location"
              src="https://www.google.com/maps?q=Revival+MMA+Harrow&output=embed"
              className="h-full w-full"
              loading="lazy"
            />
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  )
}
