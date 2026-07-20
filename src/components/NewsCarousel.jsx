"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { textToSlug, getCategoryColor, estimateReadingTime } from "@/helper/helper";

const NewsCarousel = ({
  tredingBlogs = [],
  autoSlideInterval = 6000,
  transitionDuration = 600,
}) => {
  const [currentIndex,   setCurrentIndex]   = useState(0);
  const [isPaused,       setIsPaused]       = useState(false);
  const [isTransitioning,setIsTransitioning]= useState(false);
  const intervalRef = useRef(null);

  const carouselPosts = tredingBlogs?.slice(0, 6) || [];
  const total = carouselPosts.length;

  const navigate = useCallback((dir) => {
    if (isTransitioning || total <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) =>
      dir === "next" ? (prev + 1) % total : (prev - 1 + total) % total
    );
    setTimeout(() => setIsTransitioning(false), transitionDuration);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 4000);
  }, [isTransitioning, total, transitionDuration]);

  // Auto advance
  useEffect(() => {
    if (total <= 1 || isPaused) return;
    intervalRef.current = setInterval(() => navigate("next"), autoSlideInterval);
    return () => clearInterval(intervalRef.current);
  }, [navigate, total, isPaused, autoSlideInterval]);

  if (total === 0) return null;

  const post   = carouselPosts[currentIndex];
  const title  = post?.heroTitle || "";
  const slug   = post?.slug || textToSlug(title);
  const cat    = Array.isArray(post?.category)   ? post.category[0]   : post?.category   || "";
  const subCat = Array.isArray(post?.subCatgory) ? post.subCatgory[0] : post?.subCatgory || "";
  const img    = post?.heroImage?.url || "";
  const catSlug    = textToSlug(cat);
  const subCatSlug = textToSlug(subCat);
  const href       = `/${catSlug}/${subCatSlug}/${slug}`;
  const colors     = getCategoryColor(subCat || cat);
  const readTime   = estimateReadingTime(post?.heroDescription?.json);

  const getDesc = (blog) => {
    try {
      const content = blog?.heroDescription?.json?.content;
      if (!Array.isArray(content)) return "";
      const first = content.find((n) => n.nodeType === "paragraph");
      return (first?.content || []).map((n) => (n.nodeType === "text" ? n.value : "")).join("").slice(0, 180);
    } catch { return ""; }
  };
  const description = getDesc(post);

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden shadow-card-hover bg-secondary-900 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured articles"
    >
      {/* ── Main Slide ── */}
      <div className="relative h-[280px] sm:h-[380px] lg:h-[480px] w-full overflow-hidden">
        {/* Background image */}
        {img && (
          <Image
            key={currentIndex}
            src={img}
            alt={title}
            fill
            priority={currentIndex === 0}
            className={`object-cover transition-all duration-700 ${
              isTransitioning ? "scale-105 opacity-0" : "scale-100 opacity-100"
            }`}
            sizes="(max-width: 1024px) 100vw, 70vw"
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-hero" />

        {/* ── Content ── */}
        <Link href={href} className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 lg:p-10" tabIndex={-1}>
          <div
            className={`transition-all duration-500 ${
              isTransitioning ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
            }`}
          >
            {/* Badges */}
            <div className="flex items-center gap-2 mb-3">
              <span className="badge bg-red-500 text-white text-xs font-bold px-2.5 py-1">
                🔥 TRENDING
              </span>
              {subCat && (
                <span className={`badge ${colors.bg} ${colors.text}`}>{subCat}</span>
              )}
            </div>

            {/* Title */}
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight line-clamp-2 group-hover:text-primary-200 transition-colors">
              {title}
            </h2>

            {/* Description */}
            {description && (
              <p className="text-white/75 text-sm sm:text-base line-clamp-2 mb-4 max-w-2xl">
                {description}
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center gap-4 text-white/65 text-xs sm:text-sm">
              <span className="font-semibold text-white/90">{post?.publishedBy || "Blynter"}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {readTime} min read
              </span>
              <span className="ml-auto flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-semibold hover:bg-white/30 transition-colors">
                Read story →
              </span>
            </div>
          </div>
        </Link>

        {/* ── Nav Arrows ── */}
        {total > 1 && (
          <>
            <button
              onClick={(e) => { e.preventDefault(); navigate("prev"); }}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white flex items-center justify-center transition-all duration-150 opacity-0 group-hover:opacity-100 z-10 hover:scale-110"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); navigate("next"); }}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white flex items-center justify-center transition-all duration-150 opacity-0 group-hover:opacity-100 z-10 hover:scale-110"
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* ── Pause/Play ── */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white/70 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150 z-10"
          aria-label={isPaused ? "Resume autoplay" : "Pause autoplay"}
        >
          {isPaused ? <Play size={14} /> : <Pause size={14} />}
        </button>
      </div>

      {/* ── Slide counter + Dots ── */}
      {total > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {carouselPosts.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.preventDefault();
                if (i === currentIndex || isTransitioning) return;
                setIsTransitioning(true);
                setCurrentIndex(i);
                setTimeout(() => setIsTransitioning(false), transitionDuration);
                setIsPaused(true);
                setTimeout(() => setIsPaused(false), 4000);
              }}
              className={`rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "bg-white w-6 h-2"
                  : "bg-white/40 hover:bg-white/60 w-2 h-2"
              }`}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === currentIndex ? "true" : undefined}
            />
          ))}
        </div>
      )}

      {/* ── Thumbnail strip (desktop) ── */}
      {total > 1 && (
        <div className="hidden lg:grid grid-cols-3 border-t border-secondary-700/50">
          {carouselPosts.slice(0, 3).map((p, i) => {
            const t    = p?.heroTitle || "";
            const s    = p?.slug || textToSlug(t);
            const pCat = Array.isArray(p?.category)   ? p.category[0]   : p?.category   || "";
            const pSub = Array.isArray(p?.subCatgory) ? p.subCatgory[0] : p?.subCatgory || "";
            const pImg = p?.heroImage?.url || "";
            const h    = `/${textToSlug(pCat)}/${textToSlug(pSub)}/${s}`;
            const active = i === currentIndex;

            return (
              <button
                key={i}
                onClick={() => {
                  if (i === currentIndex || isTransitioning) return;
                  setIsTransitioning(true);
                  setCurrentIndex(i);
                  setTimeout(() => setIsTransitioning(false), transitionDuration);
                  setIsPaused(true);
                  setTimeout(() => setIsPaused(false), 4000);
                }}
                className={`relative flex items-center gap-3 p-3 text-left transition-all duration-150 border-r last:border-r-0 border-secondary-700/50 ${
                  active
                    ? "bg-secondary-800"
                    : "bg-secondary-900 hover:bg-secondary-800"
                }`}
              >
                {pImg && (
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={pImg} alt={t} fill className="object-cover" sizes="56px" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold line-clamp-2 leading-snug transition-colors ${
                    active ? "text-white" : "text-secondary-400 hover:text-secondary-200"
                  }`}>
                    {t}
                  </p>
                  {active && (
                    <div className="mt-1.5 h-0.5 bg-primary-500 rounded-full w-full animate-pulse" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NewsCarousel;
