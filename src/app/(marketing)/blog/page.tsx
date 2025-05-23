"use client";

import TitleHeader from "@/components/common/TitleHeader";
import BlogList from "@/components/pages/blog/BlogList";
// import RecentPosts from "@/components/pages/blog/RecentPosts";
// import VideosSection from "@/components/pages/blog/VideoSection";

const BlogPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-10 md:space-y-20">
      <TitleHeader title="Mental Health Insights & Resources" />
      <BlogList />
      {/* <RecentPosts /> */}
      {/* <VideosSection /> */}
    </div>
  );
};

export default BlogPage;
