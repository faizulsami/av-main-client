import { NextRequest, NextResponse } from "next/server";
import Blog from "@/models/Blog";
import connectMongoDB from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    await connectMongoDB();

    const blog = await Blog.findOne({ slug: params.slug });

    if (!blog || !blog.image) {
      return new NextResponse("Image not found", { status: 404 });
    }

    return new NextResponse(blog.image.data, {
      headers: {
        "Content-Type": blog.image.contentType,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
