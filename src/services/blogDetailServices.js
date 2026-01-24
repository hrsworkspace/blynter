import { fetchGraphQL } from "./contentful";

export async function getBlogDetails({ slug, preview = true, lng = "en-US" }) {
  const blogDetailsData = await fetchGraphQL(
    `query {
      harshalCollection(where: { slug: "${slug}" }, preview: ${preview ? "true" : "false"}, limit: 1, locale: "${lng}") {
        items {
            _id
            heroTitle
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
  return blogDetailsData?.data?.harshalCollection?.items[0];
}
