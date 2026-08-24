import React from "react";
import Link from "next/link";
import { ChevronRight, User, BookOpen, Clock, Mail, Globe, Award } from "lucide-react";
import BlogCard from "@/components/BlogCard";
import ArticleSidebar from "@/components/ArticleSidebar";
import { getAllBlogPosts } from "@/services/blogServices";
import { textToSlug } from "@/helper/helper";
import Script from "next/script";

export const dynamic = "force-dynamic";
export const revalidate = false;

// Helper to normalize strings
const slugify = (val) => textToSlug(String(val || ""));

// Statically mapping author slugs to credentials/bios for professional authority (E-E-A-T)
const AUTHOR_PROFILES = {
  "blynter-editorial-team": {
    name: "Blynter Editorial Team",
    role: "Senior Editors & Contributors",
    bio: "Our team of dedicated sports journalists, movie critics, and entertainment analysts brings you verified, fact-checked reporting and reviews. Collectively spanning 25+ years in media, we strive to bring true fans the stories that shape the conversation.",
    avatarText: "BE",
    social: { email: "editorial@blynter.com", website: "https://blynter.com" },
    credentials: "Fact-Checked & Verified Team"
  },
  "admin": {
    name: "Blynter Editorial Team",
    role: "Senior Editors & Contributors",
    bio: "Our team of dedicated sports journalists, movie critics, and entertainment analysts brings you verified, fact-checked reporting and reviews. Collectively spanning 25+ years in media, we strive to bring true fans the stories that shape the conversation.",
    avatarText: "BE",
    social: { email: "editorial@blynter.com", website: "https://blynter.com" },
    credentials: "Fact-Checked & Verified Team"
  }
};

function getAuthorInfo(slug) {
  // Normalize and return profile
  const key = slugify(slug);
  return AUTHOR_PROFILES[key] || {
    name: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    role: "Contributing Writer",
    bio: `Contributing writer and editor at Blynter, focusing on in-depth reviews and sports analysis.`,
    avatarText: slug.substring(0, 2).toUpperCase(),
    social: { website: "https://blynter.com" },
    credentials: "Verified Contributor"
  };
}

export async function generateMetadata({ params }) {
  const { authorSlug } = await params;
  const info = getAuthorInfo(authorSlug);
  const title = `${info.name}, Author at Blynter | Editorial Team`;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://blynter.com"}/author/${authorSlug}`;

  return {
    title,
    description: info.bio.slice(0, 160),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description: info.bio.slice(0, 160),
      url: canonicalUrl,
      siteName: "Blynter",
      type: "profile",
    },
  };
}

export async function generateStaticParams() {
  try {
    const posts = await getAllBlogPosts({ preview: true });
    if (!Array.isArray(posts)) return [];

    const authors = new Set();
    posts.forEach((post) => {
      const author = post.publishedBy || "Blynter Editorial Team";
      authors.add(slugify(author));
    });

    return Array.from(authors).map((slug) => ({ authorSlug: slug }));
  } catch (err) {
    console.error("Error generating static params for authors:", err);
    return [];
  }
}

export default async function AuthorProfile({ params }) {
  const { authorSlug } = await params;
  const info = getAuthorInfo(authorSlug);

  const allPosts = await getAllBlogPosts({ preview: true }) || [];

  // Filter posts belonging to this author
  const authorPosts = allPosts.filter((post) => {
    const postAuthor = post.publishedBy || "Blynter Editorial Team";
    return slugify(postAuthor) === authorSlug || (authorSlug === "blynter-editorial-team" && slugify(postAuthor) === "admin");
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://blynter.com";
  const pageUrl = `${baseUrl}/author/${authorSlug}`;

  // Structured Data (Person Schema for credibility/E-E-A-T)
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: info.name,
    jobTitle: info.role,
    worksFor: {
      "@type": "Organization",
      name: "Blynter",
      url: baseUrl
    },
    description: info.bio,
    url: pageUrl,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Authors", item: `${baseUrl}/author/${authorSlug}` },
      { "@type": "ListItem", position: 3, name: info.name, item: pageUrl },
    ],
  };

  return (
    <>
      <Script
        id="schema-author-person"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Script
        id="schema-author-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="bg-secondary-50 dark:bg-secondary-950 min-h-screen pb-12">
        {/* ── Profile header ── */}
        <div className="bg-white dark:bg-secondary-900 border-b border-secondary-100 dark:border-secondary-800 py-10 lg:py-16">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-1.5 text-xs text-secondary-400 dark:text-secondary-500">
                <li>
                  <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    Home
                  </Link>
                </li>
                <ChevronRight size={10} className="text-secondary-300" />
                <li className="text-secondary-800 dark:text-secondary-200 font-medium">
                  Authors
                </li>
                <ChevronRight size={10} className="text-secondary-300" />
                <li className="text-secondary-800 dark:text-secondary-200 font-medium truncate max-w-[150px]">
                  {info.name}
                </li>
              </ol>
            </nav>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-primary-500/10 flex-shrink-0">
                {info.avatarText}
              </div>

              {/* Bio & Details */}
              <div className="text-center sm:text-left space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h1 className="font-heading text-2xl sm:text-3xl font-black text-secondary-900 dark:text-white leading-tight">
                    {info.name}
                  </h1>
                  {info.credentials && (
                    <span className="inline-flex items-center gap-1 self-center bg-accent-50 dark:bg-accent-950/30 text-accent-700 dark:text-accent-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-accent-100 dark:border-accent-800">
                      <Award size={12} />
                      {info.credentials}
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                  {info.role}
                </p>

                <p className="text-secondary-600 dark:text-secondary-350 max-w-3xl text-sm sm:text-base leading-relaxed">
                  {info.bio}
                </p>

                {/* Social icons */}
                <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-secondary-400 dark:text-secondary-500 text-sm">
                  {info.social.email && (
                    <a href={`mailto:${info.social.email}`} className="hover:text-primary-600 transition-colors flex items-center gap-1 font-medium">
                      <Mail size={14} /> Email
                    </a>
                  )}
                  {info.social.website && (
                    <a href={info.social.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors flex items-center gap-1 font-medium">
                      <Globe size={14} /> Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Content Grid ── */}
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">

            {/* Main author posts section */}
            <div className="lg:col-span-2 xl:col-span-3 space-y-6">
              <div className="section-header">
                <BookOpen size={18} className="text-primary-600" />
                <h2 className="section-title">Articles by {info.name}</h2>
                <div className="section-line" />
              </div>

              {authorPosts.length === 0 ? (
                <div className="bg-white dark:bg-secondary-900 rounded-2xl p-12 text-center border border-secondary-100 dark:border-secondary-800">
                  <span className="text-4xl mb-4 block">📭</span>
                  <h2 className="text-lg font-bold text-secondary-950 dark:text-white mb-2">No Articles Found</h2>
                  <p className="text-secondary-400 text-sm">This author hasn&apos;t published any articles yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {authorPosts.map((post, idx) => (
                    <BlogCard key={idx} blog={post} />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sidebar-sticky">
                <ArticleSidebar popularPosts={allPosts.slice(0, 5)} />
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
