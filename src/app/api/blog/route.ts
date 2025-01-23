import { NextRequest, NextResponse } from "next/server";
import Blog from "@/models/Blog";
import { ApiError, apiResponse } from "@/lib/blog/api-response";
import connectMongoDB from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();

    const formData = await req.formData();
    const image = formData.get("image") as File;

    if (!image) {
      throw new ApiError(400, "Image is required");
    }

    const imageBuffer = await image.arrayBuffer();
    const imageData = Buffer.from(imageBuffer);

    const blogData = {
      title: formData.get("title"),
      author: formData.get("author"),
      date: new Date(formData.get("date") as string),
      category: formData.get("category"),
      info: formData.get("info"),
      description: formData.get("description"),
      slug: formData.get("slug"),
      image: {
        data: imageData,
        contentType: image.type,
      },
    };

    const blog = await Blog.create(blogData);

    return NextResponse.json(
      apiResponse.success(blog, "Blog post created successfully"),
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating blog post:", error);
    const message =
      error instanceof ApiError ? error.message : "Internal server error";
    const statusCode = error instanceof ApiError ? error.statusCode : 500;

    return NextResponse.json(apiResponse.error(message, statusCode), {
      status: statusCode,
    });
  }
}

export async function GET() {
  try {
    await connectMongoDB();

    const blogs = await Blog.find({})
      .select("-image.data")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      apiResponse.success(blogs, "Blogs retrieved successfully"),
    );
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(apiResponse.error("Failed to fetch blogs"), {
      status: 500,
    });
  }
}
