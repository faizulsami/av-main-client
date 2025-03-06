"use client";

import { BlogDetail } from "@/components/pages/blog/BlogDetail";
import React from "react";

interface BlogPostPageProps {
  params: { id: string };
}

export default function BlogPage({ params }: BlogPostPageProps) {
  console.log("Params:", params);
  const { id } = React.use(params);

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
    <div className="container mx-auto p-4">
      <BlogDetail id={id} />
    </div>
  );
}
