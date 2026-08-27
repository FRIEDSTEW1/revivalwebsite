import { Link } from "react-router-dom"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Heart,
  Phone,
  Star,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react"
import { SEO } from "@/components/SEO"
import { LocalBusinessSchema } from "@/components/LocalBusinessSchema"
import { Button } from "@/components/ui/button"
import { ClassCard } from "@/components/ClassCard"
import { TestimonialCard } from "@/components/TestimonialCard"
import { SectionHeading } from "@/components/SectionHeading"
import { Reveal } from "@/components/motion/Reveal"
import { CountUp } from "@/components/motion/CountUp"
import { PageError, PageLoading } from "@/components/PageState"
import { useAsync } from "@/lib/hooks"
import { getClasses, getTestimonials } from "@/lib/data"

const HERO_IMAGE =
  "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695f7c8c8199f9e9838f4724/4b3e4e883_ChatGPTImageJan8202607_14_30PM.png"

const features = [
  { icon: Users, title: "Expert Coaches", description: "Fully qualified, DBS certified coaches with 10+ years experience" },
  { icon: Trophy, title: "All Ages & Levels", description: "From toddlers to adults, beginners to advanced athletes" },
  { icon: Zap, title: "Specialist Facility", description: "Largest martial arts academy in Harrow with extensive training areas" },
  { icon: Heart, title: "Personal Growth", description: "Build confidence, discipline, and mental resilience" },
  { icon: Star, title: "Over 450 5-Star Reviews", description: "Trusted by hundreds of satisfied members on Google" },
  { icon: Target, title: "Results Driven", description: "Proven methods to help you achieve your goals" },
]

const stats = [
  { value: "500+", label: "Active Members" },
  { value: "5+", label: "Experienced Coaches" },
  { value: "15+", label: "Years Experience" },
  { value: "35+", label: "Classes Weekly" },
]

function Hero() {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  // Very light parallax — the photo drifts a touch slower than the page.
  const y = useTransform(scrollY, [0, 700], [0, reduce ? 0 : 90])

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
        }

  return (
    <section className="relative isolate overflow-hidden bg-surface">
      <motion.img
        src={HERO_IMAGE}
        alt=""
        aria-hidden
        style={{ y }}
        className="absolute inset-0 -z-10 h-[115%] w-full object-cover object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-white via-white/85 to-white/30 dark:from-gray-950 dark:via-gray-950/90 dark:to-gray-950/40"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-background to-transparent"
      />

      <div className="mx-auto flex min-h-[clamp(560px,82vh,780px)] max-w-7xl flex-col justify-center px-5 py-24 sm:px-8">
        <div className="max-w-2xl">
          <motion.span
            {...rise(0)}
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-gold-dark dark:text-gold"
          >
            Rising Above Excellence
          </motion.span>

          <motion.h1
            {...rise(0.09)}
            className="mt-7 font-serif text-[clamp(2.75rem,7vw,4.75rem)] font-bold leading-[1.03]"
          >
            Transform Your
            <br />
            Body &amp; <span className="text-gold-gradient">Mind</span>
          </motion.h1>

          <motion.p
            {...rise(0.18)}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Premier martial arts and fitness training. Learn from specialist coaches in the heart
            of Harrow. All ages, all levels.
          </motion.p>

          <motion.div {...rise(0.27)} className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/contact">
                <CalendarDays className="h-4 w-4" />
                Get Started Today
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="tel:+447540467320">
                <Phone className="h-4 w-4" />
                Call Now
              </a>
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#why"
        {...(reduce
          ? {}
          : {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 0.9, duration: 0.6 },
            })}
        className="absolute inset-x-0 bottom-7 mx-auto flex w-fit flex-col items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-gold-dark dark:hover:text-gold"
      >
        Scroll to explore
        <ChevronDown className="animate-bob h-4 w-4" />
      </motion.a>
    </section>
  )
}

export function Home() {
  const { data: classes, loading: classesLoading, error: classesError } = useAsync(getClasses)
  const {
    data: testimonials,
    loading: testimonialsLoading,
    error: testimonialsError,
  } = useAsync(getTestimonials)

  return (
    <>
      <SEO
        title="Revival MMA Hub"
        description="Harrow's largest dedicated martial arts academy. Boxing, kickboxing, BJJ and MMA for all ages. Book your free trial session today."
      />
      <LocalBusinessSchema />

      <Hero />

      <section id="why" className="scroll-mt-24 bg-surface py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading
              title="Why Choose Revival?"
              subtitle="Everything you need to transform your life"
            />
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }, i) => (
              <Reveal key={title} index={i} as="article">
                <div className="card-lift group h-full rounded-xl border border-border bg-card p-7 shadow-sm">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 text-gold-dark transition-all duration-300 group-hover:scale-110 group-hover:bg-gold/20 dark:text-gold">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 font-serif text-xl font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-background py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-5 sm:px-8 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} index={i} className="text-center">
              <CountUp
                value={s.value}
                className="block font-sans text-[clamp(2.25rem,5vw,3.25rem)] font-extrabold leading-none text-gold-gradient tabular-nums"
              />
              <p className="mt-2.5 text-sm font-medium text-muted-foreground">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading
              title="Our Classes"
              subtitle="Choose from our diverse range of training programs"
            />
          </Reveal>

          {classesLoading && <PageLoading />}
          {classesError && <PageError message={classesError} />}
          {classes && (
            <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {classes.slice(0, 6).map((c, i) => (
                <Reveal key={c.id} index={i}>
                  <ClassCard gymClass={c} />
                </Reveal>
              ))}
            </div>
          )}

          <Reveal className="mt-12 flex justify-center">
            <Button asChild size="lg" variant="outline">
              <Link to="/classes">
                View All Classes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Over 450 5-Star Reviews"
              title="What Our Members Say"
              subtitle="Real Google Reviews from our community"
            />
          </Reveal>

          {testimonialsLoading && <PageLoading />}
          {testimonialsError && <PageError message={testimonialsError} />}
          {testimonials && (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 6).map((t, i) => (
                <Reveal key={t.id} index={i}>
                  <TestimonialCard testimonial={t} />
                </Reveal>
              ))}
            </div>
          )}

          <Reveal className="mt-12 flex justify-center">
            <Button asChild variant="link">
              <a
                href="https://www.google.com/search?q=Revival+MMA+Harrow+reviews"
                target="_blank"
                rel="noreferrer"
              >
                Read More Reviews on Google
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gray-900 py-24 dark:bg-gray-950">
        <div
          aria-hidden
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold/20 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl"
        />

        <Reveal className="relative mx-auto flex max-w-3xl flex-col items-center gap-7 px-5 text-center sm:px-8">
          <h2 className="font-serif text-[clamp(2rem,5vw,3rem)] font-bold leading-tight text-white">
            Ready to Start Your Journey?
          </h2>
          <p className="max-w-xl text-lg leading-relaxed text-gray-300">
            Join hundreds of members who are already achieving their goals. Start your martial
            arts journey today.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/contact">
                <CalendarDays className="h-4 w-4" />
                Book Your Free Trial
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/25 bg-transparent text-white hover:border-gold hover:bg-white/5 hover:text-gold"
            >
              <Link to="/timetable">View Timetable</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  )
}
