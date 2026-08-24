import React from "react";
import Link from "next/link";
import { ChevronRight, BookOpen } from "lucide-react";
import BlogCard from "@/components/BlogCard";
import ArticleSidebar from "@/components/ArticleSidebar";
import { getAllBlogPosts } from "@/services/blogServices";
import { textToSlug, getCategoryColor } from "@/helper/helper";
import { FLAGS, ADS_CONFIG } from "@/config/flags";
import Script from "next/script";

export const dynamic = "force-dynamic";
export const revalidate = false;

// Helper to normalize strings
const slugify = (val) => textToSlug(String(val || ""));

// Map subcategories to user-friendly titles and emojis
const SUBCATEGORY_META = {
  cricket: { name: "Cricket", emoji: "🏏", desc: "Live match coverage, post-match analysis, stats, player biographies, cricket news, and World Cup updates." },
  football: { name: "Football", emoji: "⚽", desc: "Premier League, Champions League, transfer rumors, football results, tactical analyses, and match predictions." },
  bollywood: { name: "Bollywood", emoji: "🎭", desc: "Bollywood movie reviews, upcoming movie trailers, celebrity gossip, box office statistics, and celebrity biographies." },
  hollywood: { name: "Hollywood", emoji: "⭐", desc: "Hollywood blockbuster updates, reviews of new cinematic releases, Oscar updates, series summaries, and director news." },
};

function getSubCategoryInfo(subCatSlug) {
  return SUBCATEGORY_META[subCatSlug] || {
    name: subCatSlug.charAt(0).toUpperCase() + subCatSlug.slice(1),
    emoji: "📂",
    desc: `Explore the latest news, detailed stories, and expert reviews in our ${subCatSlug} section.`,
  };
}

export async function generateMetadata({ params }) {
  const { category, subCatgory } = await params;
  const info = getSubCategoryInfo(subCatgory);
  const title = `Latest ${info.name} News, Stories & Reviews | Blynter`;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://blynter.com"}/${category}/${subCatgory}`;

  return {
    title,
    description: info.desc,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description: info.desc,
      url: canonicalUrl,
      siteName: "Blynter",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: info.desc,
    },
  };
}

export async function generateStaticParams() {
  try {
    const posts = await getAllBlogPosts({ preview: true });
    if (!Array.isArray(posts)) return [];

    const paths = [];
    posts.forEach((post) => {
      const cat = Array.isArray(post.category) ? post.category[0] : post.category;
      const sub = Array.isArray(post.subCatgory) ? post.subCatgory[0] : post.subCatgory;
      if (cat && sub) {
        paths.push({
          category: slugify(cat),
          subCatgory: slugify(sub),
        });
      }
    });

    return paths;
  } catch (err) {
    console.error("Error generating static params for subcategories:", err);
    return [];
  }
}

export default async function SubCategoryHub({ params }) {
  const { category, subCatgory } = await params;
  const info = getSubCategoryInfo(subCatgory);
  const parentName = category.charAt(0).toUpperCase() + category.slice(1);

  const allPosts = await getAllBlogPosts({ preview: true }) || [];

  // Filter posts belonging to this subcategory
  const subCategoryPosts = allPosts.filter((post) => {
    const sub = Array.isArray(post.subCatgory) ? post.subCatgory[0] : post.subCatgory;
    return slugify(sub) === subCatgory;
  });

  const featuredPost = subCategoryPosts[0];
  const gridPosts = subCategoryPosts.slice(1);
  const sidebarPopular = allPosts.slice(0, 5); // Fallback popular posts

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://blynter.com";
  const pageUrl = `${baseUrl}/${category}/${subCatgory}`;

  // Structured Data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: parentName, item: `${baseUrl}/${category}` },
      { "@type": "ListItem", position: 3, name: info.name, item: pageUrl },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${info.name} articles and reviews on Blynter`,
    description: info.desc,
    url: pageUrl,
  };

  return (
    <>
      <Script
        id="schema-subcategory-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="schema-subcategory-collection"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <main className="bg-secondary-50 dark:bg-secondary-950 min-h-screen pb-12">
        {/* ── Header banner ── */}
        <div className="bg-white dark:bg-secondary-900 border-b border-secondary-100 dark:border-secondary-800 py-10 lg:py-16">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-secondary-400 dark:text-secondary-500">
                <li>
                  <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    Home
                  </Link>
                </li>
                <ChevronRight size={10} className="text-secondary-300" />
                <li>
                  <Link href={`/${category}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {parentName}
                  </Link>
                </li>
                <ChevronRight size={10} className="text-secondary-300" />
                <li className="text-secondary-800 dark:text-secondary-200 font-medium">
                  {info.name}
                </li>
              </ol>
            </nav>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-secondary-900 dark:text-white flex items-center justify-center sm:justify-start gap-3">
              <span className="text-4xl sm:text-5xl">{info.emoji}</span>
              {info.name}
            </h1>
            <p className="mt-3 text-secondary-500 dark:text-secondary-400 max-w-2xl text-sm sm:text-base leading-relaxed">
              {info.desc}
            </p>
          </div>
        </div>

        {/* ── Content Grid ── */}
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">

            {/* Main posts section */}
            <div className="lg:col-span-2 xl:col-span-3 space-y-8">
              {subCategoryPosts.length === 0 ? (
                <div className="bg-white dark:bg-secondary-900 rounded-2xl p-12 text-center border border-secondary-100 dark:border-secondary-800">
                  <span className="text-4xl mb-4 block">📭</span>
                  <h2 className="text-lg font-bold text-secondary-950 dark:text-white mb-2">No Articles Found</h2>
                  <p className="text-secondary-400 text-sm mb-6">We are currently writing new stories for this subcategory. Stay tuned!</p>
                  <Link href="/" className="btn-primary">Back to Home</Link>
                </div>
              ) : (
                <>
                  {/* SubCategory Featured Post (Hero style) */}
                  {featuredPost && (
                    <div>
                      <div className="section-header mb-4">
                        <span className="w-1.5 h-5 bg-primary-600 rounded-full" />
                        <h2 className="section-title">Featured Article</h2>
                      </div>
                      <BlogCard blog={featuredPost} variant="hero" priority />
                    </div>
                  )}

                  {/* Ads Mid Content */}
                  {FLAGS.ENABLE_ADS && (
                    <div className="ad-container overflow-hidden min-h-[90px]">
                      <p className="text-xs text-secondary-300 dark:text-secondary-600 text-center py-1">Advertisement</p>
                      <ins
                        className="adsbygoogle"
                        style={{ display: "block" }}
                        data-ad-client={ADS_CONFIG.PUBLISHER_ID}
                        data-ad-slot={ADS_CONFIG.SLOTS.HOMEPAGE_MID}
                        data-ad-format="auto"
                        data-full-width-responsive="true"
                      />
                    </div>
                  )}

                  {/* Rest of the posts grid */}
                  {gridPosts.length > 0 && (
                    <div>
                      <div className="section-header mb-4">
                        <span className="w-1.5 h-5 bg-primary-600 rounded-full" />
                        <h2 className="section-title">Latest in {info.name}</h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {gridPosts.map((post, idx) => (
                          <BlogCard key={idx} blog={post} variant="default" />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sidebar-sticky">
                <ArticleSidebar popularPosts={sidebarPopular} />
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
