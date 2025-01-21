import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface BlogPost {
  slug: string;
  content: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  tags: string[];
}

export interface BlogPostDocument extends BlogPost, Document {}

const blogPostSchema = new Schema<BlogPostDocument>({
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  readTime: { type: String, required: true },
  tags: { type: [String], required: true },
});

const BlogPostModel: Model<BlogPostDocument> =
  mongoose.models.BlogPost ||
  mongoose.model<BlogPostDocument>("BlogPost", blogPostSchema);

export default BlogPostModel;
