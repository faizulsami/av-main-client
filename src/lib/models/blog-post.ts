import mongoose from "mongoose";

const BlogPostSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    excerpt: { type: String },
    content: { type: String, required: true },
    image: { type: String },
    date: { type: Date, default: Date.now },
    author: { type: String, required: true },
    category: { type: String },
    readTime: { type: String },
    tags: { type: [String] },
  },
  {
    collection: "blogs",
  },
);

export default mongoose.models.BlogPost ||
  mongoose.model("BlogPost", BlogPostSchema);
