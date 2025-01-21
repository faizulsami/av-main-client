import {
  deleteBlogPost,
  getBlogPostBySlug,
  updateBlogPost,
} from "@/services/blog.service";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);
    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(post);
  } catch (error) {
    console.log("Error fetching blog post", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const { slug } = await params;
    const updatedPost = await request.json();
    const post = await updateBlogPost(slug, updatedPost);
    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(post);
  } catch (error) {
    console.log("Error updating blog post", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const { slug } = await params;
    const success = await deleteBlogPost(slug);
    if (!success) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.log("Error deleting blog post", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 },
    );
  }
}
