import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ShieldCheck, Sparkles, Trophy, HeartPulse, Star, ArrowRight } from "lucide-react"
import { SEO } from "@/components/SEO"
import { LocalBusinessSchema } from "@/components/LocalBusinessSchema"
import { Button } from "@/components/ui/button"
import { ClassCard } from "@/components/ClassCard"
import { TestimonialCard } from "@/components/TestimonialCard"
import { PageError, PageLoading } from "@/components/PageState"
import { useAsync } from "@/lib/hooks"
import { getClasses, getTestimonials } from "@/lib/data"

const features = [
  {
    icon: Trophy,
    title: "State-of-the-Art Facility",
    description: "Harrow's largest dedicated martial arts academy with full equipment.",
  },
  {
    icon: ShieldCheck,
    title: "Safe Training Environment",
    description: "All our coaches are background checked and certified to work with all age groups.",
  },
  {
    icon: Sparkles,
    title: "Excellence in Technique",
    description: "Our coaching team has over a decade of proven martial arts experience.",
  },
  {
    icon: HeartPulse,
    title: "DBS Certified Coaches",
    description: "Every coach maintains current first aid and CPR certifications.",
  },
]

export function Home() {
  const { data: classes, loading: classesLoading, error: classesError } = useAsync(getClasses)
  const { data: testimonials, loading: testimonialsLoading, error: testimonialsError } = useAsync(getTestimonials)

  return (
    <>
      <SEO
        title="Revival MMA Hub"
        description="Your central hub for everything Revival MMA. Track classes, view schedules, and connect with the community."
      />
      <LocalBusinessSchema />

      <section
        className="relative overflow-hidden bg-black bg-cover bg-center text-white"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.55)), url('https://i.postimg.cc/N0KYy9CC/580056879-18072974534339951-8645562625290511311-n.jpg')",
        }}
      >
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-28 sm:px-6 sm:py-36">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground/80"
          >
            Rise Above Excellence
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-2xl font-serif text-4xl font-bold leading-tight sm:text-6xl"
          >
            Transform Your Body & Mind
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-xl text-lg text-white/80"
          >
            Premier martial arts and fitness training. Learn from specialist coaches in the
            heart of Harrow. All ages, all levels.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
              <Link to="/contact">Book Your Free Trial Session Today</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white hover:text-black">
              <Link to="/classes">View All Classes</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10 flex flex-col gap-2 text-center">
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">Our Classes</h2>
          <p className="text-muted-foreground">
            Choose from our diverse range of training programs. Find the perfect class for your
            goals and experience level — from toddlers to adults, beginners to advanced athletes.
          </p>
        </div>

        {classesLoading && <PageLoading />}
        {classesError && <PageError message={classesError} />}
        {classes && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {classes.slice(0, 6).map((c) => (
              <ClassCard key={c.id} gymClass={c} />
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Button asChild size="lg" variant="outline">
            <Link to="/classes" className="gap-2">
              View All Classes <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-10 flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <h2 className="font-serif text-3xl font-bold sm:text-4xl">What Our Members Say</h2>
            <p className="text-muted-foreground">Real Google Reviews from our community</p>
            <p className="text-sm font-semibold">
              Over 450 5-Star Reviews — Trusted by hundreds of satisfied members on Google
            </p>
          </div>

          {testimonialsLoading && <PageLoading />}
          {testimonialsError && <PageError message={testimonialsError} />}
          {testimonials && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 6).map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          )}

          <div className="mt-10 flex justify-center">
            <Button asChild variant="link">
              <a
                href="https://www.google.com/search?q=Revival+MMA+Harrow+reviews"
                target="_blank"
                rel="noreferrer"
              >
                Read More Reviews on Google →
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6">
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">Ready to Start Your Journey?</h2>
          <p className="max-w-xl text-primary-foreground/80">
            Join hundreds of members who are already achieving their goals. Start your martial
            arts journey today.
          </p>
          <Button asChild size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary">
            <Link to="/contact">Book Your Free Trial</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
