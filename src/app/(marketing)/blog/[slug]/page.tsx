import { format } from "date-fns";
import Image from "next/image";
import { fetchPostBySlug } from "@/utils/blog";
import ReactMarkdown from "react-markdown";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const slug = params?.slug;
  console.log("Fetching post with slug:", slug);

  if (!slug) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-500">Invalid Blog URL</h1>
        <p className="text-gray-600">
          Please ensure the URL is correct and try again.
        </p>
      </div>
    );
  }

  const post = await fetchPostBySlug(slug);
  console.log("Fetched post:", post);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-500">Blog Post Not Found</h1>
        <p className="text-gray-600">
          The blog post you are looking for does not exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="mb-10">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4 text-sm">
            <span className="font-medium">
              {post.author || "Author not specified"}
            </span>
            {post.date ? (
              <>
                <span>•</span>
                <time>{format(new Date(post.date), "MMMM dd, yyyy")}</time>
              </>
            ) : (
              <span>• Unknown Date</span>
            )}
          </div>
        </header>

        {/* Image Section */}
        {post.image ? (
          <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.image}
              alt={post.title || "Blog Image"}
              width={1920}
              height={1080}
              className="object-cover w-full"
              priority
            />
          </div>
        ) : (
          <div className="relative aspect-video mb-8 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
            <p className="text-gray-600">No Image Available</p>
          </div>
        )}

        {/* Content Section */}
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
