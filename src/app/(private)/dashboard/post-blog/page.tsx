"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  title: string;
  author: string;
  date: string;
  category: string;
  info: string;
  description: string;
  image?: File;
}

export default function PostBlog() {
  const [post, setPost] = useState<BlogPost>({
    title: "",
    author: "",
    date: "",
    category: "",
    info: "",
    description: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPost({ ...post, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const slug = post.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const formData = new FormData();
      formData.append("title", post.title);
      formData.append("author", post.author);
      formData.append("date", post.date);
      formData.append("category", post.category);
      formData.append("info", post.info);
      formData.append("description", post.description);
      formData.append("slug", slug);
      formData.append("content", post.description);

      if (post.image) {
        formData.append("image", post.image);
      }

      const response = await fetch("/api/blog", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to post blog: ${response.statusText}`);
      }

      toast({
        title: "Blog posted successfully!",
        description: "Your blog post has been created and published.",
      });

      setPost({
        title: "",
        author: "",
        date: "",
        category: "",
        info: "",
        description: "",
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
        <CardTitle className="text-2xl font-semibold">
          Post a New Blog
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
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

          {/* Blog Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700">
              Blog Title
            </Label>
            <Input
              id="title"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              placeholder="Enter Title"
              className="bg-white border-gray-300"
            />
          </div>

          {/* Author and Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author" className="text-gray-700">
                Author
              </Label>
              <Input
                id="author"
                value={post.author}
                onChange={(e) => setPost({ ...post, author: e.target.value })}
                placeholder="Enter Author Name"
                className="bg-white border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="text-gray-700">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={post.date}
                onChange={(e) => setPost({ ...post, date: e.target.value })}
                className="bg-white border-gray-300"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-700">
              Post Category
            </Label>
            <Select
              value={post.category}
              onValueChange={(value) => setPost({ ...post, category: value })}
            >
              <SelectTrigger className="bg-white border-gray-300">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="education">Education</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Blog Info */}
          <div className="space-y-2">
            <Label htmlFor="info" className="text-gray-700">
              Blog Info
            </Label>
            <Textarea
              id="info"
              value={post.info}
              onChange={(e) => setPost({ ...post, info: e.target.value })}
              placeholder="Enter Post Information"
              className="bg-white border-gray-300 min-h-[100px] resize-none"
            />
          </div>

          {/* Blog Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700">
              Post Description
            </Label>
            <Textarea
              id="description"
              value={post.description}
              onChange={(e) =>
                setPost({ ...post, description: e.target.value })
              }
              placeholder="Enter Post Description"
              className="bg-white border-gray-300 min-h-[200px] resize-none"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-soft-paste hover:bg-soft-paste-active text-white font-semibold py-6"
        >
          {loading ? "Posting..." : "Post New Blog"}
        </Button>
      </CardFooter>
    </Card>
  );
}
