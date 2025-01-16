"use client";

import { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import useBlogAPI from "@/hooks/blog/useBlogAPI";
import { BlogPost } from "@/types/blog.types";

export default function RecentPosts() {
  const { fetchAllPosts } = useBlogAPI();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts: BlogPost[] = await fetchAllPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        setError((err as Error).message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [fetchAllPosts]);

  if (loading) {
    return (
      <section className="w-full">
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-soft-paste">
            Recent Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-gray-200 h-40 w-full rounded-lg"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (posts.length === 0) {
    return <p>No posts found.</p>;
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
              excerpt={post.excerpt || post.content.slice(0, 100)}
              image={post.image}
              slug={post.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
