"use client";
import Image from "next/image";
import Link from "next/link";
import { Clock, User, ArrowRight, Eye } from "lucide-react";
import { getCategoryColor, estimateReadingTime, textToSlug } from "@/helper/helper";

/**
 * Premium blog card — used in homepage grids, related posts, etc.
 * Variants: "default" | "hero" | "list" | "mini"
 */
export default function BlogCard({ blog, variant = "default", priority = false }) {
  if (!blog) return null;

  const title       = blog?.heroTitle || "";
  const blogSlug    = blog?.slug || textToSlug(title);
  const category    = Array.isArray(blog?.category)   ? blog.category[0]   : blog?.category   || "";
  const subCategory = Array.isArray(blog?.subCatgory) ? blog.subCatgory[0] : blog?.subCatgory || "";
  const imageUrl    = blog?.heroImage?.url || "";
  const author      = blog?.publishedBy || "Blynter Team";
  const catSlug     = textToSlug(category);
  const subCatSlug  = textToSlug(subCategory);
  const href        = `/${catSlug}/${subCatSlug}/${blogSlug}`;
  const colors      = getCategoryColor(subCategory || category);

  // Estimate reading time from rich text JSON
  const readingTime = estimateReadingTime(blog?.heroDescription?.json);

  // Extract description text
  const getDescription = () => {
    try {
      const content = blog?.heroDescription?.json?.content;
      if (!Array.isArray(content)) return "";
      const first = content.find((n) => n.nodeType === "paragraph");
      if (!first) return "";
      return (first.content || [])
        .map((n) => (n.nodeType === "text" ? n.value : ""))
        .join("")
        .slice(0, 160);
    } catch { return ""; }
  };
  const description = getDescription();

  /* ── HERO card (large featured) ── */
  if (variant === "hero") {
    return (
      <article className="relative rounded-3xl overflow-hidden group shadow-card-hover">
        <Link href={href} aria-label={title}>
          <div className="relative h-[420px] sm:h-[520px] lg:h-[580px] w-full">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                priority={priority}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 65vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-primary-900" />
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-hero" />

            {/* Badges */}
            <div className="absolute top-5 left-5 flex items-center gap-2">
              <span className="badge bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                🔥 TRENDING
              </span>
              {subCategory && (
                <span className={`badge ${colors.bg} ${colors.text}`}>
                  {subCategory}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight line-clamp-3 group-hover:text-primary-200 transition-colors duration-200">
                {title}
              </h2>
              {description && (
                <p className="text-white/80 text-sm sm:text-base line-clamp-2 mb-4 max-w-2xl">
                  {description}
                </p>
              )}
              <div className="flex items-center gap-4 text-white/70 text-sm">
                <span className="flex items-center gap-1.5">
                  <User size={13} />
                  <span className="font-medium text-white/90">{author}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  {readingTime} min read
                </span>
                <span className="flex items-center gap-1.5 ml-auto">
                  Read story
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  /* ── LIST card (horizontal compact) ── */
  if (variant === "list") {
    return (
      <article className="group flex gap-4 items-start">
        <Link href={href} className="flex gap-4 items-start w-full" aria-label={title}>
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 img-zoom">
            {imageUrl ? (
              <Image src={imageUrl} alt={title} fill className="object-cover" sizes="96px" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-primary-400 dark:from-primary-800 dark:to-primary-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {subCategory && (
              <span className={`badge ${colors.bg} ${colors.text} text-xs mb-1.5 inline-block`}>
                {subCategory}
              </span>
            )}
            <h3 className="font-heading text-sm font-bold text-secondary-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-150 line-clamp-2 leading-snug">
              {title}
            </h3>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-secondary-400 dark:text-secondary-500">
              <span className="flex items-center gap-1"><Clock size={11} /> {readingTime} min</span>
              <span className="flex items-center gap-1"><User size={11} /> {author}</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  /* ── MINI card (sidebar recent posts) ── */
  if (variant === "mini") {
    return (
      <article className="group">
        <Link href={href} className="flex gap-3 items-start" aria-label={title}>
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 img-zoom">
            {imageUrl ? (
              <Image src={imageUrl} alt={title} fill className="object-cover" sizes="64px" />
            ) : (
              <div className="absolute inset-0 bg-secondary-200 dark:bg-secondary-700" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-secondary-800 dark:text-secondary-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 leading-snug">
              {title}
            </h4>
            <span className="text-xs text-secondary-400 mt-1 flex items-center gap-1">
              <Clock size={10} /> {readingTime} min
            </span>
          </div>
        </Link>
      </article>
    );
  }

  /* ── DEFAULT card (grid) ── */
  return (
    <article className="card card-hover group flex flex-col h-full animate-fade-in">
      <Link href={href} className="flex flex-col h-full" aria-label={title}>
        {/* Thumbnail */}
        <div className="relative w-full aspect-[16/9] overflow-hidden img-zoom rounded-t-2xl">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              loading={priority ? "eager" : "lazy"}
              priority={priority}
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-secondary-800" />
          )}

          {/* Category badge over image */}
          {subCategory && (
            <div className="absolute top-3 left-3">
              <span className={`badge ${colors.bg} ${colors.text} shadow-sm`}>
                {subCategory}
              </span>
            </div>
          )}

          {/* Reading time badge */}
          <div className="absolute bottom-3 right-3">
            <span className="badge bg-black/50 text-white backdrop-blur-sm text-xs">
              <Clock size={10} className="mr-1 inline" />
              {readingTime} min
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 sm:p-5">
          {/* Category */}
          {category && !subCategory && (
            <span className={`badge ${getCategoryColor(category).bg} ${getCategoryColor(category).text} mb-2 self-start`}>
              {category}
            </span>
          )}

          {/* Title */}
          <h3 className="font-heading text-base sm:text-lg font-bold text-secondary-900 dark:text-white mb-2 line-clamp-2 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-sm text-secondary-500 dark:text-secondary-400 line-clamp-2 flex-1 leading-relaxed">
              {description}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-secondary-100 dark:border-secondary-700/50">
            <div className="flex items-center gap-1.5 text-xs text-secondary-400 dark:text-secondary-500">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {author.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-secondary-600 dark:text-secondary-400 truncate max-w-[100px]">
                {author}
              </span>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 group-hover:gap-2 transition-all duration-200">
              Read more
              <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
