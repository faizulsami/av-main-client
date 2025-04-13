"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { BlogPost } from "@/types/blog.types";
import { blogApi } from "@/services/blogApi.service";
import { uploadImageToImgBB } from "@/services/imgbbService";
import Tiptap from "@/components/editor/Tiptap";
import { FilePlus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export default function PostBlog() {
  const [post, setPost] = useState<BlogPost>({
    blogTitle: "",
    content: "",
    blogSlug: "",
    blogCategory: "",
    excerpt: "",
    blogType: "tutorial",
    featuredImage: "",
    blogStatus: "published",
    author: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleContentChange = (newContent: string) => {
    setPost((prev) => ({
      ...prev,
      content: newContent,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      console.log("Uploading image:", file);
      try {
        const imageUrl = await uploadImageToImgBB(file);
        setPost({ ...post, featuredImage: imageUrl });
        setImagePreview(imageUrl);
      } catch (error) {
        console.error("Failed to upload image:", error);
        toast({
          title: "Error",
          description: "Failed to upload image.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!post.blogTitle || !post.content || !post.blogCategory) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const slug = post.blogTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const blogData = {
        ...post,
        blogSlug: slug,
      };

      const response = await blogApi.createBlog(blogData);
      const createdPost = response.data;
      console.log("Post Created!", createdPost);

      toast({
        title: "Blog posted successfully!",
        description: "Your blog post has been created and published.",
      });

      setPost({
        blogTitle: "",
        content: "",
        blogSlug: "",
        blogCategory: "",
        excerpt: "",
        blogType: "",
        featuredImage: "",
        blogStatus: "published",
        author: "",
      });
      setImagePreview("");
    } catch (error: unknown) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-soft-paste-dark-hover">
          <FilePlus size={20} className="text-soft-paste-dark" />
          Post a New Blog
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="mt-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant="outline"
                className="bg-[#F8FAFA] text-gray-700 border-gray-300 hover:bg-gray-100"
                onClick={() => document.getElementById("image")?.click()}
              >
                Choose File
              </Button>
              <span className="text-gray-500">
                {imagePreview ? "File chosen" : "No File Chosen"}
              </span>
            </div>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imagePreview && (
              <div className="relative w-full h-[200px] mt-2 rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="blogTitle" className="text-gray-700">
              Blog Title
            </Label>
            <Input
              id="blogTitle"
              value={post.blogTitle}
              onChange={(e) => setPost({ ...post, blogTitle: e.target.value })}
              placeholder="Enter Blog Title"
              className="bg-white border-gray-300"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-2 w-full">
            <div className="space-y-2 w-full">
              <Label htmlFor="author" className="text-gray-700">
                Author Name
              </Label>
              <Input
                id="author"
                value={post.author}
                onChange={(e) => setPost({ ...post, author: e.target.value })}
                placeholder="Enter Author Name"
                className="bg-white border-gray-300"
              />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="blogCategory" className="text-gray-700">
                Blog Category
              </Label>
              <Select
                value={post.blogCategory}
                onValueChange={(value) =>
                  setPost({ ...post, blogCategory: value })
                }
              >
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="psychology">Psychology</SelectItem>
                  <SelectItem value="wellness-guide">Wellness Guide</SelectItem>
                  <SelectItem value="relationships">Relationships</SelectItem>
                  <SelectItem value="therapy">Therapy</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="blogType" className="text-gray-700">
                Blog Type
              </Label>
              <Select
                value={post.blogType}
                onValueChange={(value) => setPost({ ...post, blogType: value })}
              >
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="recent">Recent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt" className="text-gray-700">
              Excerpt
            </Label>
            <Textarea
              id="excerpt"
              value={post.excerpt}
              onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
              placeholder="Enter a short excerpt for the blog"
              className="bg-white border-gray-300 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-gray-700">
              Blog Content
            </Label>
            <Tiptap content={post.content} onChange={handleContentChange} />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-soft-paste hover:bg-soft-paste-active text-white font-semibold py-6"
          >
            {loading ? "Posting..." : "Post New Blog"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
