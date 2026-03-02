import { fetchGraphQL } from "./contentful";

export async function getBlogDetails({ slug, preview = true, lng = "en-US" }) {
  const blogDetailsData = await fetchGraphQL(
    `query {
      blynterCollection(where: { slug: "${slug}" }, preview: ${preview ? "true" : "false"}, limit: 1) {
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
              faqs
            publishedBy
            heroDescription {
                json
                        links {
            assets {
              block {
              sys { id }
              url
              title
              description
              contentType
            }
          }
        }
          

            }
        }
    }
}`,
    preview
  );
  const blynterTopTrendingdata = await fetchGraphQL( 
    `query {
      blynterTopTrendingCollection(where: { slug: "${slug}" }, preview: ${preview ? "true" : "false"}, limit: 1) {
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
              faqs
            publishedBy
            heroDescription {
                json
                        links {
            assets {
              block {
              sys { id }
              url
              title
              description
              contentType
            }
          }
        }

            }
        }
    }
}`,
preview
  )
  const blogItem =
  blogDetailsData?.data?.blynterCollection?.items?.[0] || {};

const trendingItem =
  blynterTopTrendingdata?.data?.blynterTopTrendingCollection?.items?.[0] || {};

// Merge both objects correctly
return {
  ...blogItem,
  ...trendingItem,
};}
