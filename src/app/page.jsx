import { getAllBlogPosts, getAllBlynterTredingBlogPosts } from "@/services/blogServices";
import HomePage from "./home/homePage";

// Allow dynamic rendering to access searchParams
export const dynamic = "force-dynamic";
export const revalidate = false;

export const metadata = {
  title: {
    absolute: "Blynter | Personal Finance",
  },

  description:
    "Discover expert personal finance guides on budgeting, saving, investing, taxes, insurance, loans, and smart money management to help you achieve your financial goals.",

  keywords: [
    "personal finance",
    "money management",
    "budgeting",
    "saving money",
    "investing",
    "financial planning",
    "credit cards",
    "loans",
    "insurance",
    "tax planning",
    "mutual funds",
    "stock market",
    "wealth building",
    "passive income",
    "retirement planning",
  ],

  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || "https://www.blynter.com",
  },

  openGraph: {
    title: "Blynter | Personal Finance Guides & Money Tips",
    description:
      "Discover expert personal finance guides on budgeting, saving, investing, taxes, insurance, loans, and smart money management.",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://www.blynter.com",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Blynter | Personal Finance Guides & Money Tips",
    description:
      "Learn budgeting, investing, saving, taxes, insurance, and other practical personal finance strategies.",
  },
};

const getAllBlogPostsData = async (lng) => {
  try {
    const posts = await getAllBlogPosts({ preview: true, lng });
    if (posts && Array.isArray(posts)) {
      return posts;
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
};

const getAllBlynterTredingBlogPostsData = async (lng) => {
  try {
    const posts = await getAllBlynterTredingBlogPosts({ preview: true, lng });
    if (posts && Array.isArray(posts)) {
      return posts;
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
};

export default async function Home({ searchParams }) {
  // Extract and clean lng parameter
  let lng = searchParams?.lng || null;
  if (lng) {
    // Remove quotes if present (handles %22en-US%22 -> en-US)
    lng = lng.replace(/^["']|["']$/g, '').trim();
    // Decode URI component if needed
    try {
      lng = decodeURIComponent(lng);
    } catch (e) {
      // If decode fails, use as is
    }
  }
  const language = lng || "en-US";

  // console.log('[SERVER - ROOT] searchParams:', JSON.stringify(searchParams));
  // console.log('[SERVER - ROOT] Final language:', language);

  const blogPosts = await getAllBlogPostsData(language);
  const tredingBlogs = await getAllBlynterTredingBlogPostsData(language);

  return <HomePage blogPosts={blogPosts} tredingBlogs={tredingBlogs} />;
}
