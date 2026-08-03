import { sanityClient } from "sanity:client";

export async function getPosts() {
  return await sanityClient.fetch(
    `*[_type == "post"] | order(publishedAt desc){
      title, "slug": slug.current, category, excerpt, publishedAt,
      "coverImage": coverImage.asset->url
    }`
  );
}

export async function getPost(slug: string) {
  return await sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title, category, publishedAt, body, "coverImage": coverImage.asset->url
    }`,
    { slug }
  );
}

export async function getCategories() {
  return await sanityClient.fetch(`array::unique(*[_type == "post"].category)`);
}