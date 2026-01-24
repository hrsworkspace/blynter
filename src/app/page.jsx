import { getAllBlogPosts } from "@/services/blogServices";
import HomePage from "./home/homePage";

// Allow dynamic rendering to access searchParams
export const dynamic = "force-dynamic";
export const revalidate = false;

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
  
  console.log('[SERVER - ROOT] searchParams:', JSON.stringify(searchParams));
  console.log('[SERVER - ROOT] Final language:', language);
  
  const blogPosts = await getAllBlogPostsData(language);

  return <HomePage blogPosts={blogPosts} />;
}
