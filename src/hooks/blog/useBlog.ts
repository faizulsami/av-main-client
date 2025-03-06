import api from "@/config/axios.config";
import { Blog, SingleBlogResponse } from "@/types/blog.types";
import { useEffect, useState } from "react";

export function useBlog(blogId: string) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await api.get<SingleBlogResponse>(
          `/api/v1/blog-post/${blogId}`,
        );

        if (response.data.success && response.data.data) {
          setBlog(response.data.data);
        } else {
          setError(new Error("Blog not found").message);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An error occurred while fetching blog");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogId]);

  return { blog, loading, error };
}
