export interface Post {
  image: string;
  _id: string;
  slug: string;
  title: string;
  content: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  __v: number;
}

export interface FetchPostResponse {
  success: boolean;
  message: string;
  data: Post[];
}

export async function fetchPostBySlug(
  slug: string,
): Promise<FetchPostResponse | null> {
  try {
    const response = await fetch(`/api/posts/${slug}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return null;
  }
}
