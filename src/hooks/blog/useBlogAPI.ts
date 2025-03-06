// import { useCallback } from "react";
// import axios from "axios";
// import { BlogPost } from "@/types/blog.types";

// const baseURL = process.env.NEXT_PUBLIC_AUTH_DOMAIN
//   ? `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/blog`
//   : "http://localhost:3000/api/blog";

// const useBlogAPI = () => {
//   const fetchAllPosts = useCallback(async (): Promise<BlogPost[]> => {
//     try {
//       const response = await axios.get<BlogPost[]>(baseURL);
//       return response.data;
//     } catch (error) {
//       if (axios.isAxiosError(error) && error.response?.data?.message) {
//         throw new Error(error.response.data.message);
//       }
//       throw new Error("Failed to fetch posts.");
//     }
//   }, []);

//   const fetchPostBySlug = useCallback(
//     async (slug: string): Promise<BlogPost> => {
//       try {
//         const response = await axios.get<BlogPost>(
//           `${baseURL}?slug=${encodeURIComponent(slug)}`,
//         );
//         return response.data;
//       } catch (error) {
//         if (axios.isAxiosError(error) && error.response?.data?.message) {
//           throw new Error(error.response.data.message);
//         }
//         throw new Error(`Failed to fetch post with slug "${slug}".`);
//       }
//     },
//     [],
//   );

//   const createPost = useCallback(
//     async (postData: Partial<BlogPost>): Promise<BlogPost> => {
//       try {
//         const response = await axios.post<BlogPost>(baseURL, postData);
//         return response.data;
//       } catch (error) {
//         if (axios.isAxiosError(error) && error.response?.data?.message) {
//           throw new Error(error.response.data.message);
//         }
//         throw new Error("Failed to create post.");
//       }
//     },
//     [],
//   );

//   const updatePost = useCallback(
//     async (slug: string, updatedData: Partial<BlogPost>): Promise<BlogPost> => {
//       try {
//         const response = await axios.put<BlogPost>(
//           `${baseURL}/${encodeURIComponent(slug)}`,
//           updatedData,
//         );
//         return response.data;
//       } catch (error) {
//         if (axios.isAxiosError(error) && error.response?.data?.message) {
//           throw new Error(error.response.data.message);
//         }
//         throw new Error(`Failed to update post with slug "${slug}".`);
//       }
//     },
//     [],
//   );

//   const deletePost = useCallback(async (slug: string): Promise<void> => {
//     try {
//       await axios.delete(`${baseURL}/${encodeURIComponent(slug)}`);
//     } catch (error) {
//       if (axios.isAxiosError(error) && error.response?.data?.message) {
//         throw new Error(error.response.data.message);
//       }
//       throw new Error(`Failed to delete post with slug "${slug}".`);
//     }
//   }, []);

//   return {
//     fetchAllPosts,
//     fetchPostBySlug,
//     createPost,
//     updatePost,
//     deletePost,
//   };
// };

// export default useBlogAPI;
