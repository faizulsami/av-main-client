import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import connectMongoDB from "@/lib/db";

export async function GET(req: Request) {
  await connectMongoDB();
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");

    if (slug) {
      const post = await BlogPost.findOne({ slug: decodeURIComponent(slug) });
      if (!post) {
        return NextResponse.json(
          { message: "Post not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(post);
    }

    const posts = await BlogPost.find().sort({ date: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  await connectMongoDB();
  try {
    const formData = await req.formData();
    const body: Record<string, string> = {};
    let imagePath = "";

    for (const [key, value] of formData.entries()) {
      if (key === "image" && value instanceof Blob) {
        const buffer = Buffer.from(await value.arrayBuffer());
        const fileName = `${Date.now()}-${(value as File).name}`;
        const filePath = path.join(
          process.cwd(),
          "public/images/blog",
          fileName,
        );

        await writeFile(filePath, buffer);

        imagePath = `/images/blog/${fileName}`;
      } else {
        body[key] = value.toString();
      }
    }

    if (imagePath) {
      body.image = imagePath;
    }

    const newPost = new BlogPost(body);
    await newPost.save();

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { message: "Failed to create post", error: (error as Error).message },
      { status: 400 },
    );
  }
}

export async function PUT(req: Request) {
  await connectMongoDB();
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
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
      { message: "Failed to update post", error: (error as Error).message },
      { status: 400 },
    );
  }
}

export async function DELETE(req: Request) {
  await connectMongoDB();
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const deletedPost = await BlogPost.findByIdAndDelete(id);
    if (!deletedPost) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Failed to delete post:", error);
    return NextResponse.json(
      { message: "Failed to delete post", error: (error as Error).message },
      { status: 500 },
    );
  }
}
