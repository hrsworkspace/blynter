"use client";
import GoogleAds from "@/components/GoogleAds";
import { renderRichText, textToSlug } from "@/helper/helper";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckIcon } from "lucide-react";

const BlogDetailPage = ({ category, blogDetails, relatedArticles = [] }) => {
  const [copied, setCopied] = useState(false);
  const [urlPath] = useState(() => {
    if (typeof window !== "undefined") {
      return window.location.href || "";
    }
    return "";
  });

  // Helper function to extract description
  const getDescription = (blog) => {
    try {
      if (blog.heroDescription?.json?.content) {
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

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50">
  //       <div className="max-w-4xl mx-auto px-4 py-12">
  //         <div className="animate-pulse">
  //           <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
  //           <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
  //           <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
  //           <div className="space-y-4">
  //             <div className="h-4 bg-gray-200 rounded"></div>
  //             <div className="h-4 bg-gray-200 rounded"></div>
  //             <div className="h-4 bg-gray-200 rounded w-5/6"></div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  if (!blogDetails) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <section className="text-center" aria-label="Error message">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Blog Post Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The blog post you&apos;re looking for doesn&apos;t exist.
          </p>
          <nav aria-label="Navigation">
            <Link
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 font-semibold">
              ← Back to Home
            </Link>
          </nav>
        </section>
      </main>
    );
  }

  const imageUrl = blogDetails?.heroImage?.url || "";
  const title = blogDetails?.heroTitle || "";
  const publishedBy = blogDetails?.publishedBy || "";
  const description = blogDetails?.heroDescription?.json || {};
  const richTextLinks = blogDetails?.heroDescription?.links || [];
  const blogSubCategory = blogDetails?.subCatgory || "";
  const blogCategory = blogDetails?.category || category || "";

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-500 ease-in-out">
      {/* Hero Section */}
      {blogDetails && (
        <>
          {imageUrl && (
            <header
              className="relative w-full h-96 md:h-[500px] overflow-hidden"
              role="banner">
              <Image
                src={imageUrl}
                alt={title || "image"}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/40 dark:bg-black/50"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <div className="max-w-5xl mx-auto">
                  {blogSubCategory && (
                    <div className="mb-4">
                      <span className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 text-sm font-semibold px-4 py-2 rounded-full inline-block">
                        {blogSubCategory}
                      </span>
                    </div>
                  )}
                  {title && (
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                      {title}
                    </h1>
                  )}
                  {publishedBy && (
                    <div className="flex items-center text-white/90 text-sm">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>{publishedBy}</span>
                    </div>
                  )}
                </div>
              </div>
            </header>
          )}

          {/* Content Section */}
          <article className="max-w-5xl mx-auto px-4 py-12">
            {/* Header for non-hero layout */}
            {!imageUrl && (
              <header className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                {blogCategory && (
                  <div className="mb-4">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-semibold px-4 py-2 rounded-full">
                      {blogCategory}
                    </span>
                  </div>
                )}
                {title && (
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    {title}
                  </h1>
                )}
                {publishedBy && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>{publishedBy}</span>
                  </div>
                )}
              </header>
            )}

            {/* Rich Text Content */}
            <section className="prose prose-lg max-w-none dark:prose-invert">
              {description ? (
                <div className="text-gray-800 dark:text-gray-200">
                  {renderRichText(description, richTextLinks)}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  No content available.
                </p>
              )}
            </section>

            {/* Back Button */}

            <nav
              className="flex max-sm:flex-col max-sm:gap-8 max-sm:items-start justify-between items-center mt-12 pt-8 border-t border-black/20 dark:border-gray-500"
              aria-label="Breadcrumb navigation">
              <Link
                href="/"
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 duration-300 font-semibold transition-colors">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Blog Posts
              </Link>
              <TooltipProvider>
                <div className="flex items-center space-x-5">
                  <div className="text-black dark:text-white text-xl font-semibold max-sm:text-lg">
                    Share :
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(urlPath);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          } catch (err) {
                            console.error("Failed to copy:", err);
                          }
                        }}
                        className="text-gray hover:text-blue-400 dark:hover:text-blue-500 hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-300 cursor-pointer border rounded-lg p-1 inline-flex items-center justify-center"
                        aria-label="Copy link">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg">
                          {copied ? (
                            <CheckIcon className="w-5 h-5 text-green-500 " />
                          ) : (
                            <>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                              />
                            </>
                          )}
                        </svg>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center">
                      <p>Copy link</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        target="_blank"
                        className="text-gray hover:text-[#1877F2] transition-colors duration-300 inline-flex items-center justify-center"
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          urlPath
                        )}`}>
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center">
                      <p>Facebook</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        target="_blank"
                        className="text-gray hover:text-[#E4405F] transition-colors duration-300 inline-flex items-center justify-center"
                        href={`https://www.instagram.com/`}>
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.057-1.274-.07-1.649-.07-4.844 0-3.196.016-3.586.074-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                        </svg>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center">
                      <p>Instagram</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 hover:text-[#1DA1F2] transition-colors duration-300 inline-flex items-center justify-center"
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                          urlPath
                        )}&text=${encodeURIComponent(title)}`}>
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        <span className="sr-only">Share on Twitter</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center">
                      <p>Twitter</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        target="_blank"
                        className="text-gray hover:text-[#FF4500] transition-colors duration-300 inline-flex items-center justify-center"
                        href={`https://www.reddit.com/submit?url=${encodeURIComponent(
                          urlPath
                        )}&title=${encodeURIComponent(title)}`}>
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                        </svg>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center">
                      <p>Reddit</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        target="_blank"
                        className="text-gray hover:text-[#0A66C2] transition-colors duration-300 inline-flex items-center justify-center"
                        href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
                          urlPath
                        )}`}>
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center">
                      <p>LinkedIn</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </nav>
          </article>

          {/* Related Articles Section */}
          {relatedArticles && relatedArticles.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 py-12 mt-8 border-t border-black/20 dark:border-gray-500">
              <h2 className="items-center justify-center text-center text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((article) => {
                  const articleTitle = article?.heroTitle || "";
                  const articleImageUrl = article?.heroImage?.url || "";
                  const articleCategory = article?.category || "";
                  const articleSlug = article?.slug || textToSlug(articleTitle);
                  const categorySlug = textToSlug(articleCategory);
                  const articleDescription = getDescription(article);

                  return (
                    <article
                      key={articleSlug}
                      className="group bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 overflow-hidden hover:shadow-xl dark:hover:shadow-gray-800 transition-all duration-500 transform flex flex-col h-full">
                      <Link
                        href={`/${categorySlug}/${articleSlug}`}
                        className="flex flex-col h-full"
                        prefetch={false}>
                        {articleImageUrl && (
                          <div className="relative w-full h-48 overflow-hidden">
                            <Image
                              src={articleImageUrl}
                              alt={articleTitle || "image"}
                              fill
                              className="object-cover transition-transform "
                            />
                            {articleCategory && (
                              <div className="absolute top-3 left-3">
                                <span className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 text-xs font-semibold px-3 py-1 rounded-full">
                                  {articleCategory}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                            {articleTitle}
                          </h3>
                          {articleDescription && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3 flex-1">
                              {articleDescription}
                            </p>
                          )}
                          <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:text-blue-700 dark:group-hover:text-blue-500 mt-auto pt-2">
                            <span>Read More</span>
                            <svg
                              className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
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
              </div>
            </section>
          )}
        </>
      )}
      <GoogleAds />
    </main>
  );
};

export default BlogDetailPage;
