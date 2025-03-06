"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import { FilePenLine, FileText, Loader2, Save } from "lucide-react";
import { parseISO } from "date-fns";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { useBlog } from "@/hooks/blog/useBlog";
import Loading from "@/app/loading";
import { uploadImageToImgBB } from "@/services/imgbbService";
import Tiptap from "@/components/editor/Tiptap";
import { Textarea } from "@/components/ui/textarea";
import { blogApi } from "@/services/blogApi.service";

const formSchema = z.object({
  blogTitle: z
    .string()
    .min(2, { message: "Title must be at least 2 characters." }),
  blogSlug: z
    .string()
    .min(2, { message: "Slug must be at least 2 characters." }),
  blogCategory: z.string({ required_error: "Please select a category." }),
  excerpt: z
    .string()
    .min(10, { message: "Excerpt must be at least 10 characters." }),
  blogType: z.string({ required_error: "Please select a type." }),
  publishDate: z.date({ required_error: "Please select a date." }),
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters." }),
  featuredImage: z.string().optional(),
  author: z
    .string()
    .min(2, { message: "Author must be at least 2 characters." }),
});

type BlogFormValues = z.infer<typeof formSchema>;

export default function EditBlog() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState<string>("");
  const { blogId } = useParams();
  const { blog, loading, error } = useBlog(blogId as string);
  const { toast } = useToast();

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      blogTitle: "",
      blogSlug: "",
      blogCategory: "",
      excerpt: "",
      blogType: "",
      content: "",
      publishDate: new Date(),
      featuredImage: "",
      author: "",
    },
  });

  // Reset form values when blog data is fetched
  React.useEffect(() => {
    if (blog) {
      const publishDate = parseISO(blog.updatedAt).toISOString().split("T")[0];

      form.reset({
        blogTitle: blog.blogTitle,
        blogSlug: blog.blogSlug,
        blogCategory: blog.blogCategory,
        blogType: blog.blogType,
        excerpt: blog.excerpt || "",
        content: blog.content,
        publishDate: new Date(publishDate),
        featuredImage: blog.featuredImage,
        author: blog.author || "",
      });

      if (blog.featuredImage) {
        setImagePreview(blog.featuredImage);
      }
    }
  }, [blog, form]);

  // Handle image upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const imageUrl = await uploadImageToImgBB(file);
        form.setValue("featuredImage", imageUrl);
        setImagePreview(imageUrl);
      } catch (error) {
        console.error("Failed to upload image:", error);
        toast({
          title: "Error",
          description: "Failed to upload image.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  async function handleSubmit(data: BlogFormValues) {
    setIsLoading(true);
    try {
      const mappedData = {
        blogTitle: data.blogTitle,
        blogSlug: data.blogSlug,
        blogCategory: data.blogCategory,
        excerpt: data.excerpt,
        blogType: data.blogType,
        content: data.content,
        featuredImage: data.featuredImage,
        author: data.author,
      };

      const response = await blogApi.updateBlog(blogId as string, mappedData);
      console.log("API Response:", response.data);
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Blog updated successfully!",
        });
      } else {
        throw new Error("Failed to update blog.");
      }
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update blog.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Header */}
        <Card>
          <CardHeader className="p-0">
            <CardContent className="flex items-center justify-between p-4">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-soft-paste-dark-hover">
                <FilePenLine size={20} />
                Edit Blog Post
              </CardTitle>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-soft-paste"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Save size={20} />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </CardHeader>
        </Card>

        <div className="flex flex-col-reverse lg:flex-row gap-4 pb-6">
          {/* Left Card: Blog Details */}
          <Card className="pt-6 px-0 w-full lg:w-4/6">
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="blogTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Blog Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="blogSlug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Blog Slug" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      This is your blog post URL path.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Author Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Excerpt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a short excerpt for the blog"
                        {...field}
                        className="bg-white border-gray-300 min-h-40"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="blogCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="self-care">Self Care</SelectItem>
                        <SelectItem value="mental-health">
                          Mental Health
                        </SelectItem>
                        <SelectItem value="well-being">Well Being</SelectItem>
                        <SelectItem value="self-improvement">
                          Self Improvement
                        </SelectItem>
                        <SelectItem value="wellness-guide">
                          Wellness Guide
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="blogType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="recent">Recent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Content</FormLabel>
                    <FormControl>
                      <Tiptap content={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Right Card: Publishing Settings & Featured Image */}
          <Card className="py-4 px-0 w-full h-fit lg:w-2/6">
            <CardContent className="space-y-4">
              {/* <FormField
                control={form.control}
                name="publishDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Publish Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="featuredImage"
                render={({ index }: any) => (
                  <FormItem className="flex flex-col gap-3">
                    <FormLabel className="font-bold">Featured Image</FormLabel>
                    <FormControl className="flex flex-col items-center justify-center">
                      <div key={index}>
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full bg-[#F8FAFA] text-gray-700 border-gray-300 hover:bg-gray-100"
                          onClick={() =>
                            document.getElementById("image")?.click()
                          }
                        >
                          Choose File
                        </Button>
                        <span className="flex items-center gap-2 mt-2 text-gray-500 text-center text-sm">
                          <FileText size={16} />
                          {imagePreview ? "File chosen" : "No File Chosen"}
                        </span>
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs text-center">
                      SVG, PNG, JPG, or GIF (MAX. 800x400px)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
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
            </CardContent>
          </Card>
        </div>
      </form>
    </FormProvider>
  );
}
