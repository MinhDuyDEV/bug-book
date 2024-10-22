import { useToast } from "@/hooks/use-toast";
import { PostData, PostsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { deletePost } from "./action";

export function useDeletePostMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathName = usePathname();
  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletePost) => {
      const queryFilter: QueryFilters = { queryKey: ["post-feed"] };
      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter((p) => p.id !== deletePost.id),
            })),
          };
        },
      );
      toast({
        description: "post deleted",
      });
      if (pathName === `/post/${deletePost.id}`) {
        router.push(`/users/${deletePost.user.username}`);
      }
    },
    onError: (error) => {
      console.log("🚀 ~ useDeletePostMutation ~ error:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete post. Please try again.",
      });
    },
  });

  return mutation;
}
