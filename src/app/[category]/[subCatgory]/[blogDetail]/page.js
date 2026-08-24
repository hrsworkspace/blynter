import React from "react";
import BlogDetailPage from "./blogDetail";
import { getBlogDetails } from "@/services/blogDetailServices";
import { getAllBlogPosts, getBlogsBySubCatgory } from "@/services/blogServices";
import { textToSlug } from "@/helper/helper";
import Script from "next/script";

export const dynamic = "force-dynamic";
export const revalidate = false;

export async function generateMetadata({ params }) {
  const { category, subCatgory, blogDetail } = await params;
  const blogDetails = await getBlogDetailsData(blogDetail);

  const imageUrl = blogDetails?.heroImage?.url || "";
  const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://blynter.com"}/${category}/${subCatgory}/${blogDetails?.slug || blogDetail}`;

  return {
    title: blogDetails?.metaTitle || blogDetails?.heroTitle || "",
    description: blogDetails?.metaDescription || "",
    keywords: blogDetails?.metaKeywords || "",
    authors: [{ name: blogDetails?.publishedBy || "Blynter Team", url: "https://blynter.com" }],
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      locale: "en_US",
      url: canonicalUrl,
      siteName: "Blynter",
      title: blogDetails?.metaTitle || blogDetails?.heroTitle || "",
      description: blogDetails?.metaDescription || "",
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: blogDetails?.heroTitle || "" }] : [],
      publishedTime: blogDetails?.sys?.firstPublishedAt || "",
      modifiedTime: blogDetails?.sys?.publishedAt || "",
      authors: [blogDetails?.publishedBy || "Blynter Team"],
      section: category,
      tags: blogDetails?.metaKeywords ? String(blogDetails.metaKeywords).split(",") : [],
    },
    twitter: {
      card: "summary_large_image",
      title: blogDetails?.metaTitle || blogDetails?.heroTitle || "",
      description: blogDetails?.metaDescription || "",
      images: imageUrl ? [imageUrl] : [],
      creator: "@blynter",
      site: "@blynter",
    },
    publisher: "Blynter",
  };
}

export async function generateStaticParams() {
  try {
    const blogPosts = await getAllBlogPosts({ preview: true });
    if (!Array.isArray(blogPosts)) return [];

    return blogPosts
      .map((blog) => {
        const blogSlug   = blog?.slug || textToSlug(blog?.heroTitle || "");
        const category   = Array.isArray(blog?.category)   ? blog.category[0]   : blog.category;
        const subCatgory = Array.isArray(blog?.subCatgory) ? blog.subCatgory[0] : blog.subCatgory;
        const categorySlug   = textToSlug(category || "");
        const subCatgorySlug = textToSlug(subCatgory || "");

        if (!blogSlug || !categorySlug) return null;

        return {
          category:    categorySlug,
          subCatgory:  subCatgorySlug,
          blogDetail:  blogSlug,
        };
      })
      .filter(Boolean);
  } catch (err) {
    console.error("Error generating static params:", err);
    return [];
  }
}

async function getBlogDetailsData(blogSlug) {
  try {
    return await getBlogDetails({ slug: blogSlug, preview: true });
  } catch (err) {
    console.error("Error fetching blog details:", err);
    return null;
  }
}

export default async function BlogDetails({ params, searchParams }) {
  const { category, subCatgory, blogDetail } = await params;

  let lng = searchParams?.lng || null;
  if (lng) {
    lng = lng.replace(/^["']|["']$/g, "").trim();
    try { lng = decodeURIComponent(lng); } catch (_) {}
  }
  const language = lng || "en-US";

  const blogDetails     = await getBlogDetailsData(blogDetail);
  const relatedArticles = await getBlogsBySubCatgory({
    subCatgory,
    excludeSlug: blogDetail,
    limit: 6,
    preview: true,
    lng: language,
  });

  // ── JSON-LD Schemas ──
  const baseUrl  = process.env.NEXT_PUBLIC_BASE_URL || "https://blynter.com";
  const pageUrl  = `${baseUrl}/${category}/${subCatgory}/${blogDetails?.slug || blogDetail}`;
  const imageUrl = blogDetails?.heroImage?.url || "";
  const title    = blogDetails?.heroTitle || "";
  const author   = blogDetails?.publishedBy || "Blynter Team";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description: blogDetails?.metaDescription || "",
    image: imageUrl ? [imageUrl] : [],
    datePublished: blogDetails?.sys?.firstPublishedAt || blogDetails?.sys?.createdAt || new Date().toISOString(),
    dateModified: blogDetails?.sys?.publishedAt || blogDetails?.sys?.updatedAt || new Date().toISOString(),
    author: {
      "@type": "Person",
      name: author,
      url: `${baseUrl}/author/${textToSlug(author)}`,
    },
    publisher: {
      "@type": "Organization",
      name: "Blynter",
      url: baseUrl,
      logo: { "@type": "ImageObject", url: `${baseUrl}/favicon.ico` },
    },
    url: pageUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    articleSection: category,
    keywords: blogDetails?.metaKeywords || "",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",        item: baseUrl },
      { "@type": "ListItem", position: 2, name: category,      item: `${baseUrl}/${category}` },
      { "@type": "ListItem", position: 3, name: subCatgory,    item: `${baseUrl}/${category}/${subCatgory}` },
      { "@type": "ListItem", position: 4, name: title,         item: pageUrl },
    ].filter((item) => item.name),
  };

  const faqSchema = blogDetails?.faqs?.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: blogDetails.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }
    : null;

  return (
    <>
      <Script
        id="schema-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id="schema-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <Script
          id="schema-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <BlogDetailPage
        category={category}
        blogDetails={blogDetails}
        relatedArticles={relatedArticles}
      />
    </>
  );
}
