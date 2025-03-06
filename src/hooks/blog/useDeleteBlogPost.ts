import api from "@/config/axios.config";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export const useDeleteBlogPost = () => {
  const { toast } = useToast();
  const router = useRouter();

  const deleteBlogPost = async (id: string, refetch?: () => void) => {
    try {
      await api.delete(`/api/v1/blog-post/${id}`);

      toast({
        title: "Success",
        description: "Blog post deleted successfully.",
      });

      if (refetch) {
        refetch();
      }

      // Refresh the page or redirect
      router.refresh();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast({
        title: "Error",
        description: "Failed to delete blog post.",
        variant: "destructive",
      });
    }
  };

  return { deleteBlogPost };
};
