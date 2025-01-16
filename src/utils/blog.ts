import axios from "axios";
import { BlogPost } from "@/types/blog.types";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL
  ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog`
  : "http://localhost:3000/api/blog";

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await axios.get<BlogPost>(`${baseURL}?slug=${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post with slug "${slug}":`, error);
    return null;
  }
}
