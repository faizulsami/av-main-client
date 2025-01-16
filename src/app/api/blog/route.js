import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import connectMongoDB from "../db";
import BlogPost from "./schema";

await connectMongoDB();

// Handle GET requests (Fetch all blog posts or a specific post by slug)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      // Fetch a specific blog post by slug
      const post = await BlogPost.findOne({ slug });
      if (!post) {
        return NextResponse.json(
          { message: "Post not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(post, { status: 200 });
    }

    // Fetch all blog posts if no slug is provided
    const posts = await BlogPost.find();
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { message: "Error fetching blog posts", error: error.message },
      { status: 500 },
    );
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

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { message: "Failed to create post", error: error.message },
      { status: 400 },
    );
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
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Failed to update post:", error);
    return NextResponse.json(
      { message: "Failed to update post", error: error.message },
      { status: 400 },
    );
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
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Failed to partially update post:", error);
    return NextResponse.json(
      { message: "Failed to partially update post", error: error.message },
      { status: 400 },
    );
  }
}

// Handle DELETE requests (Delete a blog post by ID)
export async function DELETE(req) {
  try {
    const { id } = req.nextUrl.searchParams;
    const deletedPost = await BlogPost.findByIdAndDelete(id);
    if (!deletedPost) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Failed to delete post:", error);
    return NextResponse.json(
      { message: "Failed to delete post", error: error.message },
      { status: 500 },
    );
  }
}
