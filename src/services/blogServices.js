import { fetchGraphQL } from "./contentful";
import { textToSlug } from "@/helper/helper";

export async function getAllBlogPosts({ preview = true, lng = "en-US" }) {
    const entriesData = await fetchGraphQL(
      `query {
        blynterCollection{
          items {
            _id
            heroTitle
            slug
            metaTitle
            metaDescription
            metaKeywords
            category
            subCatgory
            heroImage {
              url
            }
            publishedBy
            heroDescription {
              json
            }
            faqs
          }
        }
      }`,
      preview
    );
    return entriesData?.data?.blynterCollection?.items;
  }

  export async function getAllBlynterTredingBlogPosts({ preview = true, lng = "en-US" }) {
    const entriesData = await fetchGraphQL(
      `query {
        blynterTopTrendingCollection{
          items {
            _id
            heroTitle
            slug
            metaTitle
            metaDescription
            metaKeywords
            category
            subCatgory
            heroImage {
              url
            }
            publishedBy
            heroDescription {
              json
            }
            faqs
          }
        }
      }`,
      preview
    );
    return entriesData?.data?.blynterTopTrendingCollection?.items;
  }

export async function getBlogsBySubCatgory({ category, subCatgory, excludeSlug, limit = 3, preview = true, lng = "en-US" }) {
    try {
      const allBlogs = await getAllBlogPosts({ preview, lng });
      if (!Array.isArray(allBlogs)) return [];

      const normalizeSlug = (value) => textToSlug(String(value || ""));

      // Fisher-Yates shuffle (unbiased)
      const shuffleArray = (arr) => {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
      };

      const normalizedExcludeSlug = excludeSlug ? normalizeSlug(excludeSlug) : null;
      const normalizedCategory = category ? normalizeSlug(category) : null;

      // Filter out the current blog first.
      let filteredBlogs = normalizedExcludeSlug
        ? allBlogs.filter((blog) => {
            const blogSlug = blog?.slug || textToSlug(blog?.heroTitle || "");
            return normalizeSlug(blogSlug) !== normalizedExcludeSlug;
          })
        : allBlogs;

      // Filter by category if category parameter matches "finance" or is provided.
      if (normalizedCategory) {
        const categoryFiltered = filteredBlogs.filter((blog) => {
          const blogCat = Array.isArray(blog?.category) ? blog.category[0] : blog?.category;
          return normalizeSlug(blogCat) === normalizedCategory;
        });
        if (categoryFiltered.length > 0) {
          filteredBlogs = categoryFiltered;
        }
      }

      const shuffled = shuffleArray(filteredBlogs);
      return shuffled.slice(0, limit);
    } catch (err) {
      console.error("Error fetching blogs by category:", err);
      return [];
    }
  }
  

export async function getCategoryWiseResources({ category }) {
    const entriesData = await fetchGraphQL(
        `query {
        resourceCollection(where:{category_contains_all:"${category}"}) {
              items{
                  ${POST_GRAPHQL_RESOURCE_CONTENT_DATA}
              }
              
            }
          }`
    );
    return entriesData?.data?.resourceCollection?.items;
}

export async function getResourceDetails({ slug, preview }) {
    const resourceDetailsData = await fetchGraphQL(
        `query {
      resourceCollection(where: { slug: "${slug}" }, preview: ${preview ? "true" : "false"
        }, limit: 1) {
                items {
                  ${POST_GRAPHQL_RESOURCE_DETAIL_DATA}
                }
              }
            }`
    );
    return { ...resourceDetailsData?.data?.resourceCollection?.items[0] };
}

export async function getResourceDetailsWithSlug() {
    const entries = await fetchGraphQL(
        `query {
      resourceCollection(where: { slug_exists: true }) {
                  items {
                    ${RESOUCE_DETAIL_TAG}
                  }
                }
              }`
    );
    return entries?.data?.resourceCollection?.items;
}

export async function getResourcePageDetail({ id, preview }) {
    const resourcePageData = await fetchGraphQL(
        `query {
      pageResource(id :"${id}",preview: ${preview ? "true" : "false"}) {
            ${POST_GRAPHQL_RESOURCE_PAGE_CONTENT_DATA}
        }
      }`
    );

    return resourcePageData?.data?.pageResource;
}

//home

// import { POST_GRAPHQL_SEOMETA_FIELDS } from "./contentful-seo";

// const POST_GRAPHQL_HOME_PAGE_CONTENT_DATA1 = `
// heroTitle
// heroDescription
// caseStudyCollection{
//   items{
//     banner{url}
//    website
//     slug
//     title
//     serviceOfferedCollection{
//       items{
//         title
//         slug
//       }
//     }
    
//   }
// }
// serviceTitle
// servicesCollection{
//   items{
//     title
//     slug
//     shortDescription
//     deliverables
//     bannerWide{
//       url
//     }
//     bannerRect{
//       url
//     }
//   }
// }
// seoMeta{
//   ${POST_GRAPHQL_SEOMETA_FIELDS}
// }
// `;

// const POST_GRAPHQL_HOME_PAGE_CONTENT_DATA2 = `
// impactTitle
// impactsCollection{
//   items{
//     header
//     content
//     subText
//     client{
//       slug
//     }
//   }
// }
// testimonialTitle
// testimonialsCollection{
//     items{
//       title
//       client {
//         title
//         slug
//         banner{
//           url
//         }
//         website
// }
//       feedback
//       clientName
//       clientTitle
//       clientPhoto{
//         url
//         title
//         fileName
//       }
//     	}
//   	}
//     customerLogoTitle`;

// export async function getHomePageDetail({ id, preview }) {
//     const entriesData1 = await fetchGraphQL(
//         `query {
//         pageHome(id :"${id}",preview: ${preview ? "true" : "false"}) {
//             ${POST_GRAPHQL_HOME_PAGE_CONTENT_DATA1}
          
//         }
//       }`
//     );
//     const entriesData2 = await fetchGraphQL(
//         `query {
//         pageHome(id :"${id}",preview: ${preview ? "true" : "false"}) {
//             ${POST_GRAPHQL_HOME_PAGE_CONTENT_DATA2}
          
//         }
//       }`
//     );
//     return { ...entriesData1?.data?.pageHome, ...entriesData2?.data?.pageHome };
// }
