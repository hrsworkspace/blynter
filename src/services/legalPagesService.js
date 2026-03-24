import { fetchGraphQL } from "./contentful";

export async function getLegalPageData({ slug, preview = true, lng = "en-US" }) {
  const legalPagesdata = await fetchGraphQL(
    `query {
      blynterLegalPagesCollection(where: { slug: "${slug}" }, preview: ${preview ? "true" : "false"}, limit: 1) {
        items {
          pageName
          slug
          description {
            json
          }
        }
      }
    }`,
    preview
  );
  return legalPagesdata?.data?.blynterLegalPagesCollection?.items?.[0] || null;
}
