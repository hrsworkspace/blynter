"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { textToSlug } from '@/helper/helper';

const NewsCarousel = ({ blogPosts, autoSlideInterval = 5000, transitionDuration = 800 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);

  // Get the first 5 posts for the carousel (latest/highlighted)
  const carouselPosts = blogPosts?.slice(0, 5) || [];

  // Auto-slide functionality
  useEffect(() => {
    if (carouselPosts.length <= 1 || isPaused) return;

    intervalRef.current = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselPosts.length);
        setTimeout(() => {
          setIsTransitioning(false);
        }, transitionDuration);
      }
    }, autoSlideInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [carouselPosts.length, autoSlideInterval, isPaused, isTransitioning, transitionDuration]);

  const goToSlide = (index) => {
    if (index === currentIndex || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => {
      setIsTransitioning(false);
    }, transitionDuration);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? carouselPosts.length - 1 : prevIndex - 1
    );
    setTimeout(() => {
      setIsTransitioning(false);
    }, transitionDuration);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselPosts.length);
    setTimeout(() => {
      setIsTransitioning(false);
    }, transitionDuration);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  // Helper function to extract description
  const getDescription = (blog) => {
    try {
      if (blog?.heroDescription?.json?.content) {
        const content = blog.heroDescription.json.content;
        if (Array.isArray(content) && content.length > 0) {
          return content[0]?.value || content[0]?.content?.[0]?.value || "";
        }
      }
      return "";
    } catch (error) {
      return "";
    }
  };

  if (carouselPosts.length === 0) return null;

  return (
    <div 
      className="relative w-full mb-6 sm:mb-8 md:mb-10 rounded-lg overflow-hidden shadow-lg dark:shadow-gray-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Container */}
      <div className="relative h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] w-full  overflow-hidden">
        {/* Slides Container */}
        <div 
          className="flex h-full transition-transform ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transitionDuration: `${transitionDuration}ms`,
          }}
        >
          {carouselPosts.map((post, index) => {
            const title = post?.heroTitle || "";
            const blogslug = post?.slug || textToSlug(title);
            const description = getDescription(post);
            const category = Array.isArray(post?.category)
              ? post?.category[0]
              : post?.category || "";
            const subCatgory = Array.isArray(post?.subCatgory)
              ? post?.subCatgory[0]
              : post?.subCatgory || "";
            const imageUrl = post?.heroImage?.url || "";
            const categorySlug = textToSlug(category);
            const subCatgorySlug = textToSlug(subCatgory);

            return (
              <div
                key={index}
                className="min-w-full h-full relative flex-shrink-0"
              >
                <Link
                  href={`/${categorySlug}/${subCatgorySlug}/${blogslug}`}
                  className="block h-full w-full"
                  prefetch={false}
                >
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={title || "Featured news"}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  )}
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-10 text-white">
                    {/* Category Badge */}
                    {subCatgory && (
                      <div className="mb-3 sm:mb-4">
                        <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/30">
                          {subCatgory}
                        </span>
                      </div>
                    )}
                    
                    {/* Title */}
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-3">
                      {title}
                    </h2>
                    
                    {/* Description */}
                    {description && (
                      <p className="text-sm sm:text-base md:text-lg text-white/90 line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-6">
                        {description}
                      </p>
                    )}
                    
                    {/* Read More */}
                    <div className="flex items-center text-white font-semibold text-sm sm:text-base group hover:text-blue-400 dark:hover:text-blue-400 transition-colors duration-200">
                      <span>Read More</span>
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        {carouselPosts.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                goToPrevious();
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all duration-200 z-10"
              aria-label="Previous slide"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                goToNext();
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all duration-200 z-10"
              aria-label="Next slide"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {carouselPosts.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {carouselPosts.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                goToSlide(index);
              }}
              className={`h-2 sm:h-2.5 w-2 sm:w-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-6 sm:w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsCarousel;

