"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Mail, ArrowRight, Rss } from "lucide-react";
import Logo from "../assets/main_logo.png";

const QUICK_LINKS = [
  { name: "Home", href: "/" },
  { name: "Trending", href: "/" },
  { name: "Latest Articles", href: "/" },
  { name: "About Us", href: "/about-us" },
  { name: "Contact", href: "/contact" },
  { name: "Editorial Policy", href: "/editorial-policy" },
];

const CATEGORIES = [
  { name: "Cricket", href: "/sports/cricket" },
  { name: "Football", href: "/sports/football" },
  { name: "Bollywood", href: "/entertainment/bollywood" },
  { name: "Hollywood", href: "/entertainment/hollywood" },
  { name: "Sports", href: "/sports" },
  { name: "Entertainment", href: "/entertainment" },
];

const SOCIAL = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/sharer/sharer.php?u=https://blynter.com",
    color: "hover:bg-blue-600 hover:border-blue-600",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "Twitter / X",
    href: "https://twitter.com/blynter",
    color: "hover:bg-slate-800 hover:border-slate-800",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/blynter",
    color: "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 hover:border-pink-500",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.057-1.274-.07-1.649-.07-4.844 0-3.196.016-3.586.074-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/blynter",
    color: "hover:bg-blue-700 hover:border-blue-700",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const pathname = usePathname();

  // If in admin dashboard, do not render public footer
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <footer className="bg-secondary-900 dark:bg-secondary-950 text-secondary-300">

      {/* ── Main footer grid ── */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* Col 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" aria-label="Blynter home" className="inline-block mb-4 group">
              <Image
                src={Logo}
                alt="Blynter"
                height={48}
                width={160}
                className="h-10 sm:h-18 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-sm text-secondary-400 leading-relaxed mb-5 max-w-xs">
              Premium sports and entertainment editorial publication. Expert reporting on cricket, football, Bollywood, and Hollywood.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2.5">
              {SOCIAL.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className={`w-9 h-9 rounded-lg bg-secondary-800 border border-secondary-700 text-secondary-400 hover:text-white flex items-center justify-center transition-all duration-150 ${s.color}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-400 hover:text-white transition-colors duration-150 flex items-center gap-1.5 group"
                  >
                    <ArrowRight
                      size={12}
                      className="text-secondary-600 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all duration-150"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Categories
            </h3>
            <ul className="space-y-2.5">
              {CATEGORIES.map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={cat.href}
                    className="text-sm text-secondary-400 hover:text-white transition-colors duration-150 flex items-center gap-1.5 group"
                  >
                    <ArrowRight
                      size={12}
                      className="text-secondary-600 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all duration-150"
                    />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              Newsletter
            </h3>
            <p className="text-sm text-secondary-400 mb-4 leading-relaxed">
              Get the best stories delivered weekly. No spam, ever.
            </p>
            {subscribed ? (
              <div className="bg-accent-900/30 border border-accent-700/50 rounded-xl p-3 text-sm text-accent-400 font-medium text-center">
                🎉 You&apos;re subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <div className="relative">
                  <Mail
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500 pointer-events-none"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-secondary-800 border border-secondary-700 rounded-xl text-sm text-white placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors duration-150"
                >
                  Subscribe Free →
                </button>
              </form>
            )}

            {/* RSS */}
            <Link
              href="/rss.xml"
              className="flex items-center gap-2 mt-4 text-xs text-secondary-500 hover:text-orange-400 transition-colors"
            >
              <Rss size={13} />
              RSS Feed
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-secondary-800">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary-500">
            <p>© {currentYear} Blynter. All rights reserved.</p>
            <nav aria-label="Legal links">
              <ul className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
                {[
                  { name: "Privacy Policy", href: "/privacy-policy" },
                  { name: "Terms of Service", href: "/terms-condition" },
                  { name: "Disclaimer", href: "/disclaimer" },
                  { name: "About Us", href: "/about-us" },
                  { name: "Contact", href: "/contact" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors duration-150"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
