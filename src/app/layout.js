import { Inter, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ThemeProvider } from "../contexts/ThemeProvider";
import Script from "next/script";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import NavigationScrollToTop from "@/components/NavigationScrollToTop";
import { FLAGS, ADS_CONFIG, SITE } from "@/config/flags";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Blynter | Sports Stories, Movie Reviews & Entertainment",
    template: "%s | Blynter",
  },
  description:
    "From thrilling sports moments to honest movie reviews, Blynter covers stories that entertain and excite true fans. Expert analysis, breaking news, and in-depth coverage.",
  keywords: [
    "sports stories",
    "movie reviews",
    "entertainment news",
    "sports analysis",
    "film critiques",
    "celebrity gossip",
    "sports highlights",
    "box office updates",
    "TV show recaps",
    "pop culture trends",
    "cricket",
    "football",
    "bollywood",
    "hollywood",
  ],
  authors: [{ name: "Blynter Editorial Team", url: "https://blynter.com" }],
  creator: "Blynter",
  publisher: "Blynter",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}`,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "Blynter",
    title: "Blynter | Sports Stories, Movie Reviews & Entertainment",
    description:
      "Expert sports coverage, movie reviews, and entertainment news from Blynter's editorial team.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blynter | Sports Stories, Movie Reviews & Entertainment",
    description:
      "Expert sports coverage, movie reviews, and entertainment news from Blynter.",
    creator: "@blynter",
    site: "@blynter",
  },
  category: "sports entertainment",
};

export default function RootLayout({ children }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Blynter",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://blynter.com",
    logo: `${process.env.NEXT_PUBLIC_BASE_URL || "https://blynter.com"}/favicon.ico`,
    description:
      "Premium sports and entertainment editorial publication covering cricket, football, Bollywood, and Hollywood.",
    sameAs: [
      "https://www.facebook.com/blynter",
      "https://www.twitter.com/blynter",
      "https://www.instagram.com/blynter",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Blynter",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://blynter.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_BASE_URL || "https://blynter.com"}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="google-site-verification" content="xmHVbTYxLLVXUUpml3yyXdnSb4Lb8x3pw7z6be1dVQQ" />
        <script
          id="theme-initializer"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var isDark = theme === 'dark' || ((!theme || theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* AdSense — only loaded when ENABLE_ADS is true */}
        {FLAGS.ENABLE_ADS && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CONFIG.PUBLISHER_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <Script src="https://analytics.ahrefs.com/analytics.js" data-key="lGsIe0B6PtK7JYQEDfc0sw" async />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-70Z9XRZ4S2" strategy="afterInteractive" />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-70Z9XRZ4S2');
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-surface-light dark:bg-surface-dark text-secondary-900 dark:text-secondary-100`}
      >
        <ThemeProvider>
          <NavigationScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow">{children}</div>
            <Footer />
            <ScrollToTopButton />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
