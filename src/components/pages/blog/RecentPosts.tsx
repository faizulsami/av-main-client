"use client";

import { useEffect, useState } from "react";
import BlogCard from "./FeaturedBlogCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Post {
  title: string;
  excerpt?: string;
  description: string;
  image: string;
  slug: string;
}

export default function RecentPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  console.log("Posts:", posts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/blog");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setPosts(result.data);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="w-full">
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-soft-paste">
            Recent Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="w-full">
      <div className="space-y-6">
        <h2 className="text-xl md:text-2xl font-bold text-soft-paste">
          Recent Posts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <BlogCard
              key={post.slug}
              title={post.title}
              excerpt={
                post.excerpt ||
                (post.description ? post.description.slice(0, 100) : "")
              }
              image={post.image}
              slug={post.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
