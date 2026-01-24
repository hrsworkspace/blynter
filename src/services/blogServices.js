import { fetchGraphQL } from "./contentful";
import { textToSlug } from "@/helper/helper";

export async function getAllBlogPosts({ preview = true, lng = "en-US" }) {
    const entriesData = await fetchGraphQL(
      `query {
        harshalCollection(locale: "${lng}") {
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
          }
        }
      }`,
      preview
    );
    return entriesData?.data?.harshalCollection?.items;
  }

export async function getBlogsBySubCatgory({ subCatgory, excludeSlug, limit = 3, preview = true, lng = "en-US" }) {
    try {
      const allBlogs = await getAllBlogPosts({ preview, lng });
      if (!Array.isArray(allBlogs)) return [];

      // Filter blogs by category
      const subCatgoryBlogs = allBlogs.filter((blog) => {
        const blogSubCatgory = Array.isArray(blog?.subCatgory)
          ? blog.subCatgory[0]
          : blog.subCatgory;
        return blogSubCatgory === subCatgory;
      });

      // Exclude current blog
      const filteredBlogs = excludeSlug
        ? subCatgoryBlogs.filter((blog) => {
            const blogSlug = blog?.slug || textToSlug(blog?.heroTitle || "");
            return blogSlug !== excludeSlug;
          })
        : subCatgoryBlogs;

      // Shuffle and return limited results
      const shuffled = [...filteredBlogs].sort(() => Math.random() - 0.5);
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
