"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "../contexts/ThemeProvider";
import Logo from "../assets/main_logo.png";
import {
  Search, Moon, Sun, Menu, X, ChevronDown,
  TrendingUp, Clock, Mail, Flame
} from "lucide-react";
import { getAllBlogPosts } from "@/services/blogServices";
import { textToSlug } from "@/helper/helper";

const NAV_CATEGORIES = [
  // {
  //   name: "Sports",
  //   icon: "🏆",
  //   href: "/sports",
  //   sub: [
  //     { name: "Cricket", href: "/sports/cricket", icon: "🏏" },
  //     // { name: "Football", href: "/sports/football", icon: "⚽" },
  //   ],
  // },
  // {
  //   name: "Entertainment",
  //   icon: "🎬",
  //   href: "/entertainment",
  //   sub: [
  //     { name: "Bollywood", href: "/entertainment/bollywood", icon: "🎭" },
  //     { name: "Hollywood", href: "/entertainment/hollywood", icon: "⭐" },
  //   ],
  // },
  {
    name: "Finance",
    icon: "📈",
    href: "/finance",
    sub: [
      { name: "Personal Finance", href: "/finance/personal-finance", icon: "💵" },
    ],
  },
];

const NAV_LINKS = [
  { name: "Trending", href: "/", icon: TrendingUp },
];

const STATIC_TICKER_ITEMS = [
  { text: "India vs Australia: 3rd Test Day 2 Live Updates", href: "/sports/cricket" },
  { text: "Rohit Sharma hits century in historic chase", href: "/sports/cricket" },
  { text: "Bollywood Box Office: Week 28 Roundup", href: "/entertainment/bollywood" },
  { text: "Champions League Draw: Group Stage Set", href: "/sports/football" },
  { text: "Spider-Man 4 officially confirmed by Marvel", href: "/entertainment/hollywood" },
];

const safe = (arr) => (Array.isArray(arr) ? arr : []);

