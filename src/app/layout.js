import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ThemeProvider } from "../contexts/ThemeProvider";
import Script from "next/script";
import ClickSpark from "@/components/ClickSpark";
import ScrollToTopButton from "@/components/ScrollToTopButton"; // Import the ScrollToTopButton component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Blynter | Sports Stories, Movie Reviews & Entertainment",
  description: "From thrilling sports moments to honest movie reviews, Blynter covers stories that entertain and excite true fans.",
  keywords: ["sports stories", "movie reviews", "entertainment news", "sports analysis", "film critiques", "celebrity gossip", "sports highlights", "box office updates", "TV show recaps", "pop culture trends"],
  robots: {
    index: true,        // true = index, false = noindex
    follow: true,       // true = follow, false = nofollow
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
    site_name: "blynter",
    // images: [blogDetails?.heroImage?.url || ""],
  },
  publisher: "blynter"
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2234384779164146"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js"
          async
          custom-element="amp-auto-ads"
        />
        <Script src="https://analytics.ahrefs.com/analytics.js" data-key="lGsIe0B6PtK7JYQEDfc0sw" async />
      </head>
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-70Z9XRZ4S2"></script>
      <script dangerouslySetInnerHTML={{
        __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-70Z9XRZ4S2');
`}} />
<meta name="google-site-verification" content="xmHVbTYxLLVXUUpml3yyXdnSb4Lb8x3pw7z6be1dVQQ" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        <ThemeProvider>
          <ClickSpark
            sparkColor="#3b82f6"
            sparkSize={10}
            sparkRadius={15}
            sparkCount={8}
            duration={400}
          >
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex-grow">{children}</div>
              <Footer />
              <ScrollToTopButton /> {/* Add the ScrollToTopButton here */}
            </div>
          </ClickSpark>
        </ThemeProvider>
      </body>
    </html>
  );
}
