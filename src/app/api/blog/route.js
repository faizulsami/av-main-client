import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
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

// Handle GET requests (Fetch all blog posts or a specific post by slug)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    console.log("Received slug:", slug);

    let response;
    if (slug) {
      const post = await BlogPost.findOne({ slug });
      console.log("Fetched post:", post);
      if (!post) {
        response = NextResponse.json(
          { message: "Post not found" },
          { status: 404 },
        );
      } else {
        response = NextResponse.json(post, { status: 200 });
      }
    } else {
      const posts = await BlogPost.find();
      response = NextResponse.json(posts, { status: 200 });
    }

    return setCorsHeaders(response);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    const response = NextResponse.json(
      { message: "Error fetching blog posts", error: error.message },
      { status: 500 },
    );
    return setCorsHeaders(response);
  }
}

// Handle POST requests (Create a new blog post)
export async function POST(req) {
  try {
    const formData = await req.formData();
    const body = {};
    let imagePath = "";

    // Process FormData
    for (const [key, value] of formData.entries()) {
      if (key === "image" && value instanceof Blob) {
        // Handle file upload
        const buffer = Buffer.from(await value.arrayBuffer());
        const fileName = `${Date.now()}-${value.name}`;
        const filePath = path.join(
          process.cwd(),
          "public/images/blog",
          fileName,
        );

        // Save the file to the public/images/blog directory
        await writeFile(filePath, buffer);

        imagePath = `/images/blog/${fileName}`; // Public path to access the image
      } else {
        body[key] = value;
      }
    }

    // Add image path to the blog post data
    if (imagePath) {
      body.image = imagePath;
    }

    // Create a new BlogPost in the database
    const newPost = new BlogPost(body);
    await newPost.save();

    const response = NextResponse.json(newPost, { status: 201 });
    return setCorsHeaders(response);
  } catch (error) {
    console.error("Failed to create post:", error);
    const response = NextResponse.json(
      { message: "Failed to create post", error: error.message },
      { status: 400 },
    );
    return setCorsHeaders(response);
  }
}

// Handle PUT requests (Update a blog post by ID)
export async function PUT(req) {
  try {
    const { id } = req.nextUrl.searchParams;
    const body = await req.json();
    const updatedPost = await BlogPost.findByIdAndUpdate(id, body, {
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

// Handle PATCH requests (Partial update of a blog post by ID)
export async function PATCH(req) {
  try {
    const { id } = req.nextUrl.searchParams;
    const body = await req.json();
    const updatedPost = await BlogPost.findByIdAndUpdate(id, body, {
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

// Handle DELETE requests (Delete a blog post by ID)
export async function DELETE(req) {
  try {
    const { id } = req.nextUrl.searchParams;
    const deletedPost = await BlogPost.findByIdAndDelete(id);
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
