"use client";
import { useState } from "react";
import Loading from "@/app/loading";
import FeaturedBlogCard from "./FeaturedBlogCard";
import CompactBlogCard from "./CompactBlogCard";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useBlogs } from "@/hooks/blog/useBlogs";

const BlogList = () => {
  const { blogs, loading, error } = useBlogs();
  const [isRecentBlogs, setIsRecentBlogs] = useState(6);

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

  // Filter blogs into featured and recent categories
  const featuredBlogs = blogs?.filter((blog) => blog.blogType === "featured");
  const recentBlogs = blogs?.filter((blog) => blog.blogType === "recent");

  console.log("Featured Blogs:", featuredBlogs);
  console.log("Recent Blogs:", recentBlogs);

  const handleSeeMore = () => {
    setIsRecentBlogs((prev) => prev + 6);
  };

  return (
    <div className="container mx-auto space-y-16 px-4 py-12">
      {/* Featured Articles Section */}
      <section>
        <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-soft-paste-dark">
          Featured Articles
        </h1>
        {featuredBlogs && featuredBlogs.slice(0).length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
            {/* Main Featured Blog */}
            <div className="lg:col-span-4">
              <FeaturedBlogCard
                key={featuredBlogs[0]._id}
                title={featuredBlogs[0].blogTitle}
                author={featuredBlogs[0].author}
                excerpt={featuredBlogs[0].excerpt}
                image={featuredBlogs[0].featuredImage}
                slug={featuredBlogs[0].blogSlug}
                content={featuredBlogs[0].content}
                blogCategory={featuredBlogs[0].blogCategory}
                date={format(
                  new Date(featuredBlogs[0].createdAt),
                  "dd MMM yyyy",
                )}
              />
            </div>
            {/* Right Column Blogs */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              {featuredBlogs.slice(1, 3).map((blog) => (
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
          </div>
        ) : (
          <p className="text-lg text-muted-foreground">
            No featured articles available.
          </p>
        )}
      </section>

      <Separator className="my-12" />

      {/* Recent Posts Section */}
      <section>
        <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-soft-paste-dark">
          Recent Posts
        </h1>
        {recentBlogs && recentBlogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentBlogs.slice(0, isRecentBlogs).map((blog) => (
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
            {recentBlogs.length > isRecentBlogs && (
              <Button
                className="mt-8 w-full bg-soft-paste-light text-primary font-semibold py-2 px-6 rounded-full hover:bg-primary/80 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={handleSeeMore}
              >
                See More
              </Button>
            )}
          </>
        ) : (
          <p className="text-lg text-muted-foreground">
            No recent posts available.
          </p>
        )}
      </section>
    </div>
  );
};

export default BlogList;
