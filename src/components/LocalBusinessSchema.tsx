import { Helmet } from "react-helmet-async"

export function LocalBusinessSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: "Revival MMA",
    alternateName: "Revival Mixed Martial Arts",
    description:
      "Harrow's largest dedicated martial arts academy. Boxing, kickboxing, BJJ and MMA for all ages.",
    image: "https://revivalmma.co.uk/logo-social.jpeg",
    telephone: "+447540467320",
    email: "info@revivalmma.co.uk",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Harrow",
      addressRegion: "Greater London",
      addressCountry: "GB",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "450",
    },
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  )
}
