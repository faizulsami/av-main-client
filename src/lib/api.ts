import axios from "axios";
import { Blog, BlogResponse } from "@/types/blog.types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/blog-post`;

export const getBlogs = async (): Promise<BlogResponse> => {
  try {
    const response = await axios.get<BlogResponse>(API_URL);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching blogs:", error.message);
    } else {
      console.error("Error fetching blogs:", error);
    }
    throw new Error("Failed to fetch blogs");
  }
};

export const getSingleBlog = async (id: string): Promise<Blog> => {
  try {
    const response = await axios.get<Blog>(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching single blog:", error.message);
    } else {
      console.error("Error fetching single blog:", error);
    }
    throw new Error(`Failed to fetch blog with id ${id}`);
  }
};

export const createBlog = async (
  data: Omit<Blog, "_id" | "id" | "__v">,
): Promise<Blog> => {
  try {
    const response = await axios.post<Blog>(`${API_URL}/create-blog`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error creating blog:", error.message);
    } else {
      console.error("Error creating blog:", error);
    }
    throw new Error("Failed to create blog");
  }
};

export const updateBlog = async (
  id: string,
  data: Partial<Omit<Blog, "_id" | "id" | "__v">>,
): Promise<Blog> => {
  try {
    const response = await axios.patch<Blog>(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error updating blog:", error.message);
    } else {
      console.error("Error updating blog:", error);
    }
    throw new Error(`Failed to update blog with id ${id}`);
  }
};

export const deleteBlog = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error deleting blog:", error.message);
    } else {
      console.error("Error deleting blog:", error);
    }
    throw new Error(`Failed to delete blog with id ${id}`);
  }
};
