import { useCallback } from "react";
import axios from "axios";
import { BlogPost } from "@/types/blog.types";

const baseURL = "/api/blog";

const useBlogAPI = () => {
  // Fetch all blog posts
  const fetchAllPosts = useCallback(async (): Promise<BlogPost[]> => {
    try {
      const response = await axios.get<BlogPost[]>(baseURL);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to fetch posts.");
    }
  }, []);

  // Fetch a blog post by slug
  const fetchPostBySlug = useCallback(
    async (slug: string): Promise<BlogPost> => {
      try {
        const response = await axios.get<BlogPost>(`${baseURL}/${slug}`);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
        throw new Error(`Failed to fetch post with slug "${slug}".`);
      }
    },
    [],
  );

  // Create a new blog post
  const createPost = useCallback(
    async (postData: Partial<BlogPost>): Promise<BlogPost> => {
      try {
        const response = await axios.post<BlogPost>(baseURL, postData);
        console.log("Created Post:", response.data);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
        throw new Error("Failed to create post.");
      }
    },
    [],
  );

  // Update an existing blog post
  const updatePost = useCallback(
    async (slug: string, updatedData: Partial<BlogPost>): Promise<BlogPost> => {
      try {
        const response = await axios.put<BlogPost>(
          `${baseURL}/${slug}`,
          updatedData,
        );
        console.log("Updated Post:", response.data);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
        throw new Error(`Failed to update post with slug "${slug}".`);
      }
    },
    [],
  );

  // Delete a blog post
  const deletePost = useCallback(async (slug: string): Promise<void> => {
    try {
      await axios.delete(`${baseURL}/${slug}`);
      console.log(`Deleted Post with slug: ${slug}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(`Failed to delete post with slug "${slug}".`);
    }
  }, []);

  return {
    fetchAllPosts,
    fetchPostBySlug,
    createPost,
    updatePost,
    deletePost,
  };
};

export default useBlogAPI;
