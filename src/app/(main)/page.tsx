import PostEditor from "@/components/posts/editor/PostEditor";
import Post from "@/components/posts/Post";
import prisma from "@/lib/prisma";
import { PostDataInclude } from "@/lib/types";

const Home = async () => {
  const posts = await prisma.post.findMany({
    include: PostDataInclude,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="w-full min-w-0">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
};

export default Home;
