import { BlogPost } from "@/types/blog.types";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL
  ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog`
  : "http://localhost:3000/api/blog";

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${baseURL}?slug=${encodeURIComponent(slug)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching post with slug "${slug}":`, error);
    return null;
  }
}

export async function fetchAllPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(baseURL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }
}
