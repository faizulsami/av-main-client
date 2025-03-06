"use client";

import React from "react";
import { useBlogs } from "@/hooks/blog/useBlogs";
import BlogListTable from "./BlogListTable";
import Loading from "@/app/loading";

export default function BlogManagement() {
  const { blogs, refetch, loading, error } = useBlogs();

  if (loading) return <Loading />;
  if (error) {
    console.log("Error fetching blogs:", error);
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-2 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Blog Management</h2>
          <p className="text-muted-foreground text-sm">
            Manage your blog posts and their publication status
          </p>
        </div>
        {/* <div className="flex items-center space-x-2">
          <Button>Create Post</Button>
        </div> */}
      </div>
      <BlogListTable data={blogs || []} refetch={refetch} />
    </div>
  );
}
