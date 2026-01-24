export async function fetchGraphQL(query, preview = false) {
  return fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${preview ? process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_ACCESS_TOKEN : process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN
        }`
    },
    body: JSON.stringify({ query })
  }).then((response) => response.json());
}

// console.log('env', {
//   "access_token": process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_ACCESS_TOKEN,
//   "preview_access_token": process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_ACCESS_TOKEN,
//   "space_id": process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
// })