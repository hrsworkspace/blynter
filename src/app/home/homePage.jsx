"use client";
import GoogleAds from "@/components/GoogleAds";
import NewsCarousel from "@/components/NewsCarousel";
import { textToSlug } from "@/helper/helper";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";

const BlogSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 overflow-hidden flex flex-col h-full animate-pulse">
      {/* Image skeleton */}
      <div className="relative w-full h-40 sm:h-44 md:h-48 bg-gray-200 dark:bg-gray-700">
        {/* Category badge skeleton */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4">
          <div className="h-5 sm:h-6 w-16 sm:w-20 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
      </div>
      {/* Content skeleton */}
      <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col">
        {/* Title skeleton */}
        <div className="mb-2 sm:mb-3">
          <div className="h-4 sm:h-5 md:h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          {/* <div className='h-6 bg-gray-200 rounded w-1/2'></div> */}
        </div>
        {/* Description skeleton */}
        <div className="mb-2 sm:mb-3 flex-1 space-y-2">
          <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          {/* <div className='h-4 bg-gray-200 rounded w-5/6'></div> */}
        </div>
        {/* Read More skeleton */}
        <div className="flex items-center mt-auto pt-2">
          <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 sm:w-20"></div>
          <div className="h-3 w-3 sm:h-4 sm:w-4 bg-gray-200 dark:bg-gray-700 rounded ml-2"></div>
        </div>
      </div>
    </div>
  );
};

const HomePage = ({ blogPosts }) => {
  console.log('blogPosts',blogPosts)
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.log("Adsense error:", e);
    }
  }, []);
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

  // Get blogs from other categories for related articles
  const getRelatedArticles = () => {
    if (!blogPosts || blogPosts.length === 0) return [];

    // Get all categories and count them
    const categoryCount = {};
    blogPosts.forEach((blog) => {
      const category = Array.isArray(blog?.category)
        ? blog?.category[0]
        : blog?.category || "";
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    // Find the most common category
    const mostCommonCategory = Object.keys(categoryCount).reduce((a, b) =>
      categoryCount[a] > categoryCount[b] ? a : b
    );

    // Filter blogs from other categories (excluding the most common one)
    const otherCategoryBlogs = blogPosts.filter((blog) => {
      const category = Array.isArray(blog?.category)
        ? blog?.category[0]
        : blog?.category || "";
      return category !== mostCommonCategory;
    });

    // Return first 3 blogs from other categories, or first 3 blogs if all are same category
    return otherCategoryBlogs.length >= 3
      ? otherCategoryBlogs.slice(0, 3)
      : blogPosts.slice(0, 3);
  };

  const relatedArticles = getRelatedArticles();

  return (
    <main className="bg-gray-50 dark:bg-gray-900  transition-all duration-500 ease-in-out min-h-screen w-full py-2 sm:py-4 md:py-6 lg:py-10 px-1 sm:px-2 md:px-4 lg:px-6 xl:px-8 2xl:px-12">
      <div className="w-full max-w-[1920px] mx-auto grid grid-cols-12 gap-4 sm:gap-6 md:gap-8">
        {/* Left Sidebar - Hidden on screens smaller than xl */}
        <div className="max-xl:hidden col-span-2">
          <GoogleAds />
        </div>

        {/* Main Content Area */}
        <div className="col-span-12 xl:col-span-8 relative max-w-[1200px] mx-auto xl:mx-0">
          <header className="mb-6 sm:mb-8 md:mb-10 text-center">
   
          </header>

          {/* News Carousel - Latest/Highlighted Posts */}
          {blogPosts && blogPosts.length > 0 && (
            <div className="mb-6 sm:mb-8 md:mb-10">
              <NewsCarousel blogPosts={blogPosts} autoSlideInterval={5000} />
            </div>
          )}

          {false ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-6">
              {[...Array(6)].map((_, index) => (
                <BlogSkeleton key={index} />
              ))}
            </div>
          ) : blogPosts?.length === 0 ? (
            <section
              className="flex justify-center items-center py-12 sm:py-16 md:py-20 lg:py-24"
              aria-label="Empty state">
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                No blog posts found.
              </p>
            </section>
          ) : (
            <section
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-6"
              aria-label="Blog posts">
              {blogPosts?.map((blog) => {
                const title = blog?.heroTitle || "";
                const blogslug = blog?.slug || textToSlug(title);
                const description = getDescription(blog);
                const category = Array.isArray(blog?.category)
                  ? blog?.category[0]
                  : blog?.category || "";
                const subCatgory = Array.isArray(blog?.subCatgory)
                  ? blog?.subCatgory[0]
                  : blog?.subCatgory || "";
                const imageUrl = blog?.heroImage?.url || "";
                const blogId = textToSlug(title);
                const categorySlug = textToSlug(category);
                const subCatgorySlug = textToSlug(subCatgory);

                return (
                  <article
                    key={blogId}
                    className="group bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 overflow-hidden hover:shadow-xl dark:hover:shadow-gray-800 transition-all duration-500 transform flex flex-col h-full">
                    <Link
                      href={`/${categorySlug}/${subCatgorySlug}/${blogslug}`}
                      className="flex flex-col h-full"
                      prefetch={false}>
                      {imageUrl && (
                        <div className="relative w-full h-40 sm:h-44 md:h-48 overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={title || "image"}
                            fill
                            className="object-cover transition-transform"
                          />
                          {subCatgory && (
                            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4">
                              <span className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 text-xs font-semibold px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                                {subCatgory}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-2 sm:p-3 md:p-4 flex-1 flex flex-col">
                        <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                          {title}
                        </h2>
                        {description && (
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 line-clamp-3 flex-1">
                            {description}
                          </p>
                        )}
                        <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold text-xs sm:text-sm group-hover:text-blue-700 dark:group-hover:text-blue-500 mt-auto pt-2">
                          <span>Read More</span>
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
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
                  </article>
                );
              })}
            </section>
          )}
        </div>

        {/* Right Sidebar - Hidden on screens smaller than xl */}
        <div className="max-xl:hidden col-span-2"></div>
      </div>

      {/* Google Ads Component */}
      <div className="w-full mt-6 sm:mt-8 md:mt-10 lg:mt-12">
        <GoogleAds />
      </div>
    </main>
  );
};

export default HomePage;