export default function Header() {
  const pathname = usePathname();



  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const { theme, setTheme } = useTheme();
  const searchRef = useRef(null);
  const headerRef = useRef(null);
  const [tickerItems, setTickerItems] = useState([]);

  useEffect(() => {
    async function fetchTickerPosts() {
      try {
        const postsData = await getAllBlogPosts({ preview: true });
        const posts = safe(postsData).slice(0, 10);
        if (posts.length > 0) {
          const formatted = posts.map((post) => {
            const title = post?.heroTitle || "";
            const category = Array.isArray(post?.category) ? post.category[0] : post?.category || "";
            const subCat = Array.isArray(post?.subCatgory) ? post.subCatgory[0] : post?.subCatgory || "";
            const blogSlug = post?.slug || textToSlug(title);
            const catSlug = textToSlug(category);
            const subCatSlug = textToSlug(subCat);
            const href = `/${catSlug}/${subCatSlug}/${blogSlug}`;
            return { text: title, href };
          });
          setTickerItems([...formatted, ...formatted]);
        }
      } catch (error) {
        console.error("Error fetching blog posts for header ticker:", error);
      }
    }
    fetchTickerPosts();
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      const winH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(winH > 0 ? Math.min(100, (window.scrollY / winH) * 100) : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen) searchRef.current?.focus();
  }, [isSearchOpen]);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setIsMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const closeAll = () => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setOpenDropdown(null);
  };

  const handleNewsletterClick = (e) => {
    closeAll();
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      const el = document.getElementById("newsletter");
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", "/#newsletter");
      }
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  // If in admin dashboard, do not render public header
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <div
        id="reading-progress"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <header
        ref={headerRef}
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
          ? "bg-white/95 dark:bg-secondary-900/95 backdrop-blur-md shadow-nav border-b border-secondary-200 dark:border-secondary-200"
          : "bg-white dark:bg-secondary-900 border-b border-secondary-200"
          }`}
      >
        {/* ── Top bar ── */}
        <div className="hidden lg:block bg-secondary-900 dark:bg-secondary-950 text-secondary-300 py-1.5">
          <div className="max-w-8xl mx-auto px-6 flex items-center justify-between text-xs">
            {tickerItems?.length > 0 && <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="flex items-center gap-1 font-semibold text-white shrink-0">
                <Flame size={12} className="text-red-400" />
                TRENDING:
              </span>
              <div className="ticker-wrapper flex-1 overflow-hidden">
                <span
                  className="ticker-track gap-8 text-secondary-300 hover:text-white transition-colors"
                  style={{ animationDuration: `${tickerItems.length * 6 || 30}s` }}
                >
                  {tickerItems.map((item, i) => (
                    <Link key={i} href={item.href} className="hover:text-primary-400 hover:underline inline-block transition-colors">
                      {item.text}&nbsp;&nbsp;·&nbsp;&nbsp;
                    </Link>
                  ))}
                </span>
              </div>
            </div>}
            <div className="flex items-center gap-4 shrink-0 ml-4">
              <time className="text-secondary-400" dateTime={new Date().toISOString().split("T")[0]}>
                {new Date().toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
              </time>
            </div>
          </div>
        </div>

        {/* ── Main nav ── */}
        <nav className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" onClick={closeAll} aria-label="Blynter Home" className="flex-shrink-0 group">
              <Image
                src={Logo}
                alt="Blynter"
                height={50}
                width={175}
                priority
                className="h-11 sm:h-18 w-auto object-contain transition-opacity duration-200 group-hover:opacity-80"
              />
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Categories with dropdowns */}
              {NAV_CATEGORIES.map((cat) => (
                <div
                  key={cat.name}
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown(cat.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${openDropdown === cat.name
                      ? "text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/20"
                      : "text-secondary-700 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-50 dark:hover:bg-secondary-800"
                      }`}
                    aria-expanded={openDropdown === cat.name}
                    aria-haspopup="true"
                  >
                    <span>{cat.name}</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${openDropdown === cat.name ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown */}
                  {cat?.sub?.length > 0 && <div
                    className={`absolute top-full left-0 mt-1 w-48 bg-white dark:bg-secondary-800 rounded-xl shadow-dropdown border border-secondary-100 dark:border-secondary-700 overflow-hidden transition-all duration-200 origin-top ${openDropdown === cat.name
                      ? "opacity-100 scale-100 pointer-events-auto"
                      : "opacity-0 scale-95 pointer-events-none"
                      }`}
                  >
                    <div className="py-1.5">
                      {cat?.sub?.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={closeAll}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-primary-50 dark:hover:bg-secondary-700 hover:text-primary-700 dark:hover:text-primary-400 transition-colors duration-100"
                        >
                          <span className="text-base">{item.icon}</span>
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>}
                </div>
              ))}

              {/* Static links */}
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={closeAll}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-50 dark:hover:bg-secondary-800 rounded-lg transition-all duration-150"
                >
                  <link.icon size={14} />
                  <span>{link.name}</span>
                </Link>
              ))}

              <Link
                href="/contact"
                onClick={closeAll}
                className="px-3 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-50 dark:hover:bg-secondary-800 rounded-lg transition-all duration-150"
              >
                Contact
              </Link>
            </div>

            {/* ── Desktop Actions ── */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Search */}
              {/* <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-lg text-secondary-500 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-all duration-150"
                aria-label="Toggle search"
              >
                <Search size={18} />
              </button> */}

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-secondary-500 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-all duration-150"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Newsletter CTA */}
              <Link
                href="/#newsletter"
                onClick={handleNewsletterClick}
                className="btn-primary"
                aria-label="Subscribe to newsletter"
              >
                <Mail size={14} />
                <span>Subscribe</span>
              </Link>
            </div>

            {/* ── Mobile Actions ── */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-lg text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* ── Search Bar ── */}
          <div
            className={`overflow-hidden transition-all duration-300 ${isSearchOpen ? "max-h-20 pb-3 opacity-100" : "max-h-0 opacity-0"
              }`}
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400"
                aria-hidden="true"
              />
              <input
                ref={searchRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 text-secondary-900 dark:text-white placeholder-secondary-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                aria-label="Search articles"
              />
            </form>
          </div>
        </nav>

        {/* ── Mobile Menu Overlay ── */}
        <div
          id="mobile-menu"
          className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          style={{ top: "var(--header-height, 64px)" }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-secondary-900/60 backdrop-blur-sm"
            onClick={closeAll}
            aria-hidden="true"
          />

          {/* Menu panel */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-secondary-900 shadow-2xl transform transition-transform duration-300 overflow-y-auto ${isMenuOpen ? "translate-x-0" : "translate-x-full"
              }`}
          >
            <div className="px-4 py-6 space-y-1">
              {/* Home */}
              <Link
                href="/"
                onClick={closeAll}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-secondary-900 dark:text-white hover:bg-primary-50 dark:hover:bg-secondary-800 transition-colors"
              >
                🏠 Home
              </Link>

              {/* Categories */}
              {NAV_CATEGORIES.map((cat) => (
                <div key={cat.name}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === cat.name ? null : cat.name)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold text-secondary-900 dark:text-white hover:bg-primary-50 dark:hover:bg-secondary-800 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <span>{cat.icon}</span>
                      {cat.name}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 text-secondary-400 ${openDropdown === cat.name ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {cat?.sub?.length > 0 && <div
                    className={`overflow-hidden transition-all duration-200 ${openDropdown === cat.name ? "max-h-40" : "max-h-0"
                      }`}
                  >
                    {cat?.sub?.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={closeAll}
                        className="flex items-center gap-3 pl-10 pr-4 py-2.5 text-sm font-medium text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-secondary-800/50 rounded-xl transition-colors"
                      >
                        <span>{item.icon}</span>
                        {item.name}
                      </Link>
                    ))}
                  </div>}
                </div>
              ))}

              {/* Other links */}
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={closeAll}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-secondary-900 dark:text-white hover:bg-primary-50 dark:hover:bg-secondary-800 transition-colors"
                >
                  <link.icon size={18} className="text-secondary-400" />
                  {link.name}
                </Link>
              ))}

              <Link
                href="/contact"
                onClick={closeAll}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-secondary-900 dark:text-white hover:bg-primary-50 dark:hover:bg-secondary-800 transition-colors"
              >
                📧 Contact
              </Link>

              {/* Newsletter CTA */}
              <div className="pt-4 border-t border-secondary-100 dark:border-secondary-800">
                <Link
                  href="/#newsletter"
                  onClick={handleNewsletterClick}
                  className="btn-primary w-full justify-center"
                >
                  <Mail size={16} />
                  Subscribe to Newsletter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
