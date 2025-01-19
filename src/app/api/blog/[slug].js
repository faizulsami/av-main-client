import { NextResponse } from "next/server";
import connectMongoDB from "../db";
import BlogPost from "./schema";

await connectMongoDB();

// Helper function to set CORS headers
function setCorsHeaders(response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// Handle preflight requests (OPTIONS)
export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 204 });
  return setCorsHeaders(response);
}

// Handle GET requests (Fetch a specific post by slug)
export async function GET(req) {
  try {
    const { pathname } = new URL(req.url);
    const slug = decodeURIComponent(pathname.split("/").pop());
    console.log("Received slug:", slug);

    const post = await BlogPost.findOne({ slug });
    if (!post) {
      const response = NextResponse.json(
        { message: "Post not found" },
        { status: 404 },
      );
      return setCorsHeaders(response);
    }
    const response = NextResponse.json(post, { status: 200 });
    return setCorsHeaders(response);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    const response = NextResponse.json(
      { message: "Error fetching blog post", error: error.message },
      { status: 500 },
    );
    return setCorsHeaders(response);
  }
}

// Handle PUT requests (Update a blog post by slug)
export async function PUT(req) {
  try {
    const { pathname } = new URL(req.url);
    const slug = decodeURIComponent(pathname.split("/").pop());
    const body = await req.json();
    const updatedPost = await BlogPost.findOneAndUpdate({ slug }, body, {
      new: true,
    });
    if (!updatedPost) {
      const response = NextResponse.json(
        { message: "Post not found" },
        { status: 404 },
      );
      return setCorsHeaders(response);
    }
    const response = NextResponse.json(updatedPost);
    return setCorsHeaders(response);
  } catch (error) {
    console.error("Failed to update post:", error);
    const response = NextResponse.json(
      { message: "Failed to update post", error: error.message },
      { status: 400 },
    );
    return setCorsHeaders(response);
  }
}

// Handle PATCH requests (Partial update of a blog post by slug)
export async function PATCH(req) {
  try {
    const { pathname } = new URL(req.url);
    const slug = decodeURIComponent(pathname.split("/").pop());
    const body = await req.json();
    const updatedPost = await BlogPost.findOneAndUpdate({ slug }, body, {
      new: true,
    });
    if (!updatedPost) {
      const response = NextResponse.json(
        { message: "Post not found" },
        { status: 404 },
      );
      return setCorsHeaders(response);
    }
    const response = NextResponse.json(updatedPost);
    return setCorsHeaders(response);
  } catch (error) {
    console.error("Failed to partially update post:", error);
    const response = NextResponse.json(
      { message: "Failed to partially update post", error: error.message },
      { status: 400 },
    );
    return setCorsHeaders(response);
  }
}

// Handle DELETE requests (Delete a blog post by slug)
export async function DELETE(req) {
  try {
    const { pathname } = new URL(req.url);
    const slug = decodeURIComponent(pathname.split("/").pop());
    const deletedPost = await BlogPost.findOneAndDelete({ slug });
    if (!deletedPost) {
      const response = NextResponse.json(
        { message: "Post not found" },
        { status: 404 },
      );
      return setCorsHeaders(response);
    }
    const response = NextResponse.json({
      message: "Post deleted successfully",
    });
    return setCorsHeaders(response);
  } catch (error) {
    console.error("Failed to delete post:", error);
    const response = NextResponse.json(
      { message: "Failed to delete post", error: error.message },
      { status: 500 },
    );
    return setCorsHeaders(response);
  }
}
