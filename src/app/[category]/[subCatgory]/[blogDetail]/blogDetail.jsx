"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Clock, User, Calendar, Share2, ChevronRight, ChevronDown,
  Check, Facebook, Twitter, Linkedin, Link as LinkIcon,
  ArrowLeft, ArrowRight, BookOpen, Tag, MessageCircle
} from "lucide-react";
import { renderRichText, textToSlug, estimateReadingTime, getCategoryColor } from "@/helper/helper";
import TableOfContents from "@/components/TableOfContents";
import ArticleSidebar from "@/components/ArticleSidebar";
import BlogCard from "@/components/BlogCard";
import { FLAGS, ADS_CONFIG } from "@/config/flags";

/* ─── AdSense block ─────────────────────────────────── */
const AdBlock = ({ slot, label = "Advertisement", className = "" }) => {
  useEffect(() => {
    if (!FLAGS.ENABLE_ADS) return;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (_) {}
  }, []);

  if (!FLAGS.ENABLE_ADS) return null;

  return (
    <div className={`ad-container ${className}`}>
      <p className="text-xs text-secondary-300 dark:text-secondary-600 text-center py-1">{label}</p>
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

/* ─── FAQ Accordion ─────────────────────────────────── */
const FAQSection = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(null);
  if (!faqs?.length) return null;

  return (
    <section className="my-10" aria-label="Frequently asked questions">
      <h2 className="font-heading text-2xl font-bold text-secondary-900 dark:text-white mb-6 flex items-center gap-2">
        <MessageCircle size={22} className="text-primary-600" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-secondary-200 dark:border-secondary-700 rounded-2xl overflow-hidden bg-white dark:bg-secondary-800 shadow-card"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex justify-between items-center text-left px-6 py-4 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors"
              aria-expanded={openIndex === index}
            >
              <span className="font-semibold text-secondary-900 dark:text-white text-sm sm:text-base pr-4">
                {faq.question}
              </span>
              <ChevronDown
                size={18}
                className={`text-secondary-400 flex-shrink-0 transition-transform duration-300 ${
                  openIndex === index ? "rotate-180 text-primary-600" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-6 pb-5 pt-1 text-secondary-600 dark:text-secondary-400 text-sm leading-relaxed border-t border-secondary-100 dark:border-secondary-700">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─── Share buttons ─────────────────────────────────── */
const ShareButtons = ({ title, url }) => {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  const shareLinks = [
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      icon: <Facebook size={16} />,
      color: "hover:bg-blue-600 hover:text-white hover:border-blue-600",
    },
    {
      name: "Twitter / X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: "hover:bg-slate-900 hover:text-white hover:border-slate-900",
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}`,
      icon: <Linkedin size={16} />,
      color: "hover:bg-blue-700 hover:text-white hover:border-blue-700",
    },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap" aria-label="Share article">
      <span className="text-xs font-bold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mr-1 flex items-center gap-1">
        <Share2 size={12} /> Share
      </span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center w-9 h-9 rounded-lg border border-secondary-200 dark:border-secondary-600 text-secondary-500 dark:text-secondary-400 ${link.color} transition-all duration-150`}
          aria-label={`Share on ${link.name}`}
        >
          {link.icon}
        </a>
      ))}
      <button
        onClick={copyLink}
        className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-150 ${
          copied
            ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600"
            : "border-secondary-200 dark:border-secondary-600 text-secondary-500 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700"
        }`}
        aria-label={copied ? "Link copied!" : "Copy link"}
      >
        {copied ? <Check size={16} /> : <LinkIcon size={16} />}
      </button>
    </div>
  );
};

