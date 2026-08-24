import { getAllBlogPosts, getAllBlynterTredingBlogPosts } from "@/services/blogServices";
import HomePage from "./home/homePage";

// Allow dynamic rendering to access searchParams
export const dynamic = "force-dynamic";
export const revalidate = false;

export const metadata = {
  title: {
    absolute: "Blynter | Sports Stories and Personal Finance",
  },
  description:
    "From thrilling sports moments to personal finance, Blynter covers stories that entertain and excite true fans. Expert analysis, breaking news, and in-depth coverage.",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || "https://www.blynter.com",
  },
  openGraph: {
    title: "Blynter | Sports Stories, Personal Finance",
    description:
      "From thrilling sports moments to personal finance, Blynter covers stories that entertain and excite true fans. Expert analysis, breaking news, and in-depth coverage.",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://www.blynter.com",
    type: "website",
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
