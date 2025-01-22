import { createBlogPost, getAllBlogPosts } from "@/services/blog.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await getAllBlogPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.log("Error fetching blog posts", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const blogPost = await request.json();
    const newPost = await createBlogPost(blogPost);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.log("Error creating blog post", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 },
    );
  }
}
