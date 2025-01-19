import { NextResponse } from "next/server";
import connectMongoDB from "../../db";
import BlogPost from "../schema";

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
