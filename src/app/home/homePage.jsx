"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, TrendingUp, BookOpen, ChevronRight, Flame, Clock, User, ArrowRight, Star } from "lucide-react";
import BlogCard from "@/components/BlogCard";
import { textToSlug, getCategoryColor, estimateReadingTime } from "@/helper/helper";
import { FLAGS, ADS_CONFIG, CATEGORIES as SITE_CATEGORIES } from "@/config/flags";

/* ─── Skeleton ──────────────────────────────────────── */
const CardSkeleton = () => (
  <div className="card flex flex-col h-full">
    <div className="aspect-[16/9] skeleton-shimmer rounded-t-2xl" />
    <div className="p-5 space-y-3 flex-1">
      <div className="h-3 skeleton-shimmer rounded w-20" />
      <div className="h-5 skeleton-shimmer rounded w-full" />
      <div className="h-5 skeleton-shimmer rounded w-3/4" />
      <div className="h-3 skeleton-shimmer rounded w-full" />
      <div className="h-3 skeleton-shimmer rounded w-4/5" />
    </div>
  </div>
);

/* ─── Featured Categories ───────────────────────────── */
const FEATURED_CATEGORIES = [
  { name: "Cricket",    emoji: "🏏", href: "/sports/cricket",          desc: "Live scores, analysis & more",    color: "from-green-500 to-emerald-600",  count: "48 Articles" },
  { name: "Football",   emoji: "⚽", href: "/sports/football",          desc: "Transfers, results & standings",  color: "from-blue-500 to-blue-700",      count: "36 Articles" },
  { name: "Bollywood",  emoji: "🎭", href: "/entertainment/bollywood",  desc: "Reviews, gossip & box office",   color: "from-pink-500 to-rose-600",      count: "52 Articles" },
  { name: "Hollywood",  emoji: "⭐", href: "/entertainment/hollywood",  desc: "Blockbusters, awards & more",    color: "from-purple-500 to-violet-700",  count: "44 Articles" },
];

