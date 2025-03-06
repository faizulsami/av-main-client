import axios from "axios";
import { BlogPost, BlogApiResponse } from "../types/blog.types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const blogApi = {
  getSingleBlog: (id: string) => {
    return api.get<BlogApiResponse>(`/api/v1/blog-post/${id}`);
  },

  getAllBlogs: () => {
    return api.get<BlogApiResponse>("/api/v1/blog-post");
  },

  createBlog: (blogData: BlogPost) => {
    return api.post<BlogApiResponse>("/api/v1/blog-post/create-blog", blogData);
  },

  updateBlog: (id: string, blogData: Partial<BlogPost>) => {
    return api.patch<BlogApiResponse>(`/api/v1/blog-post/${id}`, blogData);
  },

  deleteBlog: (id: string) => {
    return api.delete<BlogApiResponse>(`/api/v1/blog-post/${id}`);
  },
};
