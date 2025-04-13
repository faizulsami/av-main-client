"use client";

import { BlogDetail } from "@/components/pages/blog/BlogDetail";
import { useBlogs } from "@/hooks/blog/useBlogs";
import React from "react";
import Loading from "../loading";
import { format } from "date-fns";
import CompactBlogCard from "@/components/pages/blog/CompactBlogCard";

interface BlogPostPageProps {
  params: { id: string };
}

export default function BlogPage({ params }: BlogPostPageProps) {
  console.log("Params:", params);
  const { id } = React.use(params);
  const { blogs, loading, error } = useBlogs();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-lg text-muted-foreground">{error}</p>
      </div>
    );
  }

  const recentBlogs = blogs?.filter(
    (blog) => blog.blogType === "recent" && blog.blogSlug !== id,
  );

  if (!id) {
    return (
      <div className="container mx-auto p-4 text-center min-h-screen flex items-center justify-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-xl font-bold text-red-500">Invalid Blog Post</h1>
          <p className="text-gray-600">
            The blog post you are looking for does not exist or has been
            removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:flex lg:gap-10 lg:items-start lg:justify-center">
      <section className="">
        <BlogDetail id={id} />
      </section>
      <section className="w-72 py-6 md:py-12 hidden lg:block">
        <h1 className="mb-8 text-2xl font-extrabold tracking-tight text-soft-paste-dark">
          Recent Posts
        </h1>
        {recentBlogs && recentBlogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6">
              {recentBlogs.slice(0, 10).map((blog) => (
                <CompactBlogCard
                  key={blog._id}
                  title={blog.blogTitle}
                  image={blog.featuredImage}
                  slug={blog.blogSlug}
                  author={blog.author}
                  excerpt={blog.excerpt}
                  blogCategory={blog.blogCategory}
                  date={format(new Date(blog.createdAt), "dd MMM yyyy")}
                />
              ))}
            </div>
            {/* {recentBlogs.length > isRecentBlogs && (
              <Button
                className="mt-8 w-full bg-soft-paste-light text-primary font-semibold py-2 px-6 rounded-full hover:bg-primary/80 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={handleSeeMore}
              >
                See More
              </Button>
            )} */}
          </>
        ) : (
          <p className="text-lg text-muted-foreground">
            No recent posts available.
          </p>
        )}
      </section>
    </div>
  );
}
