import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "High-Speed Ceramic End Mills for Hardened Steel (HRC55–70) | QT TOOLS",
    template: "%s | QT TOOLS",
  },
  description:
    "Cut HRC60+ hardened steel up to 5X faster with QT TOOLS ceramic end mills. Reduce cycle time, improve surface finish, and extend tool life. Real case studies, cutting data for H13, SKD11, D2, P20, S136, and more. Free technical support and quotes within 24 hours.",
  keywords: [
    "ceramic end mills",
    "ceramic milling cutter",
    "high-speed hard milling",
    "HRC60 steel",
    "hardened steel machining",
    "mold and die machining",
    "SKD11",
    "H13",
    "D2",
    "P20",
    "S136",
    "cutting data",
    "tool life",
    "cycle time reduction",
    "QT TOOLS",
  ],
  applicationName: "QT TOOLS",
  category: "Manufacturing",
  authors: [{ name: "QT TOOLS" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "QT TOOLS",
    title: "High-Speed Ceramic End Mills for Hardened Steel (HRC55–70)",
    description:
      "5X faster cutting for HRC60+ hardened steel. Proven case studies, cutting parameters, and expert support from QT TOOLS.",
    images: [
      {
        url: "https://i.ytimg.com/vi/FSgYrxPHL34/hqdefault.jpg",
        width: 1280,
        height: 720,
        alt: "Ceramic end mill cutting demonstration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "High-Speed Ceramic End Mills for Hardened Steel (HRC55–70)",
    description:
      "Reduce cycle time and improve finish with QT TOOLS ceramic end mills. Cutting data and quotes within 24 hours.",
    images: ["https://i.ytimg.com/vi/FSgYrxPHL34/hqdefault.jpg"],
  },
  alternates: {
    canonical: "/",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-625061154"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-625061154');
            `,
          }}
        />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        {children}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "QT TOOLS",
              url: "/",
              sameAs: ["https://www.linkedin.com/in/linda-jiang-674190199/"],
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  contactType: "customer support",
                  email: "Linda@czqttools.com",
                  telephone: "+86 13915092693",
                  areaServed: "Worldwide",
                  availableLanguage: ["en", "zh"],
                },
              ],
              brand: { "@type": "Brand", name: "QT TOOLS" },
              offers: {
                "@type": "OfferCatalog",
                name: "Cutting tools",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: { "@type": "Product", name: "Ceramic End Mills", category: "Cutting Tool" },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: { "@type": "Product", name: "Carbide End Mills", category: "Cutting Tool" },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: { "@type": "Product", name: "PCD Tools", category: "Cutting Tool" },
                  },
                ],
              },
            }),
          }}
        />
      </body>
    </html>
  )
}