/* ─── Ad Block Component ────────────────────────────── */
const AdBlock = ({ slot, className = "" }) => {
  if (!FLAGS.ENABLE_ADS) return null;
  return (
    <div className={`ad-container overflow-hidden ${className}`}>
      <p className="text-xs text-secondary-300 dark:text-secondary-600 text-center py-1">Advertisement</p>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADS_CONFIG.PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

/* ─── Main ──────────────────────────────────────────── */
export default function HomePage({ blogPosts = [], tredingBlogs = [] }) {
  const [email, setEmail]         = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);

  // Fire AdSense only when enabled
  useEffect(() => {
    if (!FLAGS.ENABLE_ADS) return;
    try {
      const ads = document.querySelectorAll(".adsbygoogle");
      ads.forEach(() => (window.adsbygoogle = window.adsbygoogle || []).push({}));
    } catch (_) {}
  }, []);

  const getDescription = (blog) => {
    try {
      const content = blog?.heroDescription?.json?.content;
      if (!Array.isArray(content)) return "";
      const first = content.find((n) => n.nodeType === "paragraph");
      if (!first) return "";
      return (first.content || [])
        .map((n) => (n.nodeType === "text" ? n.value : ""))
        .join("")
        .slice(0, 200);
    } catch { return ""; }
  };

  const safe = (arr) => (Array.isArray(arr) ? arr : []);
  const posts    = safe(blogPosts);
  const trending = safe(tredingBlogs);

  const heroPost      = trending[0] || posts[0];
  const heroSecondary = trending.slice(1, 3);
  const trendingList  = trending.slice(0, 6);
  const latestPosts   = posts.slice(0, visibleCount);
  const popularPosts  = posts.slice(0, 5);

  return (
    <main className="bg-secondary-50 dark:bg-secondary-950 min-h-screen">

      {/* ═══════════════════════════════════════════════
          SECTION 1: HERO
      ════════════════════════════════════════════════ */}
      {heroPost && (
        <section className="bg-white dark:bg-secondary-900 border-b border-secondary-100 dark:border-secondary-800" aria-label="Featured article">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Large hero */}
              <div className="lg:col-span-2">
                <BlogCard blog={heroPost} variant="hero" priority />
              </div>

              {/* Secondary hero cards */}
              <div className="flex flex-col gap-4">
                {/* Editor's Pick Label */}
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    Editor's Picks
                  </span>
                </div>

                {heroSecondary.length > 0
                  ? heroSecondary.map((post, i) => (
                      <BlogCard key={i} blog={post} variant="default" />
                    ))
                  : posts.slice(1, 3).map((post, i) => (
                      <BlogCard key={i} blog={post} variant="default" />
                    ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          SECTION 2: FEATURED CATEGORIES
      ════════════════════════════════════════════════ */}
      <section className="bg-white dark:bg-secondary-900 border-b border-secondary-100 dark:border-secondary-800" aria-label="Featured categories">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="section-header">
            <BookOpen size={18} className="text-primary-600" />
            <h2 className="section-title">Browse Categories</h2>
            <div className="section-line" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`bg-gradient-to-br ${cat.color} p-5 h-full`}>
                  <div className="text-4xl mb-3">{cat.emoji}</div>
                  <h3 className="font-heading text-lg font-bold text-white mb-1">{cat.name}</h3>
                  <p className="text-white/80 text-xs leading-relaxed mb-3">{cat.desc}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/90 bg-white/20 px-2.5 py-1 rounded-full">
                    {cat.count}
                    <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 3: TRENDING NOW
      ════════════════════════════════════════════════ */}
      {trendingList.length > 0 && (
        <section className="bg-secondary-50 dark:bg-secondary-950 py-10" aria-label="Trending articles">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="section-header mb-6">
              <Flame size={18} className="text-red-500" />
              <h2 className="section-title">Trending Now</h2>
              <div className="section-line" />
              <Link href="/" className="flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 shrink-0 transition-colors">
                See all <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {trendingList.map((post, index) => {
                const title      = post?.heroTitle || "";
                const category   = Array.isArray(post?.category)   ? post.category[0]   : post?.category   || "";
                const subCat     = Array.isArray(post?.subCatgory) ? post.subCatgory[0] : post?.subCatgory || "";
                const imageUrl   = post?.heroImage?.url || "";
                const blogSlug   = post?.slug || textToSlug(title);
                const catSlug    = textToSlug(category);
                const subCatSlug = textToSlug(subCat);
                const href       = `/${catSlug}/${subCatSlug}/${blogSlug}`;
                const colors     = getCategoryColor(subCat || category);
                const readTime   = estimateReadingTime(post?.heroDescription?.json);

                return (
                  <article key={index} className="card card-hover group flex gap-4 p-4">
                    <div className="text-3xl font-black text-secondary-200 dark:text-secondary-700 leading-none w-8 shrink-0 mt-1">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="flex-1 min-w-0">
                      {subCat && (
                        <span className={`badge ${colors.bg} ${colors.text} mb-2`}>{subCat}</span>
                      )}
                      <Link href={href}>
                        <h3 className="font-heading text-sm font-bold text-secondary-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 leading-snug mb-2">
                          {title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-3 text-xs text-secondary-400">
                        <span className="flex items-center gap-1"><Clock size={11} /> {readTime} min</span>
                        <span className="flex items-center gap-1"><User size={11} /> {post?.publishedBy || "Editor"}</span>
                      </div>
                    </div>
                    {imageUrl && (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 img-zoom">
                        <Image src={imageUrl} alt={title} fill className="object-cover" sizes="80px" />
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          SECTION 4: LATEST ARTICLES + SIDEBAR
      ════════════════════════════════════════════════ */}
      <section className="py-10" aria-label="Latest articles">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

            {/* Main content */}
            <div className="xl:col-span-3">
              <div className="section-header mb-6">
                <BookOpen size={18} className="text-primary-600" />
                <h2 className="section-title">Latest Articles</h2>
                <div className="section-line" />
              </div>

              {posts.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {latestPosts.map((blog, i) => (
                      <BlogCard key={i} blog={blog} variant="default" priority={i < 3} />
                    ))}
                  </div>

                  {/* Ad between article groups */}
                  <div className="my-8">
                    <AdBlock slot={ADS_CONFIG.SLOTS.HOMEPAGE_MID} className="min-h-[90px]" />
                  </div>

                  {/* Load more */}
                  {visibleCount < posts.length && (
                    <div className="text-center mt-6">
                      <button
                        onClick={() => setVisibleCount((c) => c + 9)}
                        className="btn-secondary px-8 py-3 text-sm"
                      >
                        Load more articles
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Homepage Sidebar */}
            <div className="xl:col-span-1">
              <div className="sidebar-sticky space-y-6">

                {/* Popular this week */}
                {popularPosts.length > 0 && (
                  <div className="bg-white dark:bg-secondary-800 rounded-2xl border border-secondary-100 dark:border-secondary-700/50 shadow-card p-5">
                    <div className="section-header mb-4">
                      <div className="w-1 h-5 bg-red-500 rounded-full" />
                      <h3 className="section-title text-base">Popular This Week</h3>
                    </div>
                    <div className="space-y-4">
                      {popularPosts.map((post, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="text-2xl font-black text-secondary-200 dark:text-secondary-700 leading-none mt-0.5 w-6 text-center shrink-0">
                            {i + 1}
                          </span>
                          <BlogCard blog={post} variant="mini" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sidebar Ad */}
                <AdBlock slot={ADS_CONFIG.SLOTS.HOMEPAGE_SIDEBAR} className="min-h-[250px] flex items-center justify-center" />

                {/* Categories */}
                <div className="bg-white dark:bg-secondary-800 rounded-2xl border border-secondary-100 dark:border-secondary-700/50 shadow-card p-5">
                  <div className="section-header mb-4">
                    <div className="w-1 h-5 bg-primary-500 rounded-full" />
                    <h3 className="section-title text-base">Categories</h3>
                  </div>
                  <div className="space-y-1.5">
                    {FEATURED_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-primary-50 dark:hover:bg-secondary-700 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group"
                      >
                        <span className="flex items-center gap-2.5">
                          <span>{cat.emoji}</span>
                          {cat.name}
                        </span>
                        <ChevronRight size={14} className="text-secondary-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 5: NEWSLETTER CTA
      ════════════════════════════════════════════════ */}
      <section
        id="newsletter"
        className="relative overflow-hidden bg-gradient-newsletter py-16 lg:py-20"
        aria-label="Newsletter signup"
      >
        {/* Background texture */}
        <div className="absolute inset-0 bg-noise opacity-30" aria-hidden="true" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl" aria-hidden="true" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
            <Mail size={12} />
            Free Newsletter
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Stay ahead of the game
          </h2>
          <p className="text-white/80 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Get the week's best sports moments and entertainment stories delivered to your inbox. No spam, ever.
          </p>

          {subscribed ? (
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl text-base font-semibold">
              <span className="text-xl">🎉</span>
              You're subscribed! Check your inbox.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setSubscribed(true);
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-5 py-3.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all text-sm"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-white text-primary-700 rounded-xl font-bold text-sm hover:bg-primary-50 transition-colors duration-150 whitespace-nowrap shadow-lg"
              >
                Subscribe Free
              </button>
            </form>
          )}

          <p className="mt-4 text-white/50 text-xs">
            Join 12,000+ readers · Unsubscribe anytime · No spam guaranteed
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 6: MORE FOR YOU + BOTTOM AD
      ════════════════════════════════════════════════ */}
      {posts.length > 9 && (
        <section className="bg-white dark:bg-secondary-900 py-10 border-t border-secondary-100 dark:border-secondary-800" aria-label="More articles">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="section-header mb-6">
              <TrendingUp size={18} className="text-accent-600" />
              <h2 className="section-title">Recommended For You</h2>
              <div className="section-line" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {posts.slice(9, 13).map((blog, i) => (
                <BlogCard key={i} blog={blog} variant="default" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom Ad */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdBlock slot={ADS_CONFIG.SLOTS.HOMEPAGE_BOTTOM} className="min-h-[90px]" />
      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 7: TRUST BAR
      ════════════════════════════════════════════════ */}
      <section className="bg-secondary-50 dark:bg-secondary-950 border-t border-secondary-200 dark:border-secondary-800 py-6" aria-label="Trust signals">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-secondary-400 dark:text-secondary-500 font-medium">
            {[
              { icon: "✓", text: "Expert Editorial Team" },
              { icon: "✓", text: "Fact-Checked Content" },
              { icon: "✓", text: "Updated Regularly" },
              { icon: "✓", text: "100% Original Reporting" },
              { icon: "✓", text: "No AI-Generated Content" },
            ].map((item) => (
              <span key={item.text} className="flex items-center gap-1.5">
                <span className="text-accent-600 font-bold">{item.icon}</span>
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
