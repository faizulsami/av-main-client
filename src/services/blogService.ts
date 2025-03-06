// import axios from "axios";
// import { BlogApiResponse, BlogPost } from "@/types/blog.types";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/";
// // const API_URL = "http://localhost:5000/api/v1";

// export const createBlogPost = async (post: BlogPost): Promise<BlogPost> => {
//   const formData = new FormData();
//   formData.append("blogTitle", post.blogTitle);
//   formData.append("content", post.content);
//   formData.append("blogSlug", post.blogSlug);
//   formData.append("blogCategory", post.blogCategory);
//   formData.append("blogType", post.blogType);

//   if (post.featuredImage) {
//     formData.append("featuredImage", post.featuredImage);
//   }

//   const response = await axios.post<BlogPost>(`${API_URL}/blogs`, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   return response.data;
// };

// export const updateBlogPost = async (
//   id: string,
//   post: BlogPost,
// ): Promise<BlogPost> => {
//   const formData = new FormData();
//   formData.append("blogTitle", post.blogTitle);
//   formData.append("content", post.content);
//   formData.append("blogSlug", post.blogSlug);
//   formData.append("blogCategory", post.blogCategory);
//   formData.append("blogType", post.blogType);

//   if (post.featuredImage) {
//     formData.append("featuredImage", post.featuredImage);
//   }

//   const response = await axios.put<BlogPost>(
//     `${API_URL}/blogs/${id}`,
//     formData,
//     {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     },
//   );
//   return response.data;
// };

// export const deleteBlogPost = async (id: string): Promise<void> => {
//   await axios.delete(`${API_URL}/blogs/${id}`);
// };

// export const fetchBlogPosts = async (): Promise<BlogApiResponse> => {
//   const response = await axios.get<BlogApiResponse>(`${API_URL}/blogs`);
//   return response.data;
// };

// export const fetchBlogPostById = async (id: string): Promise<BlogPost> => {
//   const response = await axios.get<BlogPost>(`${API_URL}/blogs/${id}`);
//   return response.data;
// };
