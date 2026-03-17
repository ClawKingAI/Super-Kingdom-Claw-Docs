# SEO and Schema Markup

## Meta Tags

Add to `index.html`:

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Plum Bob – Septic, Sewer and Water Services | Senoia, GA</title>
  <meta name="description" content="Professional septic, sewer, and water line services in Senoia, GA. Fast response, honest work. Call 470-215-4009 for a free quote." />
  
  <!-- Open Graph -->
  <meta property="og:title" content="Plum Bob – Septic, Sewer and Water Services" />
  <meta property="og:description" content="Professional septic, sewer, and water line services in Senoia, GA. Fast response, honest work." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://plumbob.here.now/" />
  <meta property="og:image" content="https://plumbob.here.now/og-image.png" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Plum Bob – Septic, Sewer and Water Services" />
  <meta name="twitter:description" content="Professional septic, sewer, and water line services in Senoia, GA." />
</head>
```

## LocalBusiness Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Plumber",
  "name": "Plum Bob – Septic, Sewer and Water Services LLC",
  "image": "https://plumbob.here.now/logo.png",
  "telephone": "+1-470-215-4009",
  "email": "bbertholf12@icloud.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "210 Wagon Wheels Trail",
    "addressLocality": "Senoia",
    "addressRegion": "GA",
    "postalCode": "30276",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 33.3048,
    "longitude": -84.5543
  },
  "url": "https://plumbob.here.now",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "08:00",
    "closes": "18:00"
  },
  "priceRange": "$$",
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": 33.3048,
      "longitude": -84.5543
    },
    "geoRadius": "30"
  },
  "serviceType": ["Septic System Services", "Sewer Services", "Water Line Services", "Emergency Plumbing"]
}
</script>
```

## Target Keywords

Primary:
- plumber Senoia GA
- septic services Senoia GA
- sewer repair Senoia GA
- water line repair Senoia

Secondary:
- septic tank inspection Senoia
- emergency plumber Senoia
- drain field repair Senoia
- sewer line cleaning Senoia

## Performance Checklist

- [ ] Images under 200KB
- [ ] WebP format for hero images
- [ ] Lazy loading on below-fold images
- [ ] Preconnect to external domains
- [ ] Minify CSS/JS in production
- [ ] Use `loading="lazy"` on iframes
- [ ] Add `width` and `height` to images
