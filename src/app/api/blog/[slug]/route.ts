// import { NextRequest, NextResponse } from "next/server";
// import Blog from "@/models/Blog";
// import connectMongoDB from "@/lib/db";
// import { apiResponse } from "@/lib/blog/api-response";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { slug: string } },
// ) {
//   try {
//     await connectMongoDB();

//     const blog = await Blog.findOne({ slug: params.slug });

//     if (!blog) {
//       return NextResponse.json(apiResponse.error("Blog not found", 404), {
//         status: 404,
//       });
//     }

//     return NextResponse.json(
//       apiResponse.success(blog, "Blog retrieved successfully"),
//     );
//   } catch (error) {
//     console.error("Error fetching blog:", error);
//     return NextResponse.json(apiResponse.error("Failed to fetch blog"), {
//       status: 500,
//     });
//   }
// }
