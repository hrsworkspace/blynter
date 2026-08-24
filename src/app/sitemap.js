import { getAllBlogPosts, getAllBlynterTredingBlogPosts } from "@/services/blogServices";
import { textToSlug } from "@/helper/helper";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate at most every hour

const slugify = (val) => textToSlug(String(val || ""));

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.blynter.com";

  let posts = [];
  let trendingPosts = [];

  try {
    const fetchedPosts = await getAllBlogPosts({ preview: true });
    if (Array.isArray(fetchedPosts)) posts = fetchedPosts;
  } catch (err) {
    console.error("Error fetching main blog posts for sitemap:", err);
  }

  try {
    const fetchedTrending = await getAllBlynterTredingBlogPosts({ preview: true });
    if (Array.isArray(fetchedTrending)) trendingPosts = fetchedTrending;
  } catch (err) {
    console.error("Error fetching trending blog posts for sitemap:", err);
  }

  const allPosts = [...posts, ...trendingPosts];

  const currentDate = new Date().toISOString();

  // Static core routes
  const routesMap = new Map();

  const staticPages = [
    { path: "", priority: 1.0, changeFrequency: "daily" },
    { path: "about-us", priority: 0.7, changeFrequency: "monthly" },
    { path: "contact", priority: 0.6, changeFrequency: "monthly" },
    { path: "editorial-policy", priority: 0.5, changeFrequency: "monthly" },
    { path: "privacy-policy", priority: 0.4, changeFrequency: "monthly" },
    { path: "terms-condition", priority: 0.4, changeFrequency: "monthly" },
    { path: "disclaimer", priority: 0.4, changeFrequency: "monthly" },
    { path: "affiliate-disclosure", priority: 0.4, changeFrequency: "monthly" },
  ];

  staticPages.forEach((page) => {
    const pageUrl = page.path ? `${baseUrl}/${page.path}` : baseUrl;
    routesMap.set(pageUrl, {
      url: pageUrl,
      lastModified: currentDate,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  });

  // Default Categories & Subcategories mapped in app
  const defaultCategories = ["sports", "entertainment", "finance"];
  const defaultSubCategories = [
    "sports/cricket",
    "sports/football",
    "entertainment/bollywood",
    "entertainment/hollywood",
    "finance/personal-finance",
  ];

  defaultCategories.forEach((cat) => {
    const catUrl = `${baseUrl}/${cat}`;
    routesMap.set(catUrl, {
      url: catUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    });
  });

  defaultSubCategories.forEach((sub) => {
    const subUrl = `${baseUrl}/${sub}`;
    routesMap.set(subUrl, {
      url: subUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    });
  });

  // Process dynamic Contentful posts, categories, subcategories & authors
  allPosts.forEach((post) => {
    const blogSlug = post.slug || slugify(post.heroTitle || "");
    const rawCat = Array.isArray(post.category) ? post.category[0] : post.category;
    const rawSub = Array.isArray(post.subCatgory) ? post.subCatgory[0] : post.subCatgory;

    const catSlug = slugify(rawCat || "");
    const subSlug = slugify(rawSub || "");

    const author = post.publishedBy || "Blynter Editorial Team";
    const authorSlug = slugify(author);

    const postDate = post.sys?.publishedAt || post.sys?.firstPublishedAt || currentDate;

    // Add category hub if not present
    if (catSlug) {
      const catUrl = `${baseUrl}/${catSlug}`;
      if (!routesMap.has(catUrl)) {
        routesMap.set(catUrl, {
          url: catUrl,
          lastModified: currentDate,
          changeFrequency: "daily",
          priority: 0.9,
        });
      }
    }

    // Add subcategory hub if not present
    if (catSlug && subSlug) {
      const subUrl = `${baseUrl}/${catSlug}/${subSlug}`;
      if (!routesMap.has(subUrl)) {
        routesMap.set(subUrl, {
          url: subUrl,
          lastModified: currentDate,
          changeFrequency: "daily",
          priority: 0.8,
        });
      }
    }

    // Add author profile URL
    if (authorSlug) {
      const authorUrl = `${baseUrl}/author/${authorSlug}`;
      if (!routesMap.has(authorUrl)) {
        routesMap.set(authorUrl, {
          url: authorUrl,
          lastModified: currentDate,
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }

    // Add individual article page
    if (catSlug && subSlug && blogSlug) {
      const articleUrl = `${baseUrl}/${catSlug}/${subSlug}/${blogSlug}`;
      routesMap.set(articleUrl, {
        url: articleUrl,
        lastModified: new Date(postDate).toISOString(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  });

  return Array.from(routesMap.values());
}
