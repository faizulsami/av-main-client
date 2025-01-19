// import axios from "axios";
// import { BlogPost } from "@/types/blog.types";

// const baseURL = process.env.NEXT_PUBLIC_BASE_URL
//   ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog`
//   : "http://localhost:3000/api/blog";

// export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
//   try {
//     const response = await axios.get<BlogPost>(`${baseURL}?slug=${slug}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching post with slug "${slug}":`, error);
//     return null;
//   }
// }

export async function fetchPostBySlug(slug: string) {
  const baseURL = process.env.NEXT_PUBLIC_AUTH_DOMAIN
    ? `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/blog`
    : "http://localhost:3000/api/blog";

  const response = await fetch(`${baseURL}?slug=${encodeURIComponent(slug)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch post with slug "${slug}"`);
  }

  return response.json();
}