/* ─── Main Component ────────────────────────────────── */
export default function BlogDetailPage({ category, blogDetails, relatedArticles = [] }) {
  const [urlPath, setUrlPath] = useState("");
  const articleRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      setUrlPath(window.location.href);
    }
  }, [blogDetails?.slug]);

  /* ── Not found ── */
  if (!blogDetails) {
    return (
      <main className="min-h-screen bg-secondary-50 dark:bg-secondary-950 flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="font-heading text-3xl font-bold text-secondary-900 dark:text-white mb-3">
            Article Not Found
          </h1>
          <p className="text-secondary-500 dark:text-secondary-400 mb-8 leading-relaxed">
            The article you're looking for doesn't exist or may have been moved.
          </p>
          <Link href="/" className="btn-primary">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const imageUrl      = blogDetails?.heroImage?.url || "";
  const title         = blogDetails?.heroTitle || "";
  const author        = blogDetails?.publishedBy || "Blynter Team";
  const richTextJson  = blogDetails?.heroDescription?.json || {};
  const richTextLinks = blogDetails?.heroDescription?.links || [];
  const subCategory   = Array.isArray(blogDetails?.subCatgory) ? blogDetails.subCatgory[0] : blogDetails?.subCatgory || "";
  const blogCategory  = Array.isArray(blogDetails?.category)   ? blogDetails.category[0]   : blogDetails?.category || category || "";
  const colors        = getCategoryColor(subCategory || blogCategory);
  const readingTime   = estimateReadingTime(richTextJson);
  const catSlug       = textToSlug(blogCategory);
  const subCatSlug    = textToSlug(subCategory);

  const breadcrumbs = [
    { name: "Home",        href: "/" },
    { name: blogCategory,  href: `/${catSlug}` },
    { name: subCategory,   href: `/${catSlug}/${subCatSlug}` },
    { name: title,         href: null },
  ].filter((b) => b.name);

  return (
    <main className="bg-secondary-50 dark:bg-secondary-950 min-h-screen">

      {/* ── Hero Image ── */}
      {imageUrl && (
        <div className="relative w-full h-[280px] sm:h-[380px] md:h-[480px] lg:h-[560px] overflow-hidden bg-secondary-900">
          <Image
            src={imageUrl}
            alt={title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-hero" />

          {/* Hero overlay content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumb on hero */}
              <nav aria-label="Breadcrumb" className="mb-4">
                <ol className="flex items-center gap-1.5 text-xs text-white/60 flex-wrap">
                  {breadcrumbs.map((crumb, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      {crumb.href ? (
                        <Link href={crumb.href} className="hover:text-white transition-colors truncate max-w-[120px]">
                          {crumb.name}
                        </Link>
                      ) : (
                        <span className="text-white/80 truncate max-w-[200px]">{crumb.name}</span>
                      )}
                      {i < breadcrumbs.length - 1 && <ChevronRight size={10} className="text-white/40 flex-shrink-0" />}
                    </li>
                  ))}
                </ol>
              </nav>

              {/* Category */}
              {subCategory && (
                <span className={`badge ${colors.bg} ${colors.text} mb-4 inline-block`}>
                  {subCategory}
                </span>
              )}

              {/* Title */}
              <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-lg max-w-4xl">
                {title}
              </h1>

              {/* Meta row */}
              <div className="flex items-center flex-wrap gap-4 text-sm text-white/75">
                <Link href={`/author/${textToSlug(author)}`} className="flex items-center gap-2 hover:text-white transition-colors group">
                  <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold transition-transform group-hover:scale-105">
                    {author.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-white group-hover:underline">{author}</span>
                </Link>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  {readingTime} min read
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Content Area ── */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">

          {/* ── Article Main ── */}
          <article ref={articleRef} className="lg:col-span-2 xl:col-span-3">

            {/* If no hero image, show breadcrumb + title here */}
            {!imageUrl && (
              <div className="mb-8">
                <nav aria-label="Breadcrumb" className="mb-4">
                  <ol className="flex items-center gap-1.5 text-xs text-secondary-400 dark:text-secondary-500 flex-wrap">
                    {breadcrumbs.map((crumb, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        {crumb.href ? (
                          <Link href={crumb.href} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                            {crumb.name}
                          </Link>
                        ) : (
                          <span className="text-secondary-600 dark:text-secondary-400">{crumb.name}</span>
                        )}
                        {i < breadcrumbs.length - 1 && <ChevronRight size={10} className="text-secondary-300" />}
                      </li>
                    ))}
                  </ol>
                </nav>
                {subCategory && (
                  <span className={`badge ${colors.bg} ${colors.text} mb-4 inline-block`}>{subCategory}</span>
                )}
                <h1 className="font-heading text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-white mb-4 leading-tight">
                  {title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-secondary-500 dark:text-secondary-400 pb-6 border-b border-secondary-200 dark:border-secondary-700">
                  <Link href={`/author/${textToSlug(author)}`} className="flex items-center gap-2 text-secondary-800 dark:text-secondary-200 hover:text-primary-650 dark:hover:text-primary-400 transition-colors group">
                    <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold transition-transform group-hover:scale-105">
                      {author.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold group-hover:underline">{author}</span>
                  </Link>
                  <span className="flex items-center gap-1"><Clock size={13} /> {readingTime} min read</span>
                </div>
              </div>
            )}

            {/* Meta + Share bar (below hero image) */}
            {imageUrl && (
              <div className="flex items-center justify-between flex-wrap gap-4 py-4 mb-6 border-b border-secondary-200 dark:border-secondary-700">
                <div className="flex items-center gap-4 text-sm text-secondary-500 dark:text-secondary-400">
                  <span className="flex items-center gap-1"><BookOpen size={13} /> {readingTime} min read</span>
                </div>
                <ShareButtons title={title} url={urlPath} />
              </div>
            )}

            {/* TOC: Mobile only (inline before content) */}
            {FLAGS.ENABLE_TOC && (
              <div className="lg:hidden mb-6">
                <TableOfContents richTextJson={richTextJson} />
              </div>
            )}

            {/* ── Rich Text Content ── */}
            <div className="prose-blynter">
              {richTextJson?.content ? (
                renderRichText(richTextJson, richTextLinks)
              ) : (
                <p className="text-secondary-500 dark:text-secondary-400">No content available.</p>
              )}
            </div>

            {/* ── Mid-Article Ad ── */}
            <div className="my-8">
              <AdBlock slot={ADS_CONFIG.SLOTS.ARTICLE_MID} />
            </div>

            {/* ── FAQ ── */}
            {FLAGS.ENABLE_FAQ && blogDetails?.faqs?.length > 0 && (
              <FAQSection faqs={blogDetails.faqs} />
            )}

            {/* ── Tags ── */}
            {(subCategory || blogCategory) && (
              <div className="flex items-center gap-2 flex-wrap my-8 pt-6 border-t border-secondary-200 dark:border-secondary-700">
                <Tag size={14} className="text-secondary-400" />
                {[blogCategory, subCategory].filter(Boolean).map((tag) => (
                  <Link
                    key={tag}
                    href={`/${textToSlug(tag)}`}
                    className="badge badge-secondary hover:badge-primary transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* ── Share (bottom) ── */}
            {FLAGS.ENABLE_SOCIAL_SHARE && (
              <div className="flex items-center justify-between flex-wrap gap-4 py-6 border-t border-b border-secondary-200 dark:border-secondary-700 my-6">
                <span className="text-sm font-semibold text-secondary-700 dark:text-secondary-300">
                  Found this helpful? Share it!
                </span>
                <ShareButtons title={title} url={urlPath} />
              </div>
            )}

            {/* ── Author Bio ── */}
            {FLAGS.ENABLE_AUTHOR_BIO && (
              <div className="bg-white dark:bg-secondary-800 rounded-2xl border border-secondary-100 dark:border-secondary-700/50 shadow-card p-6 my-8">
                <div className="flex items-start gap-4">
                  <Link href={`/author/${textToSlug(author)}`} className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 transition-transform hover:scale-105 shadow-md">
                    {author.charAt(0).toUpperCase()}
                  </Link>
                  <div>
                    <p className="text-xs text-secondary-400 dark:text-secondary-500 uppercase tracking-wider font-semibold mb-1">
                      Written by
                    </p>
                    <h3 className="font-heading text-lg font-bold text-secondary-900 dark:text-white mb-1 hover:text-primary-600 transition-colors">
                      <Link href={`/author/${textToSlug(author)}`} className="hover:underline">
                        {author}
                      </Link>
                    </h3>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed">
                      Editorial contributor at Blynter. Passionate about sports, cinema, and storytelling that connects fans with the stories they love.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Bottom Article Ad ── */}
            <div className="my-6">
              <AdBlock slot={ADS_CONFIG.SLOTS.ARTICLE_BOTTOM} />
            </div>

            {/* ── Navigation: Prev / Next ── */}
            <nav className="flex gap-4 my-8" aria-label="Article navigation">
              <Link
                href="/"
                className="flex items-center gap-2 flex-1 px-4 py-3 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm font-semibold text-secondary-700 dark:text-secondary-300 hover:border-primary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="truncate">Back to all articles</span>
              </Link>
            </nav>
          </article>

          {/* ── Right Sidebar ── */}
          <aside className="lg:col-span-1">
            <div className="sidebar-sticky space-y-6">
              {/* TOC: Desktop */}
              {FLAGS.ENABLE_TOC && (
                <div className="hidden lg:block">
                  <TableOfContents richTextJson={richTextJson} />
                </div>
              )}
              <ArticleSidebar popularPosts={relatedArticles} richTextJson={richTextJson} />
            </div>
          </aside>
        </div>
      </div>

      {/* ── Related Articles ── */}
      {FLAGS.ENABLE_RELATED_ARTICLES && relatedArticles.length > 0 && (
        <section className="bg-white dark:bg-secondary-900 border-t border-secondary-100 dark:border-secondary-800 py-12" aria-label="Related articles">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="section-header mb-8">
              <BookOpen size={18} className="text-primary-600" />
              <h2 className="section-title">You Might Also Like</h2>
              <div className="section-line" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.slice(0, 3).map((article, i) => (
                <BlogCard key={i} blog={article} variant="default" />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
