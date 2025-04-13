// pages/blog/[slug].js
import { PropsWithChildren, useEffect, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Clock, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getSingleBlog } from "@/lib/api";
import { Blog } from "@/types/blog.types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

interface ImageComponentProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

const ImageComponent: React.FC<PropsWithChildren<ImageComponentProps>> = ({
  src,
  alt,
  width,
  height,
  ...props
}) => {
  if (!src) {
    return null;
  }

  return <Image src={src} alt={alt} width={width} height={height} {...props} />;
};

export const BlogDetail = ({ id }: { id: string }) => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const loadBlogPost = async () => {
      try {
        const response = await getSingleBlog(id);
        setBlog(response?.data);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogPost();
  }, [id]);

  if (isError) {
    return (
      <div className="min-h-[50vh] grid place-items-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Unable to load the blog post.</p>
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article
      className={cn(
        "max-w-4xl mx-auto px-4 py-6 md:py-12 animate-in fade-in duration-500",
        isLoading && "pointer-events-none",
      )}
    >
      <Link
        href="/blog"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Blog
      </Link>

      {isLoading ? (
        <BlogSkeleton />
      ) : (
        blog && (
          <>
            <header className="space-y-8 mb-12">
              <h1 className="text-4xl/tight font-bold tracking-tight lg:text-5xl/tight">
                {blog?.blogTitle}
              </h1>
              <div className="flex items-center gap-3 text-xs text-muted-foreground font-semibold">
                <div className="capitalize">
                  <span>{blog?.blogCategory}</span>
                </div>
                /
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={blog?.createdAt}>
                    {format(new Date(blog?.createdAt), "MMMM d, yyyy")}
                  </time>
                </div>
                /
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {Math.ceil(blog?.content.split(" ").length / 200)} min read
                  </span>
                </div>
              </div>
            </header>

            {blog?.featuredImage && (
              <div className="relative aspect-[2/1] mb-12 rounded-lg overflow-hidden">
                <Image
                  src={blog?.featuredImage || "/placeholder.svg"}
                  alt={blog?.blogTitle}
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                />
              </div>
            )}

            <div className="prose prose-gray max-w-none dark:prose-invert">
              <ReactMarkdown
                components={{
                  h1: ({ ...props }) => (
                    <h1 className="text-4xl font-bold" {...props} />
                  ),
                  h2: ({ ...props }) => (
                    <h2 className="text-2xl font-bold" {...props} />
                  ),
                  h3: ({ ...props }) => (
                    <h3 className="text-xl font-bold" {...props} />
                  ),
                  p: ({ ...props }) => <p className="mb-4" {...props} />,
                  ol: ({ ...props }) => <ol className="ml-8" {...props} />,
                  ul: ({ ...props }) => (
                    <ul className="ml-8 list-disc" {...props} />
                  ),
                  li: ({ ...props }) => <li className="mb-2" {...props} />,
                  img: ImageComponent,
                }}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeSlug]}
              >
                {blog?.content}
              </ReactMarkdown>
            </div>
          </>
        )
      )}
    </article>
  );
};

function BlogSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-12 w-[80%]" />
        <div className="flex gap-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
      <Skeleton className="aspect-[2/1] w-full rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[95%]" />
      </div>
    </div>
  );
}
