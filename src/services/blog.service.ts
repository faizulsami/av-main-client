// import connectMongoDB from "@/lib/db";
// import BlogPostModel, { type BlogPost } from "../models/Blog";

// export async function getAllBlogPosts(): Promise<BlogPost[]> {
//   await connectMongoDB();
//   const posts = await BlogPostModel.find().sort({ date: -1 }).lean();
//   return posts.map((post) => ({
//     slug: post.slug,
//     content: post.content,
//     title: post.title,
//     excerpt: post.excerpt,
//     image: post.image,
//     date: post.date,
//     author: post.author,
//     category: post.category,
//     readTime: post.readTime,
//     tags: post.tags,
//   }));
// }

// export async function getBlogPostBySlug(
//   slug: string,
// ): Promise<BlogPost | null> {
//   await connectMongoDB();
//   const post = await BlogPostModel.findOne({ slug }).lean();
//   if (!post) return null;
//   return {
//     slug: post.slug,
//     content: post.content,
//     title: post.title,
//     excerpt: post.excerpt,
//     image: post.image,
//     date: post.date,
//     author: post.author,
//     category: post.category,
//     readTime: post.readTime,
//     tags: post.tags,
//   };
// }

// export async function createBlogPost(blogPost: BlogPost): Promise<BlogPost> {
//   await connectMongoDB();
//   const createdPost = await BlogPostModel.create(blogPost);
//   return {
//     slug: createdPost.slug,
//     content: createdPost.content,
//     title: createdPost.title,
//     excerpt: createdPost.excerpt,
//     image: createdPost.image,
//     date: createdPost.date,
//     author: createdPost.author,
//     category: createdPost.category,
//     readTime: createdPost.readTime,
//     tags: createdPost.tags,
//   };
// }

// export async function updateBlogPost(
//   slug: string,
//   blogPost: Partial<BlogPost>,
// ): Promise<BlogPost | null> {
//   await connectMongoDB();
//   const updatedPost = await BlogPostModel.findOneAndUpdate({ slug }, blogPost, {
//     new: true,
//   }).lean();
//   if (!updatedPost) return null;
//   return {
//     slug: updatedPost.slug,
//     content: updatedPost.content,
//     title: updatedPost.title,
//     excerpt: updatedPost.excerpt,
//     image: updatedPost.image,
//     date: updatedPost.date,
//     author: updatedPost.author,
//     category: updatedPost.category,
//     readTime: updatedPost.readTime,
//     tags: updatedPost.tags,
//   };
// }

// export async function deleteBlogPost(slug: string): Promise<boolean> {
//   await connectMongoDB();
//   const result = await BlogPostModel.deleteOne({ slug });
//   return result.deletedCount === 1;
// }
